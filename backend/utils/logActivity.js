const prisma = require("../lib/prisma");

/**
 * Creates an activity log entry.
 * @param {{ action: string, target?: string, staffId: string, status?: "Completed"|"Pending" }} opts
 */
async function logActivity({
  action,
  target = null,
  staffId,
  status = "Completed",
}) {
  try {
    await prisma.activityLog.create({
      data: { action, target, staffId, status },
    });
  } catch (err) {
    // Log errors should never crash the main flow
    console.error("logActivity error:", err.message);
  }
}

module.exports = logActivity;
