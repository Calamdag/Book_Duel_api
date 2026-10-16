'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // 1. Find the host created by the first seeder
    const [[host]] = await db.query(
      "SELECT host_id FROM hosts WHERE username = 'demo_host_alpha'"
    );
    if (!host) throw new Error('demo_host_alpha not found. Run the demo-hosts seeder first.');

    // 2. Question set
    await queryInterface.bulkInsert('question_sets', [{
      host_id: host.host_id,
      title: 'Demo Web Development Duel',
      description: 'Fictional questions for testing the Book Duel API.',
      subject: 'Web Development',
      grade_level: 'College',
      created_at: new Date('2026-10-16T01:00:00Z'),
    }]);
    const [[set]] = await db.query(
      "SELECT question_set_id FROM question_sets WHERE title = 'Demo Web Development Duel'"
    );

    // 3. Questions
    await queryInterface.bulkInsert('questions', [
      { question_set_id: set.question_set_id, text: 'Which language is mainly used to style web pages?', type: 'multiple_choice', time_limit_sec: 20, position: 1 },
      { question_set_id: set.question_set_id, text: 'Which HTTP method is commonly used to retrieve data?', type: 'multiple_choice', time_limit_sec: 20, position: 2 },
      { question_set_id: set.question_set_id, text: 'Which tool manages packages in Node.js projects?', type: 'multiple_choice', time_limit_sec: 20, position: 3 },
    ]);
    const [questionRows] = await db.query(
      `SELECT question_id, position FROM questions
       WHERE question_set_id = ${set.question_set_id} ORDER BY position`
    );
    const q = {};
    questionRows.forEach((r) => { q[r.position] = r.question_id; });

    // 4. Choices (position 0 is the correct one for each question)
    await queryInterface.bulkInsert('choices', [
      { question_id: q[1], text: 'CSS',  position: 0, is_correct: true },
      { question_id: q[1], text: 'SQL',  position: 1, is_correct: false },
      { question_id: q[1], text: 'JSON', position: 2, is_correct: false },
      { question_id: q[2], text: 'GET',  position: 0, is_correct: true },
      { question_id: q[2], text: 'SEND', position: 1, is_correct: false },
      { question_id: q[2], text: 'PUSH', position: 2, is_correct: false },
      { question_id: q[3], text: 'npm',  position: 0, is_correct: true },
      { question_id: q[3], text: 'HTML', position: 1, is_correct: false },
      { question_id: q[3], text: 'CSS',  position: 2, is_correct: false },
    ]);
    const [choiceRows] = await db.query(
      `SELECT choice_id, question_id, position FROM choices
       WHERE question_id IN (${q[1]}, ${q[2]}, ${q[3]})`
    );
    const choiceFor = (qPos, cPos) =>
      choiceRows.find((c) => c.question_id === q[qPos] && c.position === cPos).choice_id;

    // 5. A session that has ENDED
    await queryInterface.bulkInsert('sessions', [{
      host_id: host.host_id,
      question_set_id: set.question_set_id,
      join_code: 'D3M042',
      status: 'closed',
      end_reason: 'completed',
      created_at: new Date('2026-10-16T02:00:00Z'),
      started_at: new Date('2026-10-16T02:01:00Z'),
      ended_at: new Date('2026-10-16T02:08:00Z'),
    }]);
    const [[session]] = await db.query(
      "SELECT session_id FROM sessions WHERE join_code = 'D3M042'"
    );
    const sid = session.session_id;

    // 6. Players: 3 completed (two tie at 30), 1 left early. Fictitious school IDs.
    await queryInterface.bulkInsert('session_players', [
      { session_id: sid, nickname: 'PixelPilot',   school_id: '2099-0001', hp: 5, score: 30, is_eliminated: false, is_winner: true,  joined_at: new Date('2026-10-16T02:00:30Z') },
      { session_id: sid, nickname: 'CodeComet',    school_id: '2099-0002', hp: 5, score: 30, is_eliminated: false, is_winner: true,  joined_at: new Date('2026-10-16T02:00:35Z') },
      { session_id: sid, nickname: 'BugHunter',    school_id: '2099-0003', hp: 3, score: 10, is_eliminated: false, is_winner: false, joined_at: new Date('2026-10-16T02:00:40Z') },
      { session_id: sid, nickname: 'EarlyQuitter', school_id: '2099-0004', hp: 0, score: 0,  is_eliminated: true,  is_winner: false, joined_at: new Date('2026-10-16T02:00:45Z') },
    ]);
    const [playerRows] = await db.query(
      `SELECT session_player_id, nickname FROM session_players WHERE session_id = ${sid}`
    );
    const p = {};
    playerRows.forEach((r) => { p[r.nickname] = r.session_player_id; });

    // 7. Three closed rounds
    await queryInterface.bulkInsert('rounds', [1, 2, 3].map((n) => ({
      session_id: sid,
      question_id: q[n],
      round_no: n,
      status: 'closed',
      is_voided: false,
      started_at: new Date(`2026-10-16T02:0${n}:00Z`),
      deadline_at: new Date(`2026-10-16T02:0${n}:20Z`),
      closed_at: new Date(`2026-10-16T02:0${n}:18Z`),
    })));
    const [roundRows] = await db.query(
      `SELECT round_id, round_no FROM rounds WHERE session_id = ${sid}`
    );
    const r = {};
    roundRows.forEach((x) => { r[x.round_no] = x.round_id; });

    // 8. Answers for the three players who completed the game
    const answer = (nick, round, cPos, correct, sec) => ({
      session_player_id: p[nick],
      round_id: r[round],
      choice_id: choiceFor(round, cPos),
      is_correct: correct,
      answered_at: new Date(`2026-10-16T02:0${round}:${sec}Z`),
    });

    await queryInterface.bulkInsert('answers', [
      answer('PixelPilot', 1, 0, true, '08'),
      answer('PixelPilot', 2, 0, true, '08'),
      answer('PixelPilot', 3, 0, true, '08'),
      answer('CodeComet',  1, 0, true, '09'),
      answer('CodeComet',  2, 0, true, '09'),
      answer('CodeComet',  3, 0, true, '09'),
      answer('BugHunter',  1, 0, true,  '10'),
      answer('BugHunter',  2, 1, false, '10'),
      answer('BugHunter',  3, 1, false, '10'),
    ]);
  },

  async down(queryInterface) {
    const db = queryInterface.sequelize;
    const sessionIds = "SELECT session_id FROM sessions WHERE join_code = 'D3M042'";
    const setIds = "SELECT question_set_id FROM question_sets WHERE title = 'Demo Web Development Duel'";

    await db.query(`DELETE FROM answers WHERE round_id IN (SELECT round_id FROM rounds WHERE session_id IN (${sessionIds}))`);
    await db.query(`DELETE FROM rounds WHERE session_id IN (${sessionIds})`);
    await db.query(`DELETE FROM session_players WHERE session_id IN (${sessionIds})`);
    await db.query("DELETE FROM sessions WHERE join_code = 'D3M042'");
    await db.query(`DELETE FROM choices WHERE question_id IN (SELECT question_id FROM questions WHERE question_set_id IN (${setIds}))`);
    await db.query(`DELETE FROM questions WHERE question_set_id IN (${setIds})`);
    await db.query("DELETE FROM question_sets WHERE title = 'Demo Web Development Duel'");
  },
};