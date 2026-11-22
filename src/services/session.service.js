const sessionRepository = require('../repositories/session.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden, conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

// Hub Contract rule 5: six digits. 100000 to 999999 never starts with 0.
function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Rule: which status may follow which. A game never goes backward.
const NEXT_STATUS = {
  waiting: ['playing', 'ended'],
  playing: ['ended'],
  ended: [],
};

async function findOrFail(code) {
  const session = await sessionRepository.findByCode(code);
  if (!session) {
    throw notFound('SESSION_NOT_FOUND', `No game has the code ${code}.`);
  }
  return session;
}

function get(code) {
  return findOrFail(code);
}

// The client sends only which question set to play. The server makes the code.
async function create(questionSetId, user) {
  const questionSet = await questionSetRepository.findById(questionSetId);
  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${questionSetId}.`);
  }
  const mayUse = questionSet.host_id === user.user_id || user.role === 'ADMIN';
  if (!mayUse) throw forbidden('This question set belongs to another host.');

  // A random code can already be in use. The UNIQUE rule on join_code tells us, and we try again.
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      return await sessionRepository.create({
        question_set_id: questionSet.question_set_id,
        host_id: user.user_id,
        join_code: randomCode(),
      });
    } catch (error) {
      const name = constraintOf(error);
      if (!name || !name.includes('join_code')) throw error; // some other problem
    }
  }
  throw new Error('Could not make a free join code after 5 tries.'); // answers 500
}

// Starting and ending a game are a change of status, decided from the current one.
async function changeStatus(code, status, user) {
  const session = await findOrFail(code);
  if (session.host_id !== user.user_id && user.role !== 'ADMIN') {
    throw forbidden('This game belongs to another host.');
  }
  if (!NEXT_STATUS[session.status].includes(status)) {
    throw conflict('INVALID_STATUS_CHANGE', `A ${session.status} game cannot become ${status}.`);
  }
  const changes = { status };
  if (status === 'playing') changes.started_at = new Date();
  if (status === 'ended') {
    changes.ended_at = new Date();
    changes.end_reason = 'host_ended';
  }
  return sessionRepository.update(session, changes);
}

module.exports = { findOrFail, get, create, changeStatus };