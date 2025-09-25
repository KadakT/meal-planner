"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const path_1 = __importDefault(require("path"));
// Load environment variables from backend/.env
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
// Safely assert env variables
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;
// ✅ Express app setup
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ✅ Mongoose connection
mongoose_1.default.connect(MONGO_URI, {})
    .then(() => console.log('MongoDB (Mongoose) connected'))
    .catch(err => console.error('MongoDB connection error:', err));
// ✅ Optional: Raw MongoDB client ping (optional)
const client = new mongodb_1.MongoClient(MONGO_URI, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function runMongoClientPing() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your MongoDB deployment!");
    }
    catch (err) {
        console.error("MongoDB ping failed:", err);
    }
    finally {
        await client.close();
    }
}
runMongoClientPing();
// ✅ Routes
const auth_1 = __importDefault(require("./routes/auth"));
const error_handler_1 = require("./middleware/error-handler");
app.use('/api/auth', auth_1.default);
app.get('/api/test', (req, res) => {
    res.json({ message: 'Connected to backend!' });
});
app.use(error_handler_1.globalErrorHandler);
// ✅ Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
