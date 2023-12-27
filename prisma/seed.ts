import { PrismaClient } from '@prisma/client';

async function createAdmin() {
  const prisma = new PrismaClient();
  await prisma.admin.createMany({
    data: [
      {
        email: 'admin@yopmail.com',
        password: '123456',
        name: 'Admin',
      },
    ],
    skipDuplicates: true,
  });
}

createAdmin();
