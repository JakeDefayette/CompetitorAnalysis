import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri!, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri!, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

/**
 * Gets the MongoDB database instance.
 * @returns A promise that resolves to the Db instance.
 */
export async function getDb(): Promise<Db> {
    if (!clientPromise) {
        throw new Error('Database connection not initialized');
    }
    const client = await clientPromise;
    // You might want to specify your database name here if it's not in the connection string
    // e.g., return client.db("yourDbName");
    return client.db();
} 