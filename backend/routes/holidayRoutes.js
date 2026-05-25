const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const c = require("../controllers/holidayController");

router.get("/", protect, c.getHolidays);
router.post("/", protect, authorizeRoles("admin", "staff"), c.createHoliday);
router.delete("/:id", protect, authorizeRoles("admin", "staff"), c.deleteHoliday);

module.exports = router;
