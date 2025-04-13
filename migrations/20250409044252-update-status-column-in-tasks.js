'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, change the column to ENUM without setting a default value
    await queryInterface.changeColumn('tasks', 'status', {
      type: Sequelize.ENUM('pendiente', 'en progreso', 'completada'),
      allowNull: false,
    });

    // Then, manually set the default value for the 'status' column
    await queryInterface.sequelize.query(`
      ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'pendiente';
    `);
  },

  async down(queryInterface, Sequelize) {
    // Revert the 'status' column to a regular STRING column
    await queryInterface.changeColumn('tasks', 'status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
