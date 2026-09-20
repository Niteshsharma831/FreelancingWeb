"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts - NO dotenv imports here!
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// ✅ Middleware order matters
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((0, cookie_parser_1.default)());
// ✅ Allow both local and deployed frontend
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://hireonworkbridge.vercel.app"],
    credentials: true,
}));
// ✅ Routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const freelancerRoutes_1 = __importDefault(require("./routes/freelancerRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const applicationRoutes_1 = __importDefault(require("./routes/applicationRoutes"));
app.use("/api/users", userRoutes_1.default);
app.use("/api/freelancers", freelancerRoutes_1.default);
app.use("/api/jobs", jobRoutes_1.default);
app.use("/api/applications", applicationRoutes_1.default);
exports.default = app;
