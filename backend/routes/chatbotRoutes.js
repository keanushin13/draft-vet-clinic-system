const router = require("express").Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const c = require("../controllers/chatbotController");

router.post("/pet-owner", protect, authorizeRoles("pet_owner"), c.petOwnerChat);

module.exports = router;

