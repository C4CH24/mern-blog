import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './models/Post.js';
import Category from './models/Category.js';
import User from './models/User.js';

dotenv.config();

const createSamplePosts = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get categories and user
    const categories = await Category.find();
    const user = await User.findOne({ email: 'admin@example.com' });

    if (!user) {
      console.log('❌ No admin user found. Creating one...');
      // Let's create a user if none exists
      const UserModel = mongoose.model('User');
      const newUser = await UserModel.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });
      user = newUser;
    }

    if (categories.length === 0) {
      console.log('❌ No categories found. Creating default categories...');
      const CategoryModel = mongoose.model('Category');
      const defaultCategories = [
        { name: 'Technology', description: 'Posts about technology' },
        { name: 'Web Development', description: 'Web development topics' },
        { name: 'JavaScript', description: 'JavaScript related content' },
      ];
      
      for (const catData of defaultCategories) {
        await CategoryModel.create(catData);
      }
      
      // Refresh categories
      categories = await Category.find();
    }

    // Clear existing posts
    await Post.deleteMany({});
    console.log('✅ Cleared existing posts');

    // Sample posts data - create them individually
    const samplePostsData = [
      {
        title: 'Getting Started with React',
        content: 'React is a powerful JavaScript library for building user interfaces. In this post, we will explore the basics of React components, JSX, and state management.',
        excerpt: 'Learn the fundamentals of React and how to build your first component.',
        category: categories.find(c => c.name === 'Technology')._id,
        author: user._id,
        tags: ['react', 'javascript', 'frontend'],
        status: 'published'
      },
      {
        title: 'Node.js Backend Development',
        content: 'Node.js allows you to build scalable backend applications using JavaScript. We will look at setting up Express.js, handling routes, and connecting to MongoDB.',
        excerpt: 'Build robust backend APIs with Node.js and Express.js.',
        category: categories.find(c => c.name === 'Web Development')._id,
        author: user._id,
        tags: ['nodejs', 'backend', 'express'],
        status: 'published'
      },
      {
        title: 'Modern JavaScript Features',
        content: 'ES6 and beyond have introduced many powerful features to JavaScript. Learn about arrow functions, destructuring, async/await, and more.',
        excerpt: 'Explore the latest JavaScript features that make coding more efficient.',
        category: categories.find(c => c.name === 'JavaScript')._id,
        author: user._id,
        tags: ['javascript', 'es6', 'web-development'],
        status: 'published'
      }
    ];

    console.log('Creating sample posts one by one...');
    
    // Create posts individually to trigger the pre-save middleware
    for (const postData of samplePostsData) {
      const post = new Post(postData);
      await post.save();
      console.log(`✅ Created post: "${post.title}" with slug: ${post.slug}`);
    }

    console.log('🎉 All sample posts created successfully!');
    
    // Verify the posts were created
    const postCount = await Post.countDocuments();
    console.log(`📊 Total posts in database: ${postCount}`);
    
  } catch (error) {
    console.error('❌ Error creating sample posts:', error.message);
    if (error.errors) {
      console.log('Validation errors:', error.errors);
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

createSamplePosts();