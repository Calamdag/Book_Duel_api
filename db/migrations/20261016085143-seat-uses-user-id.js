'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // The school ID now lives in the users table
    await queryInterface.removeColumn('session_players', 'school_id');

    await queryInterface.addColumn('session_players', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'user_id' },
    });

    // A real UNIQUE constraint: one seat per account per game
    await queryInterface.addConstraint('session_players', {
      fields: ['session_id', 'user_id'],
      type: 'unique',
      name: 'session_players_session_user_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('session_players', 'session_players_session_user_unique');
    await queryInterface.removeColumn('session_players', 'user_id');
    await queryInterface.addColumn('session_players', 'school_id', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
  },
};