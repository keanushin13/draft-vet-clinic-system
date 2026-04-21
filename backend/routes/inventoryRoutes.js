const router = require("express").Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const c = require("../controllers/inventoryController");

router.get("/", protect, c.getInventory);
router.post(
  "/",
  protect,
  authorizeRoles("admin", "staff"),
  c.createInventoryItem,
);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "staff"),
  c.updateInventoryItem,
);
router.patch(
  "/:id/stock",
  protect,
  authorizeRoles("admin", "staff"),
  c.updateStock,
);

module.exports = router;
