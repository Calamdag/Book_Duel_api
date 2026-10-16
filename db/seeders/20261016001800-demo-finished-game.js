'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

// 1. Find the demo host created by demo-hosts.js
    const [hostRows] = await db.query(`
      SELECT host_id
      FROM hosts
      WHERE username = 'demo_host_alpha'
      LIMIT 1
    `);

if (hostRows.length === 0) {
      throw new Error(
        'demo_host_alpha was not found. Run the demo-hosts seeder first.'
      );
    }

const hostId = hostRows[0].host_id;

// 2. Create a question set
    await queryInterface.bulkInsert('question_sets', [
      {
        host_id: hostId,
        title: 'Demo Web Development Duel',
        description: 'Fictional questions for testing the Book Duel API.',
        subject: 'Web Development',
        grade_level: 'College',
        created_at: new Date('2026-10-16T01:00:00Z'),
      },
    ]);

const [questionSetRows] = await db.query(`
      SELECT question_set_id
      FROM question_sets
      WHERE title = 'Demo Web Development Duel'
      ORDER BY question_set_id DESC
      LIMIT 1
    `);

const questionSetId = questionSetRows[0].question_set_id;

// 3. Create questions
    await queryInterface.bulkInsert('questions', [
      {
        question_set_id: questionSetId,
        text: 'Which language is mainly used to style web pages?',
        type: 'multiple_choice',
        time_limit_sec: 20,
        position: 1,
      },
      {
        question_set_id: questionSetId,
        text: 'Which HTTP method is commonly used to retrieve data?',
        type: 'multiple_choice',
        time_limit_sec: 20,
        position: 2,
      },
      {
        question_set_id: questionSetId,
        text: 'Which technology is used to manage packages in Node.js projects?',
        type: 'multiple_choice',
        time_limit_sec: 20,
        position: 3,
      },
    ]);

const [questionRows] = await db.query(`
      SELECT question_id, position
      FROM questions
      WHERE question_set_id = :questionSetId
      ORDER BY position
    `, {
      replacements: { questionSetId },
    });

const questionByPosition = Object.fromEntries(
      questionRows.map((question) => [
        question.position,
        question.question_id,
      ])
    );

// 4. Create choices
    await queryInterface.bulkInsert('choices', [
      {
        question_id: questionByPosition[1],
        text: 'CSS',
        position: 0,
        is_correct: true,
      },
      {
        question_id: questionByPosition[1],
        text: 'SQL',
        position: 1,
        is_correct: false,
      },
      {
        question_id: questionByPosition[1],
        text: 'JSON',
        position: 2,
        is_correct: false,
      },
      {
        question_id: questionByPosition[2],
        text: 'GET',
        position: 0,
        is_correct: true,
      },
      {
        question_id: questionByPosition[2],
        text: 'SEND',
        position: 1,
        is_correct: false,
      },
      {
        question_id: questionByPosition[2],
        text: 'PUSH',
        position: 2,
        is_correct: false,
      },
      {
        question_id: questionByPosition[3],
        text: 'npm',
        position: 0,
        is_correct: true,
      },
      {
        question_id: questionByPosition[3],
        text: 'HTML',
        position: 1,
        is_correct: false,
      },
      {
        question_id: questionByPosition[3],
        text: 'CSS',
        position: 2,
        is_correct: false,
      },
    ]);

const [choiceRows] = await db.query(`
      SELECT choice_id, question_id, position
      FROM choices
      WHERE question_id IN (:questionIds)
      ORDER BY question_id, position
    `, {
      replacements: {
        questionIds: Object.values(questionByPosition),
      },
    });

const choiceFor = (questionPosition, choicePosition) => {
      const questionId = questionByPosition[questionPosition];

return choiceRows.find(
        (choice) =>
          choice.question_id === questionId &&
          choice.position === choicePosition
      ).choice_id;
    };

