// A database rule was broken -> what the client should hear.
// The key is the constraint name from YOUR migration. PostgreSQL names a
// foreign key "<table>_<column>_fkey" when the migration does not name it.
//
// A constraint that is not listed here still answers 409, with the code CONFLICT.
module.exports = {
  // Two players ask for the same nickname in the same instant.
  session_players_session_nickname_unique: {
    status: 409,
    code: 'NICKNAME_TAKEN',
    message: 'That nickname is already used in this game.',
  },

  // One account asks for two seats in the same game in the same instant.
  session_players_session_user_unique: {
    status: 409,
    code: 'ALREADY_JOINED',
    message: 'This account already has a seat in this game.',
  },

  // A question set that a game used, or that still has questions, cannot be deleted.
  sessions_question_set_id_fkey: {
    status: 409,
    code: 'QUESTION_SET_IN_USE',
    message: 'This question set was used in a game and cannot be deleted.',
  },
  questions_question_set_id_fkey: {
    status: 409,
    code: 'QUESTION_SET_IN_USE',
    message: 'This question set still has questions and cannot be deleted.',
  },
};