import mongoose from "mongoose";

const maskUri = (uri) => {
  if (!uri) return "<not set>";
  return uri.replace(/:([^@]+)@/, ":***@");
};

const connectDB = async () => {
  const uris = [process.env.MONGODB_URI, process.env.MONGODB_URI_FALLBACK].filter(Boolean);

  if (uris.length === 0) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  let lastError;

  for (const uri of uris) {
    try {
      const connectionInstance = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        tls: true,
      });
      console.log(`MongoDB connected using ${maskUri(uri)}`);
      console.log(`Connected host: ${connectionInstance.connection.host}`);
      return connectionInstance;
    } catch (err) {
      lastError = err;
      console.warn(`Connection attempt failed for ${maskUri(uri)}:`, err.message);
    }
  }

  throw lastError;
};

export default connectDB;
