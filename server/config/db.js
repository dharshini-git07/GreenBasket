import mongoose from 'mongoose';
import dns from 'dns';

// Fix Node.js DNS resolution for SRV records on Windows
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore if unsupported in environment
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'greenbasket',
    });
    console.log(`[MongoDB] Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error] Connection failed: ${error.message}`);
    // If SRV lookup failed due to local DNS, try setting public DNS servers
    if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
      console.log('[MongoDB Info] Retrying connection with public DNS servers (8.8.8.8)...');
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
          dbName: 'greenbasket',
        });
        console.log(`[MongoDB] Database Connected via Fallback DNS: ${conn.connection.host}`);
        return;
      } catch (retryError) {
        console.error(`[MongoDB Error] Fallback DNS connection failed: ${retryError.message}`);
      }
    }
    process.exit(1);
  }
};
