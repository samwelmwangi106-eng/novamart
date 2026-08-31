const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@novamart.co.ke';
  const password = 'admin123';
  const name = 'Admin User';

  try {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      console.log('User exists:', email);
      if (existing.role !== 'ADMIN') {
        await prisma.user.update({
          where: { email },
          data: { role: 'ADMIN' }
        });
        console.log('✅ Updated to ADMIN');
      } else {
        console.log('✅ Already ADMIN');
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'ADMIN' }
    });

    console.log('✅ Admin created!');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createAdmin().finally(() => prisma.$disconnect());
