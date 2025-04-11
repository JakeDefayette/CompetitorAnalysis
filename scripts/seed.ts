import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Competitor, { ICompetitor } from '../models/Competitor';
import KeyPerson, { IKeyPerson } from '../models/KeyPerson';
import Product, { IProduct } from '../models/Product';
import Update, { IUpdate } from '../models/Update';
import User, { IUser } from '../models/User';

// Load environment variables
dotenv.config({ path: '.env.local' });

// --- Sample Data Definitions ---

const sampleUsers: Partial<IUser>[] = [
  {
    email: 'admin@example.com',
    role: 'admin',
    password: 'password123' // Raw password, will be hashed on save if pre-save hook is implemented
  },
  {
    email: 'viewer@example.com',
    role: 'viewer',
    password: 'password123'
  },
];

const sampleCompetitors: Partial<ICompetitor>[] = [
  { name: 'Competitor Alpha', website: 'https://alpha.com', status: 'active' },
  { name: 'Competitor Beta', website: 'https://beta.com', status: 'inactive' },
  { name: 'Competitor Gamma', linkedInUrl: 'https://linkedin.com/company/gamma', description: 'Leading innovator' },
];

// We need Competitor IDs for related models, will populate after creation
let competitorIds: mongoose.Types.ObjectId[] = [];

const sampleKeyPersons = (): Partial<IKeyPerson>[] => [
  { name: 'Alice CEO', title: 'CEO', company: competitorIds[0], linkedInUrl: 'https://linkedin.com/in/alice' },
  { name: 'Bob CTO', title: 'CTO', company: competitorIds[0] },
  { name: 'Charlie PM', title: 'Product Manager', company: competitorIds[1] },
];

const sampleProducts = (): Partial<IProduct>[] => [
  {
    name: 'Alpha Product X',
    description: 'Next-gen solution',
    competitor: competitorIds[0],
    pricing: { model: 'subscription', amount: 99, currency: 'USD', interval: 'monthly' }
  },
  {
    name: 'Beta Feature Y',
    competitor: competitorIds[1],
    pricing: { model: 'freemium' }
  },
];

const sampleUpdates = (): Partial<IUpdate>[] => [
  {
    type: 'funding',
    content: 'Competitor Alpha raised $10M Series A',
    importance: 'high',
    competitor: competitorIds[0],
    source: 'https://techcrunch.com/alpha-funding'
  },
  {
    type: 'product_launch',
    content: 'Competitor Gamma launched new AI tool',
    importance: 'medium',
    competitor: competitorIds[2],
  },
];

// --- Seeding Functions ---

async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('Error: MONGODB_URI environment variable not set.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to database via Mongoose for seeding.');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Competitor.deleteMany({});
    await KeyPerson.deleteMany({});
    await Product.deleteMany({});
    await Update.deleteMany({});
    console.log('Existing data cleared.');

    // Seed Users
    console.log('Seeding Users...');
    // Note: If pre-save password hashing is implemented, it will trigger here.
    // Otherwise, passwords are saved as plain text (NOT recommended for production).
    await User.insertMany(sampleUsers);
    console.log('Users seeded.');

    // Seed Competitors and get their IDs
    console.log('Seeding Competitors...');
    const createdCompetitors = await Competitor.insertMany(sampleCompetitors);
    competitorIds = createdCompetitors.map(c => c._id);
    console.log('Competitors seeded.');

    // Seed related models using Competitor IDs
    console.log('Seeding Key Persons...');
    await KeyPerson.insertMany(sampleKeyPersons());
    console.log('Key Persons seeded.');

    console.log('Seeding Products...');
    await Product.insertMany(sampleProducts());
    console.log('Products seeded.');

    console.log('Seeding Updates...');
    await Update.insertMany(sampleUpdates());
    console.log('Updates seeded.');

    console.log('\nDatabase seeding completed successfully!');

  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1); // Exit with error code
  } finally {
    // Ensure the connection is closed
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Execute the seeding function
seedDatabase();
