const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FALLBACK = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80';

async function main() {
  console.log('Checking database for invalid local file paths...');
  const products = await prisma.product.findMany();
  let fixedCount = 0;

  for (const item of products) {
    const img = (item.image || '').trim();
    // Check if the image is not a web URL
    const isWeb = img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/');
    if (!isWeb) {
      await prisma.product.update({
        where: { id: item.id },
        data: { image: FALLBACK }
      });
      console.log(`✔ Fixed image for product: "${item.name}"`);
      console.log(`  Replaced local path: ${img}`);
      fixedCount++;
    }
  }

  if (fixedCount === 0) {
    console.log('✔ All product images in the database are valid web URLs.');
  } else {
    console.log(`\nSuccessfully repaired ${fixedCount} product(s) in PostgreSQL.`);
  }
}

main()
  .catch((e) => {
    console.error('Error repairing database:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
