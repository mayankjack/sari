const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config({ path: './config.env' });

const defaultCategories = [
  {
    name: 'Traditional Sarees',
    description: 'Classic and traditional Indian sarees',
    sortOrder: 1,
    isActive: true
  },
  {
    name: 'Designer Sarees',
    description: 'Modern and designer sarees',
    sortOrder: 2,
    isActive: true
  },
  {
    name: 'Silk Sarees',
    description: 'Luxurious silk sarees',
    sortOrder: 3,
    isActive: true
  },
  {
    name: 'Cotton Sarees',
    description: 'Comfortable cotton sarees',
    sortOrder: 4,
    isActive: true
  },
  {
    name: 'Bridal Sarees',
    description: 'Special bridal collection',
    sortOrder: 5,
    isActive: true
  },
  {
    name: 'Party Wear',
    description: 'Elegant party wear sarees',
    sortOrder: 6,
    isActive: true
  },
  {
    name: 'Casual Wear',
    description: 'Everyday casual sarees',
    sortOrder: 7,
    isActive: true
  },
  {
    name: 'Accessories',
    description: 'Saree accessories and jewelry',
    sortOrder: 8,
    isActive: true
  }
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert default categories
    const categories = await Category.insertMany(defaultCategories);
    console.log(`Inserted ${categories.length} categories`);

    // Display inserted categories
    categories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug})`);
    });

    console.log('Categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
