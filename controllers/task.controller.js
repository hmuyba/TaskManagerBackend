const { Task } = require("../models");
const { Op } = require("sequelize");

const getTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Create a new task
const createTask = async (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const task = await Task.create({
      title,
      description,
      dueDate,
      status: "pendiente",
      userId: req.user.id,
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, status } = req.body;

  try {
    const task = await Task.findOne({ where: { id, userId: req.user.id } });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Prevent any changes to completed tasks
    if (task.status === "completada") {
      return res.status(400).json({ message: "Cannot modify a completed task" });
    }

    // Prevent invalid status transitions
    if (task.status === "pendiente" && status === "completada") {
      return res.status(400).json({
        message: "No se puede actualizar a completada desde pendiente",
      });
    }

    if (
      (task.status === "en progreso" || task.status === "completada") &&
      status === "pendiente"
    ) {
      return res.status(400).json({
        message: "Cannot revert to 'pendiente' from current status",
      });
    }

    // Valid status transitions
    if (task.status === "pendiente" && status === "en progreso") {
      task.status = "en progreso";
    } else if (task.status === "en progreso" && status === "completada") {
      task.status = "completada";
    }

    // Update other fields if provided
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ where: { id, userId: req.user.id } });

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.status !== "completada") {
      return res.status(400).json({
        message: "Only tasks with status 'completada' can be deleted",
      });
    }

    await task.destroy();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// List tasks with filters
const listTasks = async (req, res) => {
  const { status, search, from, to } = req.query;

  const where = {
    userId: req.user.id,
  };

  if (status) where.status = status;

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (from || to) {
    where.dueDate = {};
    if (from) where.dueDate[Op.gte] = new Date(from);
    if (to) where.dueDate[Op.lte] = new Date(to);
  }

  try {
    const tasks = await Task.findAll({ where });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  listTasks,
  getTask,
};
