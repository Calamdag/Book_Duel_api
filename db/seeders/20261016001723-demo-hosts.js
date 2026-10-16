'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('hosts', [
      {
        username: 'demo_host_alpha',
        password_hash:
          '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        created_at: new Date('2026-10-16T00:00:00Z'),
      },
      {
        username: 'demo_host_beta',
        password_hash:
          '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        created_at: new Date('2026-10-16T00:01:00Z'),
      },
    ]);
  },

async down(queryInterface) {
    await queryInterface.bulkDelete('hosts', {
      username: [
        'demo_host_alpha',
        'demo_host_beta',
      ],
    });
  },
};
