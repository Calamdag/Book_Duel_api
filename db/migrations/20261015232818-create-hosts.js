'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hosts', {
      host_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

username: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
      },

password_hash: {
        type: Sequelize.CHAR(60),
        allowNull: false,
      },

created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

async down(queryInterface) {
    await queryInterface.dropTable('hosts');
  },
};
