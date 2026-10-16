// Hub Contract rule 7: one row per player per FINISHED game.
// "completed" = the player answered every non-voided round of the session.
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

async function findFinishedGamePlayers(since) {
  const sql = `
    SELECT s.join_code AS session_code,
           s.started_at,
           s.ended_at,
           u.school_id,
           p.nickname,
           p.score,
           (
             (SELECT COUNT(*)
                FROM answers a
                JOIN rounds r ON r.round_id = a.round_id
               WHERE a.session_player_id = p.session_player_id
                 AND r.is_voided = false)
             =
             (SELECT COUNT(*)
                FROM rounds r2
               WHERE r2.session_id = s.session_id
                 AND r2.is_voided = false)
           ) AS completed
      FROM sessions s
      JOIN session_players p ON p.session_id = s.session_id
      JOIN users u ON u.user_id = p.user_id
     WHERE s.status = 'closed'
       AND (CAST(:since AS timestamptz) IS NULL
            OR s.ended_at > CAST(:since AS timestamptz))
     ORDER BY s.ended_at DESC, p.score DESC
  `;

  return sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: { since: since ? since.toISOString() : null },
  });
}

module.exports = { findFinishedGamePlayers };