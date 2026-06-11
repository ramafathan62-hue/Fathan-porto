"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fathan-secret-key-2026';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = (0, multer_1.default)({ storage });
// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
};
// --- Auth Routes ---
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    // For simplicity, we hardcode an admin or verify with DB
    // Here we'll just check a fixed email/password or create one if db is empty
    let user = await prisma.user.findUnique({ where: { email } });
    // Auto-seed admin if none exists (for development only)
    if (!user && email === 'admin@admin.com') {
        user = await prisma.user.create({
            data: { email: 'admin@admin.com', password: 'password' }
        });
    }
    if (user && user.password === password) {
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    }
    else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});
// --- Upload Route ---
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: 'No file uploaded' });
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
});
// --- Profile Routes ---
app.get('/api/profile', async (req, res) => {
    let profile = await prisma.profile.findFirst();
    // Return default if empty
    if (!profile) {
        profile = { id: 0, name: 'John Doe', mainTitle: 'Creative Director', aboutText: 'Welcome to my portfolio.', profileImage: null, resumeUrl: null };
    }
    res.json(profile);
});
app.post('/api/profile', authenticateToken, async (req, res) => {
    const data = req.body;
    let profile = await prisma.profile.findFirst();
    if (profile) {
        profile = await prisma.profile.update({ where: { id: profile.id }, data });
    }
    else {
        profile = await prisma.profile.create({ data });
    }
    res.json(profile);
});
// --- Generic CRUD Factory ---
const createCrudRoutes = (app, modelName, path) => {
    const model = prisma[modelName];
    app.get(path, async (req, res) => {
        const items = await model.findMany();
        res.json(items);
    });
    app.post(path, authenticateToken, async (req, res) => {
        const item = await model.create({ data: req.body });
        res.json(item);
    });
    app.put(`${path}/:id`, authenticateToken, async (req, res) => {
        const item = await model.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });
        res.json(item);
    });
    app.delete(`${path}/:id`, authenticateToken, async (req, res) => {
        await model.delete({ where: { id: Number(req.params.id) } });
        res.json({ success: true });
    });
};
createCrudRoutes(app, 'service', '/api/services');
createCrudRoutes(app, 'project', '/api/projects');
createCrudRoutes(app, 'experience', '/api/experiences');
createCrudRoutes(app, 'certification', '/api/certifications');
// --- Messages Routes (Public create, Protected read) ---
app.post('/api/messages', async (req, res) => {
    const message = await prisma.message.create({ data: req.body });
    res.json(message);
});
app.get('/api/messages', authenticateToken, async (req, res) => {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(messages);
});
app.delete('/api/messages/:id', authenticateToken, async (req, res) => {
    await prisma.message.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
});
app.listen(PORT, () => {
    console.log(`API Server running on http://localhost:${PORT}`);
});
