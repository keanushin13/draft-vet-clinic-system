const router = require("express").Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const c = require("../controllers/profileController");

router.get("/", protect, authorizeRoles("admin", "staff"), c.getUsers);
router.get("/me", protect, c.getMe);
router.put("/me", protect, c.updateMe);
router.post("/create", protect, authorizeRoles("admin", "staff"), c.createUser);
router.put("/:id", protect, authorizeRoles("admin"), c.updateUser);

module.exports = router;
