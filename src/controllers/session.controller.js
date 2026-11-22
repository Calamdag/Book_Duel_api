const { matchedData } = require('express-validator');
const sessionService = require('../services/session.service');

// What a client is allowed to see of a game.
function toJson(session) {
  return {
    code: session.join_code,
    status: session.status,
    question_set_id: session.question_set_id,
    end_reason: session.end_reason,
    created_at: session.created_at,
    started_at: session.started_at,
    ended_at: session.ended_at,
  };
}

async function create(req, res) {
  const { question_set_id: questionSetId } = matchedData(req, { locations: ['body'] });
  const session = await sessionService.create(questionSetId, req.user);
  res.status(201).json(toJson(session));
}

async function get(req, res) {
  const { code } = matchedData(req);
  const session = await sessionService.get(code);
  res.status(200).json(toJson(session));
}

async function changeStatus(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const { status } = matchedData(req, { locations: ['body'] });
  const session = await sessionService.changeStatus(code, status, req.user);
  res.status(200).json(toJson(session));
}

module.exports = { create, get, changeStatus };