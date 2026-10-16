'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('answers', {
      answer_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

session_player_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'session_players',
          key: 'session_player_id',
        },
      },

round_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rounds',
          key: 'round_id',
        },
      },

choice_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'choices',
          key: 'choice_id',
        },
      },

is_correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

answered_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

await queryInterface.addIndex(
      'answers',
      ['session_player_id', 'round_id'],
      {
        unique: true,
        name: 'answers_player_round_unique',
      }
    );
  },

async down(queryInterface) {
    await queryInterface.removeIndex(
      'answers',
      'answers_player_round_unique'
    );

await queryInterface.dropTable('answers');
  },
};
