const express = require("express");
const router = express.Router();
const userController = require('../controllers/usercontroller');

router.post("/student", userController.store_student);
router.get("/student", userController.fetch_all_students);
router.get("/student/:id", userController.single_student);
router.put("/student/:id",userController.update_student)
router.delete("/student/:id",userController.delete_student)


module.exports = router;