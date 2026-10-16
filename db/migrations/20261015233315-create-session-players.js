'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('session_players', {
      session_player_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sessions',
          key: 'session_id',
        },
      },

nickname: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

hp: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 5,
      },

score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

is_eliminated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

is_winner: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

joined_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

await queryInterface.addIndex(
      'session_players',
      ['session_id', 'nickname'],
      {
        unique: true,
        name: 'session_players_session_nickname_unique',
      }
    );
  },

async down(queryInterface) {
    await queryInterface.removeIndex(
      'session_players',
      'session_players_session_nickname_unique'
    );

await queryInterface.dropTable('session_players');
  },
};
