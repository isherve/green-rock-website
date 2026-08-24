import prisma from './prisma';

export async function createUserNotification(data: {
  userId: string;
  title: string;
  message: string;
  link?: string;
  type?: string;
}) {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
      link: data.link,
      type: data.type ?? 'info',
    },
  });
}
