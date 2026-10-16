'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('choices', {
      choice_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'question_id',
        },
      },

text: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },

position: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },

is_correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });

await queryInterface.addIndex(
      'choices',
      ['question_id', 'position'],
      {
        unique: true,
        name: 'choices_question_position_unique',
      }
    );
  },

async down(queryInterface) {
    await queryInterface.removeIndex(
      'choices',
      'choices_question_position_unique'
    );

await queryInterface.dropTable('choices');
  },
};
