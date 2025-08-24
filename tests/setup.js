import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

beforeAll(async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI_TEST ||
        'mongodb://localhost:27017/financetracker-test'
    );
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
