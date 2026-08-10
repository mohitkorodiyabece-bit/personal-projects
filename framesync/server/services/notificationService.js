import Notification from '../models/Notification.js';

export const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  message,
  relatedProject = null,
}) => {
  if (!recipient) return null;

  if (sender && recipient.toString() === sender.toString()) {
    return null;
  }

  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      relatedProject,
    });
    return notification;
  } catch (error) {
    console.error(`Failed to create notification: ${error.message}`);
    return null;
  }
};

export const createBulkNotifications = async (notificationsArray) => {
  const results = await Promise.all(
    notificationsArray.map((n) => createNotification(n))
  );
  return results.filter(Boolean);
};