import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from './db.js';

const app = express();

// ─── Cloudinary config ───────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer: memory storage (works on serverless — no local disk needed)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ─── File Upload → Cloudinary ────────────────────────────────────────────────
app.post('/api/upload', upload.single('file'), async (req: any, res: any) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'fathan-porto', resource_type: 'auto' },
        (err, result) => { if (err) reject(err); else resolve(result); }
      ).end(req.file!.buffer);
    });
    res.json({ fileUrl: result.secure_url });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed', detail: err?.message });
  }
});

// ─── Profile ────────────────────────────────────────────────────────────────
app.get('/api/profile', async (_req: any, res: any) => {
  try {
    let profile = await prisma.profile.findFirst();
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          name: 'Rama Fikri Fathan',
          title: 'Digital Business & Creative Design Portfolio',
          bio: "I am currently pursuing a Bachelor's degree in Digital Business at Telkom University Purwokerto (since September 2023).",
          imageUrl: '/profile.png',
        },
      });
    }
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json(profile);
  } catch (e: any) {
    console.error('Profile error:', e?.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/profile/:id', async (req: any, res: any) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    const profile = await prisma.profile.update({ where: { id: req.params.id }, data });
    res.json(profile);
  } catch (e: any) {
    console.error('Profile update error:', e?.message);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ─── Services ───────────────────────────────────────────────────────────────
app.get('/api/services', async (_req: any, res: any) => {
  try {
    res.json(await prisma.service.findMany({ orderBy: { order: 'asc' } }));
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Failed' }); }
});
app.post('/api/services', async (req: any, res: any) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    res.json(await prisma.service.create({ data }));
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Failed to create' }); }
});
app.put('/api/services/:id', async (req: any, res: any) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    res.json(await prisma.service.update({ where: { id: req.params.id }, data }));
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Failed' }); }
});
app.delete('/api/services/:id', async (req: any, res: any) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Failed' }); }
});

// ─── Projects ───────────────────────────────────────────────────────────────
app.get('/api/projects', async (_req: any, res: any) => {
  try {
    res.json(await prisma.project.findMany({ orderBy: { order: 'asc' } }));
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Failed' }); }
});
app.post('/api/projects', async (req: any, res: any) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    if (data.order !== undefined) data.order = parseInt(data.order) || 0;
    res.json(await prisma.project.create({ data }));
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Failed to create project' }); }
});
app.put('/api/projects/:id', async (req: any, res: any) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    if (data.order !== undefined) data.order = parseInt(data.order) || 0;
    res.json(await prisma.project.update({ where: { id: req.params.id }, data }));
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Failed' }); }
});
app.delete('/api/projects/:id', async (req: any, res: any) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Failed' }); }
});

// ─── Experience ─────────────────────────────────────────────────────────────
app.get('/api/experience', async (_req: any, res: any) => {
  try {
    res.json(await prisma.experience.findMany({ orderBy: { order: 'asc' } }));
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Failed' }); }
});
app.post('/api/experience', async (req: any, res: any) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    if (data.order !== undefined) data.order = parseInt(data.order) || 0;
    res.json(await prisma.experience.create({ data }));
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Failed to create' }); }
});
app.put('/api/experience/:id', async (req: any, res: any) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    if (data.order !== undefined) data.order = parseInt(data.order) || 0;
    res.json(await prisma.experience.update({ where: { id: req.params.id }, data }));
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Failed' }); }
});
app.delete('/api/experience/:id', async (req: any, res: any) => {
  try {
    await prisma.experience.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Failed' }); }
});

// ─── Certifications ─────────────────────────────────────────────────────────
app.get('/api/certifications', async (_req: any, res: any) => {
  try {
    res.json(await prisma.certification.findMany({ orderBy: { order: 'asc' } }));
  } catch (e: any) { console.error('CERTS ERROR:', e?.message); res.status(500).json({ error: 'Failed', detail: e?.message }); }
});
app.post('/api/certifications', async (req: any, res: any) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    if (data.order !== undefined) data.order = parseInt(data.order) || 0;
    res.json(await prisma.certification.create({ data }));
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Failed to create' }); }
});
app.put('/api/certifications/:id', async (req: any, res: any) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    if (data.order !== undefined) data.order = parseInt(data.order) || 0;
    res.json(await prisma.certification.update({ where: { id: req.params.id }, data }));
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Failed' }); }
});
app.delete('/api/certifications/:id', async (req: any, res: any) => {
  try {
    await prisma.certification.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Failed' }); }
});

// ─── Start server (local dev only) ──────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '3001');
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
}

export default app;
