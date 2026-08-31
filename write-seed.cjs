const fs = require('fs');
const path = require('path');

const seed = `const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

function sale(original, percent) {
  const price = Math.round(original * (1 - percent / 100) * 100) / 100;
  return {
    price: price,
    originalPrice: original,
    discountPercent: percent,
    onSale: percent > 0
  };
}

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      name: 'NovaMart Admin',
      email: 'admin@novamart.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'ADMIN',
      theme: 'dark'
    }
  });

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: bcrypt.hashSync('user123', 10),
      role: 'CUSTOMER',
      phone: '+254 700 000 000',
      address: '12 Kenyatta Avenue',
      city: 'Nairobi',
      theme: 'dark'
    }
  });

  const products = [
    {
      name: 'Wireless Noise-Canceling Headphones',
      description: 'Active noise cancellation, 40-hour battery, memory-foam cushions.',
      stock: 40,
      category: 'Audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      featured: true,
      ...sale(249.99, 20)
    },
    {
      name: 'Custom Mechanical Gaming Keyboard',
      description: 'Hot-swap switches, per-key RGB, CNC aluminum frame.',
      stock: 25,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      featured: true,
      ...sale(129.5, 0)
    },
    {
      name: 'Full-Grain Leather Everyday Backpack',
      description: 'Water-resistant leather with a padded 16-inch laptop sleeve.',
      stock: 18,
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      featured: true,
      ...sale(189, 15)
    },
    {
      name: 'Smart Fitness Pro Watch',
      description: 'Heart-rate, dual GPS, 50m water resistance, AMOLED display.',
      stock: 15,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      featured: true,
      ...sale(329.99, 25)
    },
    {
      name: 'Portable Bluetooth Speaker',
      description: '360 sound, IPX7 waterproof, 24-hour playtime.',
      stock: 50,
      category: 'Audio',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
      featured: false,
      ...sale(89.99, 10)
    },
    {
      name: 'USB-C Docking Station',
      description: 'Triple display, 100W power delivery, Gigabit Ethernet.',
      stock: 22,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80',
      featured: false,
      ...sale(189, 0)
    }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('PostgreSQL seeded: admin, customer, 6 products (some on sale).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
`;

fs.writeFileSync(path.join(process.cwd(), 'prisma', 'seed.cjs'), seed);
console.log('✔ prisma/seed.cjs rewritten (clean, no duplicates)');
