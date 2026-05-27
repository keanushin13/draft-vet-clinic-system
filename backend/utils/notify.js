const prisma = require("../lib/prisma");

const notify = (userId, { type, title, body }) => {
  if (!userId) return;
  prisma.notification
    .create({ data: { userId, type, title, body, isRead: false } })
    .catch(() => {});
};

module.exports = notify;
