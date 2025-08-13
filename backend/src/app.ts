import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// ✅ Middleware order matters
app.use(express.json());
app.use(cookieParser());

// ✅ Allow both local and deployed frontend
app.use(
  cors({
    origin: ["http://localhost:5173", "https://hireonworkbridge.vercel.app"],
    credentials: true,
  })
);

// ✅ Routes
import userRoutes from './routes/userRoutes';
import freelancerRoutes from './routes/freelancerRoutes';
import jobRoutes from './routes/jobRoutes';
import applicationRoutes from './routes/applicationRoutes';

app.use("/api/users", userRoutes);
app.use("/api/freelancers", freelancerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

export default app;
