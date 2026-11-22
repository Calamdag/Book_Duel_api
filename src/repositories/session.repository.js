const { Session } = require('../models');

// The join code is what players type, so a game is found by code, never by id.
function findByCode(code) {
  return Session.findOne({ where: { join_code: code } }); // a row, or null
}

function create(data) {
  return Session.create(data);
}

function update(session, changes) {
  return session.update(changes);
}

module.exports = { findByCode, create, update };