import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import User from './models/User.js';

dotenv.config();

const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create default categories
    const categories = [
      { 
        name: 'Technology',
        description: 'Posts about technology and programming',
        slug: 'technology'
      },
      { 
        name: 'Web Development',
        description: 'Web development tutorials and tips',
        slug: 'web-development'
      },
      { 
        name: 'JavaScript',
        description: 'JavaScript frameworks and libraries',
        slug: 'javascript'
      },
      { 
        name: 'React',
        description: 'React.js and related technologies',
        slug: 'react'
      },
      { 
        name: 'Node.js',
        description: 'Server-side JavaScript with Node.js',
        slug: 'nodejs'
      },
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create a sample admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    console.log('✅ Created admin user:', {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });

    console.log('🎉 Database initialization completed!');
    
  } catch (error) {
    console.error('❌ Initialization failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

initializeDatabase();