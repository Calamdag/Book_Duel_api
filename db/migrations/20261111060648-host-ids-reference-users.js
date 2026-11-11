'use strict';

module.exports = {
  async up(queryInterface) {
    // question_sets.host_id and sessions.host_id now point to users, not hosts
    await queryInterface.sequelize.query(
      'ALTER TABLE question_sets DROP CONSTRAINT IF EXISTS question_sets_host_id_fkey'
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_host_id_fkey'
    );

    await queryInterface.addConstraint('question_sets', {
      fields: ['host_id'],
      type: 'foreign key',
      name: 'question_sets_host_id_users_fkey',
      references: { table: 'users', field: 'user_id' },
    });
    await queryInterface.addConstraint('sessions', {
      fields: ['host_id'],
      type: 'foreign key',
      name: 'sessions_host_id_users_fkey',
      references: { table: 'users', field: 'user_id' },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('sessions', 'sessions_host_id_users_fkey');
    await queryInterface.removeConstraint('question_sets', 'question_sets_host_id_users_fkey');

    await queryInterface.addConstraint('sessions', {
      fields: ['host_id'],
      type: 'foreign key',
      name: 'sessions_host_id_fkey',
      references: { table: 'hosts', field: 'host_id' },
    });
    await queryInterface.addConstraint('question_sets', {
      fields: ['host_id'],
      type: 'foreign key',
      name: 'question_sets_host_id_fkey',
      references: { table: 'hosts', field: 'host_id' },
    });
  },
};