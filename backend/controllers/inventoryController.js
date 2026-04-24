const prisma = require("../lib/prisma");

const ALLOWED_INVENTORY_CATEGORIES = new Set([
  "Medication",
  "Vaccine",
  "Supplies",
  "Grooming",
  "Medical",
  "Vaccines",
  "TestKits",
  "Antibiotics",
  "Supplements",
  "EyeDrops",
  "EarDrops",
  "AntiParasite",
  "AntiInflammatory",
  "FoodSupplements",
  "ShampooAndSoap",
  "Others",
]);

// GET /api/inventory
exports.getInventory = async (req, res) => {
  try {
    const includeArchived = req.query.includeArchived === "true";
    const items = await prisma.inventoryItem.findMany({
      where: includeArchived ? {} : { isArchived: false },
      orderBy: { name: "asc" },
    });
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/inventory
exports.createInventoryItem = async (req, res) => {
  try {
    const {
      name,
      category,
      stock,
      unit,
      status,
      notes,
      price,
      expirationDate,
    } = req.body;
    if (!name || !category || !unit)
      return res
        .status(400)
        .json({ message: "name, category, unit are required" });

    if (!ALLOWED_INVENTORY_CATEGORIES.has(category)) {
      return res.status(400).json({ message: "Invalid inventory category" });
    }

    const parsedPrice =
      price === undefined || price === null || price === ""
        ? null
        : Number(price);
    if (parsedPrice !== null && Number.isNaN(parsedPrice)) {
      return res.status(400).json({ message: "price must be a valid number" });
    }

    const parsedExpirationDate =
      !expirationDate || expirationDate === ""
        ? null
        : new Date(expirationDate);
    if (parsedExpirationDate && Number.isNaN(parsedExpirationDate.getTime())) {
      return res
        .status(400)
        .json({ message: "expirationDate must be a valid date" });
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        stock: stock ? parseInt(stock) : 0,
        unit,
        status,
        notes,
        isArchived: false,
        price: parsedPrice,
        expirationDate: parsedExpirationDate,
      },
    });
    res.status(201).json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/inventory/:id
exports.updateInventoryItem = async (req, res) => {
  try {
    const {
      name,
      category,
      stock,
      unit,
      status,
      notes,
      price,
      expirationDate,
    } = req.body;

    const parsedPrice =
      price === undefined || price === null || price === ""
        ? undefined
        : Number(price);

    if (
      category !== undefined &&
      category !== null &&
      !ALLOWED_INVENTORY_CATEGORIES.has(category)
    ) {
      return res.status(400).json({ message: "Invalid inventory category" });
    }

    if (parsedPrice !== undefined && Number.isNaN(parsedPrice)) {
      return res.status(400).json({ message: "price must be a valid number" });
    }

    const parsedExpirationDate =
      expirationDate === undefined
        ? undefined
        : expirationDate === "" || expirationDate === null
          ? null
          : new Date(expirationDate);
    if (
      parsedExpirationDate !== undefined &&
      parsedExpirationDate !== null &&
      Number.isNaN(parsedExpirationDate.getTime())
    ) {
      return res
        .status(400)
        .json({ message: "expirationDate must be a valid date" });
    }

    const item = await prisma.inventoryItem.update({
      where: { id: req.params.id },
      data: {
        name,
        category,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        unit,
        status,
        notes,
        price: parsedPrice,
        expirationDate: parsedExpirationDate,
      },
    });
    res.json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/inventory/:id/stock
exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    if (stock === undefined)
      return res.status(400).json({ message: "stock is required" });

    const newStock = parseInt(stock);
    const status =
      newStock === 0 ? "OutOfStock" : newStock <= 10 ? "LowStock" : "InStock";

    const item = await prisma.inventoryItem.update({
      where: { id: req.params.id },
      data: { stock: newStock, status },
    });
    res.json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/inventory/:id
exports.deleteInventoryItem = async (req, res) => {
  try {
    const existing = await prisma.inventoryItem.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) return res.status(404).json({ message: "Item not found" });

    await prisma.inventoryItem.update({
      where: { id: req.params.id },
      data: { isArchived: true },
    });

    res.json({ message: "Item archived" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/inventory/:id/restore
exports.restoreInventoryItem = async (req, res) => {
  try {
    const existing = await prisma.inventoryItem.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) return res.status(404).json({ message: "Item not found" });

    const restored = await prisma.inventoryItem.update({
      where: { id: req.params.id },
      data: { isArchived: false },
    });

    res.json(restored);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
