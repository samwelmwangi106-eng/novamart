import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.json');

export function getDB() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({
  "users": [
    {
      "id": "usr_admin",
      "name": "NovaMart Admin",
      "email": "admin@novamart.com",
      "password": "$2b$10$kJ/FIOQ8MS0M8Pw2M/1xbucokxGWZL3yX6OsVk0jYwl.QV2mzOU.u",
      "role": "ADMIN",
      "createdAt": "2026-08-26T13:05:24.209Z"
    },
    {
      "id": "usr_customer",
      "name": "John Doe",
      "email": "john@example.com",
      "password": "$2b$10$Pkp5eDG3czvOH3EFXSPaXepp5V6oEiBaRWgsYQYIOPQJ3plLZixK2",
      "role": "CUSTOMER",
      "createdAt": "2026-08-26T13:05:24.298Z"
    }
  ],
  "products": [
    {
      "id": "prod_1",
      "name": "Wireless Noise-Canceling Headphones",
      "description": "Active noise cancellation up to 35dB with 40-hour battery life and memory foam comfort cushions.",
      "price": 199.99,
      "stock": 40,
      "category": "Audio",
      "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "featured": true
    },
    {
      "name": "Custom Mechanical Gaming Keyboard",
      "id": "prod_2",
      "description": "Hot-swappable tactile switches, per-key RGB lighting, and solid CNC aluminum construction.",
      "price": 129.5,
      "stock": 25,
      "category": "Electronics",
      "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      "featured": true
    },
    {
      "id": "prod_3",
      "name": "Full-Grain Leather Everyday Backpack",
      "description": "Water-resistant vegetable-tanned leather featuring a dedicated 16-inch padded laptop compartment.",
      "price": 149,
      "stock": 18,
      "category": "Accessories",
      "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "featured": true
    },
    {
      "id": "prod_4",
      "name": "Smart Fitness Pro Watch",
      "description": "Continuous heart rate monitor, dual GPS, 50m water resistance, and AMOLED high-resolution screen.",
      "price": 249.99,
      "stock": 15,
      "category": "Electronics",
      "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "featured": true
    }
  ],
  "orders": []
}, null, 2));
  }
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

export function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}