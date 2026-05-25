const router = require("express").Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const c = require("../controllers/profileController");

router.get("/", protect, authorizeRoles("admin", "staff"), c.getUsers);
router.get("/me", protect, c.getMe);
router.put("/me", protect, c.updateMe);
router.post("/create", protect, authorizeRoles("admin", "staff"), c.createUser);
// public — no JWT (token is the credential)
router.get("/set-password/:token", c.getSetPasswordPage);
router.post("/set-password/:token", c.setPassword);

router.put("/:id", protect, authorizeRoles("admin", "staff"), c.updateUser);
router.patch(
  "/:id/toggle-active",
  protect,
  authorizeRoles("admin", "staff"),
  c.toggleUserActive,
);
router.delete("/:id", protect, authorizeRoles("admin"), c.deleteUser);
router.patch("/:id/restore", protect, authorizeRoles("admin"), c.restoreUser);
router.post(
  "/:id/reset-password",
  protect,
  authorizeRoles("admin"),
  c.adminResetPassword,
);

module.exports = router;
