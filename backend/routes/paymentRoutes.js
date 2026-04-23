const router = require("express").Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const c = require("../controllers/paymentController");

router.get("/", protect, c.getPayments);
router.get("/:id", protect, c.getPayment);
router.post("/", protect, authorizeRoles("admin", "staff"), c.createPayment);
router.patch(
  "/:id",
  protect,
  authorizeRoles("admin", "staff"),
  c.updatePayment,
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "staff"),
  c.deletePayment,
);
router.patch(
  "/:id/restore",
  protect,
  authorizeRoles("admin", "staff"),
  c.restorePayment,
);

module.exports = router;
