import mongoose from 'mongoose';
import app from './app';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

console.log('🔍 Raw MONGO_URI:', process.env.MONGO_URI);
console.log('🔍 Cleaned MONGO_URI:', JSON.stringify(process.env.MONGO_URI));

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });




// import mongoose from 'mongoose';
// import app from './app';
// import dotenv from 'dotenv';
// dotenv.config();

// const PORT = process.env.PORT || 5000;
// const MONGO_URI = (process.env.MONGO_URI || '').trim();

// if (!MONGO_URI) {
//   console.error('❌ MONGO_URI is missing in .env');
//   process.exit(1);
// }

// mongoose.connect(MONGO_URI, { 
//   useNewUrlParser: true, 
//   useUnifiedTopology: true 
// })
//   .then(() => {
//     console.log('✅ MongoDB connected');
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ MongoDB connection failed:', err.message);
//   });
