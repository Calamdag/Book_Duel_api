'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

question_set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'question_sets',
          key: 'question_set_id',
        },
      },

text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

type: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },

time_limit_sec: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 20,
      },

position: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
    });

await queryInterface.addIndex(
      'questions',
      ['question_set_id', 'position'],
      {
        unique: true,
        name: 'questions_question_set_position_unique',
      }
    );
  },

async down(queryInterface) {
    await queryInterface.removeIndex(
      'questions',
      'questions_question_set_position_unique'
    );

await queryInterface.dropTable('questions');
  },
};
