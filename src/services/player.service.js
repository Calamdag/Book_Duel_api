const playerRepository = require('../repositories/player.repository');
const sessionService = require('./session.service');
const { conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

// Your concept document: a game holds 2 to 30 players.
const MAX_PLAYERS = 30;

async function join(code, nickname, user) {
  const session = await sessionService.findOrFail(code);

  // Rejoin: this account already has a seat here. Same row, same score and HP.
  const seat = await playerRepository.findSeat(session.session_id, user.user_id);
  if (seat) return { session, player: seat, created: false };

  // New seat: only while the game is waiting, and only if there is room.
  if (session.status === 'ended') throw conflict('SESSION_ENDED', 'This game has ended.');
  if (session.status !== 'waiting') {
    throw conflict('SESSION_ALREADY_STARTED', 'This game has already started.');
  }
  const seatsTaken = await playerRepository.countBySession(session.session_id);
  if (seatsTaken >= MAX_PLAYERS) throw conflict('SESSION_FULL', 'This game is full.');

  try {
    const player = await playerRepository.create({
      session_id: session.session_id,
      user_id: user.user_id,
      nickname,
    });
    return { session, player, created: true };
  } catch (error) {
    const name = constraintOf(error);
    if (name && name.includes('nickname')) {
      throw conflict('NICKNAME_TAKEN', 'That nickname is already used in this game.');
    }
    throw error; // some other problem
  }
}

// Nicknames, HP and scores only. Never the school ID, name or email of another player.
async function list(code) {
  const session = await sessionService.findOrFail(code);
  return playerRepository.listBySession(session.session_id);
}

module.exports = { join, list };