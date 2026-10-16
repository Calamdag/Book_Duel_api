'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('question_sets', {
      question_set_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

host_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hosts',
          key: 'host_id',
        },
      },

title: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },

description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

subject: {
        type: Sequelize.STRING(60),
        allowNull: true,
      },

grade_level: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },

created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

async down(queryInterface) {
    await queryInterface.dropTable('question_sets');
  },
};