// 5. Create one finished session
    await queryInterface.bulkInsert('sessions', [
      {
        host_id: hostId,
        question_set_id: questionSetId,
        join_code: 'D3M042',
        status: 'closed',
        end_reason: 'completed',
        created_at: new Date('2026-10-16T02:00:00Z'),
        started_at: new Date('2026-10-16T02:01:00Z'),
        ended_at: new Date('2026-10-16T02:08:00Z'),
      },
    ]);

const [sessionRows] = await db.query(`
      SELECT session_id
      FROM sessions
      WHERE join_code = 'D3M042'
      LIMIT 1
    `);

const sessionId = sessionRows[0].session_id;

// 6. Create four players:
    //    Three completed players and one player who left early
    await queryInterface.bulkInsert('session_players', [
      {
        session_id: sessionId,
        nickname: 'PixelPilot',
        hp: 5,
        score: 30,
        is_eliminated: false,
        is_winner: true,
        joined_at: new Date('2026-10-16T02:00:30Z'),
      },
      {
        session_id: sessionId,
        nickname: 'CodeComet',
        hp: 5,
        score: 30,
        is_eliminated: false,
        is_winner: true,
        joined_at: new Date('2026-10-16T02:00:35Z'),
      },
      {
        session_id: sessionId,
        nickname: 'BugHunter',
        hp: 3,
        score: 10,
        is_eliminated: false,
        is_winner: false,
        joined_at: new Date('2026-10-16T02:00:40Z'),
      },
      {
        session_id: sessionId,
        nickname: 'EarlyQuitter',
        hp: 0,
        score: 0,
        is_eliminated: true,
        is_winner: false,
        joined_at: new Date('2026-10-16T02:00:45Z'),
      },
    ]);

const [playerRows] = await db.query(`
      SELECT session_player_id, nickname
      FROM session_players
      WHERE session_id = :sessionId
      ORDER BY session_player_id
    `, {
      replacements: { sessionId },
    });

const playerByNickname = Object.fromEntries(
      playerRows.map((player) => [
        player.nickname,
        player.session_player_id,
      ])
    );

// 7. Create three closed rounds
    await queryInterface.bulkInsert('rounds', [
      {
        session_id: sessionId,
        question_id: questionByPosition[1],
        round_no: 1,
        status: 'closed',
        is_voided: false,
        started_at: new Date('2026-10-16T02:01:00Z'),
        deadline_at: new Date('2026-10-16T02:01:20Z'),
        closed_at: new Date('2026-10-16T02:01:18Z'),
      },
      {
        session_id: sessionId,
        question_id: questionByPosition[2],
        round_no: 2,
        status: 'closed',
        is_voided: false,
        started_at: new Date('2026-10-16T02:02:00Z'),
        deadline_at: new Date('2026-10-16T02:02:20Z'),
        closed_at: new Date('2026-10-16T02:02:17Z'),
      },
      {
        session_id: sessionId,
        question_id: questionByPosition[3],
        round_no: 3,
        status: 'closed',
        is_voided: false,
        started_at: new Date('2026-10-16T02:03:00Z'),
        deadline_at: new Date('2026-10-16T02:03:20Z'),
        closed_at: new Date('2026-10-16T02:03:18Z'),
      },
    ]);

const [roundRows] = await db.query(`
      SELECT round_id, round_no
      FROM rounds
      WHERE session_id = :sessionId
      ORDER BY round_no
    `, {
      replacements: { sessionId },
    });

const roundByNumber = Object.fromEntries(
      roundRows.map((round) => [
        round.round_no,
        round.round_id,
      ])
    );

