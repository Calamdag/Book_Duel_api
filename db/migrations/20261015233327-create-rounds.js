'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rounds', {
      round_id: {
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

question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'question_id',
        },
      },

round_no: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },

status: {
        type: Sequelize.STRING(6),
        allowNull: false,
        defaultValue: 'open',
      },

is_voided: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

started_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

deadline_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

closed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

await queryInterface.addIndex(
      'rounds',
      ['session_id', 'round_no'],
      {
        unique: true,
        name: 'rounds_session_round_number_unique',
      }
    );
  },

async down(queryInterface) {
    await queryInterface.removeIndex(
      'rounds',
      'rounds_session_round_number_unique'
    );

await queryInterface.dropTable('rounds');
  },
};
