const router = require("express").Router();
const { protect } = require("../middleware/auth");
const c = require("../controllers/petController");

router.get("/", protect, c.getPets);
router.get("/:id", protect, c.getPet);
router.post("/", protect, c.createPet);
router.put("/:id", protect, c.updatePet);
router.delete("/:id", protect, c.deletePet);

module.exports = router;
