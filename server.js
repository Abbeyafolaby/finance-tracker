import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Finance Tracker server running on port http://localhost:${PORT}`);
});