// 8. Add answers for the three players who completed the game
    await queryInterface.bulkInsert('answers', [
      // PixelPilot: three correct answers
      {
        session_player_id: playerByNickname.PixelPilot,
        round_id: roundByNumber[1],
        choice_id: choiceFor(1, 0),
        is_correct: true,
        answered_at: new Date('2026-10-16T02:01:08Z'),
      },
      {
        session_player_id: playerByNickname.PixelPilot,
        round_id: roundByNumber[2],
        choice_id: choiceFor(2, 0),
        is_correct: true,
        answered_at: new Date('2026-10-16T02:02:08Z'),
      },
      {
        session_player_id: playerByNickname.PixelPilot,
        round_id: roundByNumber[3],
        choice_id: choiceFor(3, 0),
        is_correct: true,
        answered_at: new Date('2026-10-16T02:03:08Z'),
      },

// CodeComet: three correct answers, creating a tie
      {
        session_player_id: playerByNickname.CodeComet,
        round_id: roundByNumber[1],
        choice_id: choiceFor(1, 0),
        is_correct: true,
        answered_at: new Date('2026-10-16T02:01:09Z'),
      },
      {
        session_player_id: playerByNickname.CodeComet,
        round_id: roundByNumber[2],
        choice_id: choiceFor(2, 0),
        is_correct: true,
        answered_at: new Date('2026-10-16T02:02:09Z'),
      },
      {
        session_player_id: playerByNickname.CodeComet,
        round_id: roundByNumber[3],
        choice_id: choiceFor(3, 0),
        is_correct: true,
        answered_at: new Date('2026-10-16T02:03:09Z'),
      },

// BugHunter: one correct answer and two incorrect answers
      {
        session_player_id: playerByNickname.BugHunter,
        round_id: roundByNumber[1],
        choice_id: choiceFor(1, 0),
        is_correct: true,
        answered_at: new Date('2026-10-16T02:01:10Z'),
      },
      {
        session_player_id: playerByNickname.BugHunter,
        round_id: roundByNumber[2],
        choice_id: choiceFor(2, 1),
        is_correct: false,
        answered_at: new Date('2026-10-16T02:02:10Z'),
      },
      {
        session_player_id: playerByNickname.BugHunter,
        round_id: roundByNumber[3],
        choice_id: choiceFor(3, 1),
        is_correct: false,
        answered_at: new Date('2026-10-16T02:03:10Z'),
      },
    ]);
  },

async down(queryInterface) {
    const db = queryInterface.sequelize;

const [sessionRows] = await db.query(`
      SELECT session_id
      FROM sessions
      WHERE join_code = 'D3M042'
      LIMIT 1
    `);

if (sessionRows.length === 0) {
      return;
    }

const sessionId = sessionRows[0].session_id;

const [roundRows] = await db.query(`
      SELECT round_id
      FROM rounds
      WHERE session_id = :sessionId
    `, {
      replacements: { sessionId },
    });

const roundIds = roundRows.map((round) => round.round_id);

if (roundIds.length > 0) {
      await queryInterface.bulkDelete('answers', {
        round_id: roundIds,
      });
    }

await queryInterface.bulkDelete('rounds', {
      session_id: sessionId,
    });

await queryInterface.bulkDelete('session_players', {
      session_id: sessionId,
    });

await queryInterface.bulkDelete('sessions', {
      session_id: sessionId,
    });

const [questionSetRows] = await db.query(`
      SELECT question_set_id
      FROM question_sets
      WHERE title = 'Demo Web Development Duel'
    `);

const questionSetIds = questionSetRows.map(
      (row) => row.question_set_id
    );

if (questionSetIds.length > 0) {
      const [questionRows] = await db.query(`
        SELECT question_id
        FROM questions
        WHERE question_set_id IN (:questionSetIds)
      `, {
        replacements: { questionSetIds },
      });

const questionIds = questionRows.map(
        (row) => row.question_id
      );

if (questionIds.length > 0) {
        await queryInterface.bulkDelete('choices', {
          question_id: questionIds,
        });

await queryInterface.bulkDelete('questions', {
          question_set_id: questionSetIds,
        });
      }

await queryInterface.bulkDelete('question_sets', {
        question_set_id: questionSetIds,
      });
    }
  },
};
