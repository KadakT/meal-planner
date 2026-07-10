"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // ✅ Start server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const recipe_routes_1 = __importDefault(require("./routes/recipe.routes"));
const error_handler_1 = require("./middleware/error-handler");
// Env variables
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
// Express app setup
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:4200',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/recipes', recipe_routes_1.default);
app.get('/api/test', (req, res) => {
    res.json({ message: 'Connected to backend!' });
});
app.use(error_handler_1.globalErrorHandler);
// Start server AFTER Mongo connects
const startServer = async () => {
    try {
        await mongoose_1.default.connect(MONGO_URI, {
            dbName: 'mealplanner' // make sure this matches your DB
        });
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};
startServer();
