import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma';
import { Role } from '@prisma/client';

async function main() {
  console.log(`Start seeding ...`);

  const adminPhone = '0935003975';
  const adminPassword = 'admin123';

  let admin = await prisma.user.findUnique({
    where: { phone: adminPhone },
  });

  if (!admin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    admin = await prisma.user.create({
      data: {
        name: 'System Admin',
        phone: adminPhone,
        passwordHash,
        roles: [Role.ADMIN],
      },
    });
    console.log(`Created new admin user with phone: ${adminPhone} and password: ${adminPassword}`);
  } else {
    // Ensure admin role is present
    if (!admin.roles.includes(Role.ADMIN)) {
      admin = await prisma.user.update({
        where: { id: admin.id },
        data: { roles: { push: Role.ADMIN } },
      });
      console.log(`Added ADMIN role to existing user with phone: ${adminPhone}`);
    } else {
      console.log(`Admin user already exists with phone: ${adminPhone}`);
    }
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
