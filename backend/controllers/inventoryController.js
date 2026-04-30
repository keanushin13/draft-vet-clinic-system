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

const INVENTORY_AI_REPORT_ID = "singleton";
const INVENTORY_AI_MODEL = "gemini-2.0-flash";
const INVENTORY_GROQ_AI_MODEL = "llama-3.1-8b-instant";
const INVENTORY_AI_DISCLAIMER =
  "This analysis is AI-generated for inventory planning support only. Validate all recommendations with your veterinary team before making procurement, treatment, or pricing decisions.";

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

// POST /api/inventory/ai-analysis
exports.getInventoryAiAnalysis = async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === "true";
    const isVet = req.user.role === "veterinarian";

    if (isVet && forceRefresh) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const cached = await prisma.inventoryAiReport.findUnique({
      where: { id: INVENTORY_AI_REPORT_ID },
    });

    if (cached && (!forceRefresh || isVet)) {
      return res.json({
        insight: cached.aiInsight,
        isAiGenerated: true,
        fromCache: true,
        aiModel: cached.aiInsightModel,
        generatedAt: cached.generatedAt.toISOString(),
        disclaimer: INVENTORY_AI_DISCLAIMER,
      });
    }

    if (isVet && !cached) {
      return res.status(503).json({
        message:
          "AI inventory analysis has not been generated yet. Please ask staff to generate it.",
      });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!geminiApiKey && !groqApiKey) {
      return res
        .status(503)
        .json({ message: "AI service is not configured on this server" });
    }

    const [items, usageRows] = await Promise.all([
      prisma.inventoryItem.findMany({
        where: { isArchived: false },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          category: true,
          stock: true,
          unit: true,
          status: true,
          price: true,
          expirationDate: true,
        },
      }),
      prisma.appointmentInventoryUsage.groupBy({
        by: ["inventoryItemId"],
        _sum: { quantityUsed: true },
      }),
    ]);

    const usageByItemId = new Map(
      usageRows.map((row) => [row.inventoryItemId, row._sum.quantityUsed || 0]),
    );

    const usageSorted = [...items]
      .map((item) => ({
        ...item,
        usedQty: usageByItemId.get(item.id) || 0,
      }))
      .sort((a, b) => b.usedQty - a.usedQty);

    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    const nearExpiry = items
      .filter((item) => item.expirationDate)
      .map((item) => {
        const expiry = new Date(item.expirationDate);
        const daysUntilExpiry = Math.ceil((expiry - now) / msPerDay);
        return { item, daysUntilExpiry };
      })
      .filter(({ daysUntilExpiry }) => daysUntilExpiry <= 60)
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

    const fastMovingLines = usageSorted.slice(0, 20).map((entry, idx) => {
      const price =
        entry.price === null || entry.price === undefined
          ? "N/A"
          : Number(entry.price).toFixed(2);
      return `${idx + 1}. ${entry.name} | Category: ${entry.category} | Stock: ${entry.stock} ${entry.unit} | Status: ${entry.status} | Used in treatments: ${entry.usedQty} | Unit Price: PHP ${price}`;
    });

    const nearExpiryLines = nearExpiry
      .slice(0, 30)
      .map(({ item, daysUntilExpiry }) => {
        const price =
          item.price === null || item.price === undefined
            ? "N/A"
            : Number(item.price).toFixed(2);
        return `- ${item.name} | Category: ${item.category} | Stock: ${item.stock} ${item.unit} | Status: ${item.status} | Days to expiry: ${daysUntilExpiry} | Unit Price: PHP ${price}`;
      });

    const prompt = [
      "You are an inventory planning assistant for a veterinary clinic.",
      "Analyze inventory usage and expiration risk to support staff and veterinarians.",
      "",
      "Return your response in plain text with these exact section headings:",
      "FAST-MOVING PRODUCTS (AI Generated)",
      "NEAR-EXPIRY PRODUCTS (AI Generated)",
      "PROMOTION SUGGESTIONS (AI Generated)",
      "",
      "Rules:",
      "- Keep total response under 350 words.",
      "- Focus on practical action items for this clinic.",
      "- Mention products used in pet treatments as high-priority stock.",
      "- For near-expiry items, suggest safe promotions/bundles to clear stock responsibly.",
      "",
      `Total active inventory items: ${items.length}`,
      "",
      "Top usage items:",
      fastMovingLines.length > 0
        ? fastMovingLines.join("\n")
        : "No usage records yet.",
      "",
      "Near-expiry items (<= 60 days):",
      nearExpiryLines.length > 0
        ? nearExpiryLines.join("\n")
        : "No near-expiry items found.",
    ].join("\n");

    let insight = "";
    let selectedModel = "";
    let geminiRateLimitMessage = "";

    if (geminiApiKey) {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${INVENTORY_AI_MODEL}:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 800, temperature: 0.5 },
          }),
        },
      );

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        insight = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (insight) {
          selectedModel = INVENTORY_AI_MODEL;
        }
      } else {
        const errBody = await geminiRes.json().catch(() => ({}));
        console.error("Gemini API error:", errBody);
        const errMsg = errBody?.error?.message || "";
        const isRateLimit =
          geminiRes.status === 429 ||
          errMsg.toLowerCase().includes("quota") ||
          errMsg.toLowerCase().includes("rate");
        const retryMatch = errMsg.match(/(\d+\.?\d*)s/);
        const retrySeconds = retryMatch
          ? Math.ceil(parseFloat(retryMatch[1]))
          : 60;
        if (isRateLimit) {
          geminiRateLimitMessage = `AI service is temporarily rate-limited. Please try again in about ${retrySeconds} second${retrySeconds === 1 ? "" : "s"}.`;
        }
      }
    }

    if (!insight && groqApiKey) {
      const groqRes = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: INVENTORY_GROQ_AI_MODEL,
            messages: [
              {
                role: "system",
                content:
                  "You are an inventory planning assistant for a veterinary clinic. Give concise, actionable recommendations.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.5,
            max_tokens: 900,
          }),
        },
      );

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        insight = groqData.choices?.[0]?.message?.content?.trim() || "";
        if (insight) {
          selectedModel = `groq:${INVENTORY_GROQ_AI_MODEL}`;
        }
      } else {
        const groqErr = await groqRes.json().catch(() => ({}));
        console.error("Groq API error:", groqErr);
      }
    }

    if (!insight) {
      if (geminiRateLimitMessage && !groqApiKey) {
        return res.status(429).json({ message: geminiRateLimitMessage });
      }
      return res.status(502).json({
        message: "AI service returned an error. Please try again.",
      });
    }

    const generatedAt = new Date();
    await prisma.inventoryAiReport.upsert({
      where: { id: INVENTORY_AI_REPORT_ID },
      update: {
        aiInsight: insight,
        aiInsightModel: selectedModel,
        generatedAt,
      },
      create: {
        id: INVENTORY_AI_REPORT_ID,
        aiInsight: insight,
        aiInsightModel: selectedModel,
        generatedAt,
      },
    });

    return res.json({
      insight,
      isAiGenerated: true,
      fromCache: false,
      aiModel: selectedModel,
      generatedAt: generatedAt.toISOString(),
      disclaimer: INVENTORY_AI_DISCLAIMER,
    });
  } catch (e) {
    console.error("Inventory AI analysis error:", e);
    res.status(500).json({ message: "Server error" });
  }
};
