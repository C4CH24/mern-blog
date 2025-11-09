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
      console.log('❌ No admin user found. Please run the init-db.js script first.');
      process.exit(1);
    }

    if (categories.length === 0) {
      console.log('❌ No categories found. Please run the init-db.js script first.');
      process.exit(1);
    }

    // Sample posts data
    const samplePosts = [
      {
        title: 'Getting Started with React',
        content: 'React is a powerful JavaScript library for building user interfaces. In this post, we will explore the basics of React components, JSX, and state management.',
        excerpt: 'Learn the fundamentals of React and how to build your first component.',
        category: categories.find(c => c.name === 'React')._id,
        author: user._id,
        tags: ['react', 'javascript', 'frontend'],
        status: 'published'
      },
      {
        title: 'Node.js Backend Development',
        content: 'Node.js allows you to build scalable backend applications using JavaScript. We will look at setting up Express.js, handling routes, and connecting to MongoDB.',
        excerpt: 'Build robust backend APIs with Node.js and Express.js.',
        category: categories.find(c => c.name === 'Node.js')._id,
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
      },
      {
        title: 'MongoDB Basics for Web Developers',
        content: 'MongoDB is a popular NoSQL database that works great with Node.js. Learn how to design schemas, perform CRUD operations, and use Mongoose ODM.',
        excerpt: 'Get started with MongoDB and learn how to integrate it with your Node.js applications.',
        category: categories.find(c => c.name === 'Web Development')._id,
        author: user._id,
        tags: ['mongodb', 'database', 'backend'],
        status: 'published'
      },
      {
        title: 'Building RESTful APIs with Express',
        content: 'RESTful APIs are the backbone of modern web applications. This guide covers best practices for designing and implementing REST APIs with Express.js.',
        excerpt: 'Learn how to build clean and maintainable RESTful APIs using Express.js.',
        category: categories.find(c => c.name === 'Web Development')._id,
        author: user._id,
        tags: ['api', 'express', 'rest', 'backend'],
        status: 'published'
      }
    ];

    // Clear existing posts
    await Post.deleteMany({});
    console.log('✅ Cleared existing posts');

    // Create sample posts
    const createdPosts = await Post.insertMany(samplePosts);
    console.log(`✅ Created ${createdPosts.length} sample posts`);

    console.log('🎉 Sample posts created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating sample posts:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createSamplePosts();