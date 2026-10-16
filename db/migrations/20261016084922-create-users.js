'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      school_id: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      full_name: { type: Sequelize.STRING(80), allowNull: false },
      email: { type: Sequelize.STRING(120), allowNull: false, unique: true },
      role: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'player' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};