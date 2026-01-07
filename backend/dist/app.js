"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// ✅ Custom JSON parser with better error handling
app.use(express_1.default.json({
    limit: '50mb',
    verify: (req, res, buf, encoding) => {
        try {
            JSON.parse(buf.toString(encoding || 'utf8'));
        }
        catch (e) {
            console.error('❌ JSON Parse Error:', e.message);
            console.error('❌ Raw body (first 500 chars):', buf.toString().substring(0, 500));
            res.status(400).json({
                success: false,
                error: 'Invalid JSON format in request body',
                message: e.message,
                hint: 'Check for missing quotes, trailing commas, or invalid characters'
            });
            throw new Error('Invalid JSON');
        }
    }
}));
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
// ✅ Add a test endpoint to check JSON parsing
app.post('/api/test-json', (req, res) => {
    console.log('✅ Test endpoint called with body:', req.body);
    res.json({
        success: true,
        message: 'JSON received successfully',
        receivedBody: req.body
    });
});
// ✅ Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('❌ JSON Syntax Error:', err.message);
        return res.status(400).json({
            success: false,
            error: 'Invalid JSON format',
            message: err.message,
            solution: 'Check your JSON for syntax errors like missing quotes or trailing commas'
        });
    }
    next(err);
});
// ✅ 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});
exports.default = app;
