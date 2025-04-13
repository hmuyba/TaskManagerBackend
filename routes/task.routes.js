const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth.middleware");
const taskController = require("../controllers/task.controller");

router.use(authenticateToken); // All routes protected

router.get("/", taskController.listTasks);
router.get("/:id", taskController.getTask);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
