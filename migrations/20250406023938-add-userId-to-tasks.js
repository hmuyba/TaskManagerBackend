'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add userId column to Tasks table
    await queryInterface.addColumn('tasks', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',  // Reference to the 'Users' table
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',  // Delete associated tasks when a user is deleted
    });
  },

  async down (queryInterface, Sequelize) {
    // Revert changes by removing the userId column
    await queryInterface.removeColumn('tasks', 'userId');
  }
};
