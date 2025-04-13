'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Set all existing 'status' values to a valid one (e.g., 'pendiente')
    await queryInterface.sequelize.query(`
      UPDATE "tasks"
      SET "status" = 'pendiente'
      WHERE "status" IS NULL
    `);
    
    // Optionally, you can add more updates to handle other invalid statuses if needed.
  },

  async down(queryInterface, Sequelize) {
    // Nothing to revert as this only updates existing data
  }
};
