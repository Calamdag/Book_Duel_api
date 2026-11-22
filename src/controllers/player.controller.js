const { matchedData } = require('express-validator');
const playerService = require('../services/player.service');

async function join(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const { nickname } = matchedData(req, { locations: ['body'] });
  const { session, player, created } = await playerService.join(code, nickname, req.user);

  // 201 Created for a new seat, 200 OK when the account already had one (rejoin).
  res.status(created ? 201 : 200).json({
    player_id: player.session_player_id,
    nickname: player.nickname,
    hp: player.hp,
    score: player.score,
    is_eliminated: player.is_eliminated,
    rejoined: !created,
    session: { code: session.join_code, status: session.status },
  });
}

async function list(req, res) {
  const { code } = matchedData(req);
  const players = await playerService.list(code);
  res.status(200).json(
    players.map((p) => ({
      nickname: p.nickname,
      hp: p.hp,
      score: p.score,
      is_eliminated: p.is_eliminated,
    }))
  );
}

module.exports = { join, list };