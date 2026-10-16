'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      { school_id: '2099-0001', full_name: 'Demo Player One',   email: 'player.one@demo.test',   role: 'player', created_at: new Date('2026-10-16T00:10:00Z') },
      { school_id: '2099-0002', full_name: 'Demo Player Two',   email: 'player.two@demo.test',   role: 'player', created_at: new Date('2026-10-16T00:11:00Z') },
      { school_id: '2099-0003', full_name: 'Demo Player Three', email: 'player.three@demo.test', role: 'player', created_at: new Date('2026-10-16T00:12:00Z') },
      { school_id: '2099-0004', full_name: 'Demo Player Four',  email: 'player.four@demo.test',  role: 'player', created_at: new Date('2026-10-16T00:13:00Z') },
      // Awkward case: an account that never joined a game
      { school_id: '2099-0005', full_name: 'Demo Never Joined', email: 'never.joined@demo.test', role: 'player', created_at: new Date('2026-10-16T00:14:00Z') },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};