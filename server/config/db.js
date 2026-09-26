import mongoose from 'mongoose';
import dns from 'dns';

// Fix Node.js DNS resolution for SRV records on Windows
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if unsupported in environment
}

const FALLBACK_DIRECT_URI =
  'mongodb://greenbasket_admin:Dharshini007@ac-e4hkkvx-shard-00-00.acyx3cp.mongodb.net:27017,ac-e4hkkvx-shard-00-01.acyx3cp.mongodb.net:27017,ac-e4hkkvx-shard-00-02.acyx3cp.mongodb.net:27017/greenbasket?ssl=true&replicaSet=atlas-13ofrk-shard-0&authSource=admin&retryWrites=true&w=majority';

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const primaryURI = process.env.MONGODB_URI || FALLBACK_DIRECT_URI;

  try {
    const conn = await mongoose.connect(primaryURI, {
      dbName: 'greenbasket',
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Database Connected: ${conn.connection.host}`);
    return;
  } catch (primaryError) {
    console.warn(`[MongoDB Info] Primary connection failed (${primaryError.message}). Trying Direct Cluster Seeds...`);

    try {
      const conn = await mongoose.connect(FALLBACK_DIRECT_URI, {
        dbName: 'greenbasket',
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[MongoDB] Database Connected via Direct Cluster Seeds: ${conn.connection.host}`);
      return;
    } catch (directError) {
      console.error(`[MongoDB Error] Direct Connection Failed: ${directError.message}`);
      if (
        directError.message.includes('whitelisted') ||
        directError.message.includes('IP') ||
        directError.message.includes('Could not connect to any servers')
      ) {
        console.error(
          '[MongoDB Action Required] Your current IP address is not whitelisted in MongoDB Atlas.\n' +
          '--> Go to MongoDB Atlas (https://cloud.mongodb.com) -> Network Access -> Add IP Address -> Select "Allow Access From Anywhere" (0.0.0.0/0).'
        );
      }
    }
  }
};
