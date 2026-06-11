import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { prisma } from './db.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, file) => {
    return {
      folder: 'fathan-porto',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'pdf'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

app.use(cors());
app.use(express.json());

// ─── File Upload Endpoint ───────────────────────────────────────────────────
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // The file path on Cloudinary is stored in req.file.path
  res.json({ fileUrl: req.file.path });
});

// ─── Profile ────────────────────────────────────────────────────────────────
app.get('/api/profile', async (_req, res) => {
  try {
    let profile = await prisma.profile.findFirst();
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          name: 'Rama Fikri Fathan',
          title: 'Digital Business & Creative Design Portfolio',
          bio: "I am currently pursuing a Bachelor's degree in Digital Business at Telkom University Purwokerto...",
          imageUrl: '/profile.png',
          cvUrl: 'https://drive.google.com/file/d/1dFu7KL3bVDN2T6SDNotYvPqUTwYtt502/view?usp=sharing',
        },
      });
    }
    // Set no-cache headers so web always gets fresh data
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json(profile);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/profile/:id', async (req, res) => {
  try {
    // Strip read-only fields
    const { id, createdAt, updatedAt, ...data } = req.body;
    const profile = await prisma.profile.update({
      where: { id: req.params.id },
      data,
    });
    res.json(profile);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ─── Services ───────────────────────────────────────────────────────────────
app.get('/api/services', async (_req, res) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
    res.json(services);
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});
app.post('/api/services', async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    const service = await prisma.service.create({ data });
    res.json(service);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to create' }); }
});
app.put('/api/services/:id', async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    const service = await prisma.service.update({ where: { id: req.params.id }, data });
    res.json(service);
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});
app.delete('/api/services/:id', async (req, res) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

// ─── Projects ───────────────────────────────────────────────────────────────
app.get('/api/projects', async (_req, res) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
    res.json(projects);
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});
app.post('/api/projects', async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    // Ensure order is a number
    if (data.order !== undefined) data.order = parseInt(data.order) || 0;
    const project = await prisma.project.create({ data });
    res.json(project);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to create project' }); }
});
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    if (data.order !== undefined) data.order = parseInt(data.order) || 0;
    const project = await prisma.project.update({ where: { id: req.params.id }, data });
    res.json(project);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed' }); }
});
app.delete('/api/projects/:id', async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

// ─── Experience ─────────────────────────────────────────────────────────────
app.get('/api/experience', async (_req, res) => {
  try {
    const exp = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
    res.json(exp);
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});
app.post('/api/experience', async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    if (data.order !== undefined) data.order = parseInt(data.order) || 0;
    const exp = await prisma.experience.create({ data });
    res.json(exp);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to create' }); }
});
app.put('/api/experience/:id', async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    if (data.order !== undefined) data.order = parseInt(data.order) || 0;
    const exp = await prisma.experience.update({ where: { id: req.params.id }, data });
    res.json(exp);
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});
app.delete('/api/experience/:id', async (req, res) => {
  try {
    await prisma.experience.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

// ─── Certifications ─────────────────────────────────────────────────────────
app.get('/api/certifications', async (_req, res) => {
  try {
    const certs = await prisma.certification.findMany({ orderBy: { order: 'asc' } });
    res.json(certs);
  } catch (e: any) { console.error('CERTS ERROR:', e?.message); res.status(500).json({ error: 'Failed', detail: e?.message }); }
});
app.post('/api/certifications', async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    if (data.order !== undefined) data.order = parseInt(data.order) || 0;
    const cert = await prisma.certification.create({ data });
    res.json(cert);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to create' }); }
});
app.put('/api/certifications/:id', async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    if (data.order !== undefined) data.order = parseInt(data.order) || 0;
    const cert = await prisma.certification.update({ where: { id: req.params.id }, data });
    res.json(cert);
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});
app.delete('/api/certifications/:id', async (req, res) => {
  try {
    await prisma.certification.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

// ─── Contact / Email ────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Use Gmail with App Password (set GMAIL_PASS env var)
  // If env var not set or is placeholder, log to console (dev mode)
  const gmailPass = process.env.GMAIL_PASS;
  const isConfigured = gmailPass && gmailPass !== 'your_16_char_app_password_here';

  if (!isConfigured) {
    console.log('\n📬 New Contact Message (Email not configured):');
    console.log(`  From: ${name} <${email}>`);
    console.log(`  Message: ${message}\n`);
    return res.json({ success: true, note: 'Logged to console (GMAIL_PASS not set)' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: 'ramafathan62@gmail.com', pass: gmailPass! },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <ramafathan62@gmail.com>`,
      to: 'ramafathan62@gmail.com',
      replyTo: email,
      subject: `📩 New Message from ${name} — Portfolio`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #131318; color: #e4e1e9; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #adc6ff, #0267b8); padding: 28px 32px;">
            <h2 style="margin: 0; font-size: 22px; color: #002e6a;">📩 New Portfolio Message</h2>
            <p style="margin: 6px 0 0; color: #001a42; font-size: 14px;">Someone reached out from your portfolio website</p>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #a4c9ff; font-size: 13px; font-weight: 600; width: 80px;">FROM</td>
                <td style="padding: 8px 0; font-weight: 700; font-size: 16px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a4c9ff; font-size: 13px; font-weight: 600;">EMAIL</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #adc6ff;">${email}</a></td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 10px; border-left: 3px solid #adc6ff;">
              <p style="margin: 0; color: #c2c6d6; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
              <p style="margin: 12px 0 0; line-height: 1.7; font-size: 15px; white-space: pre-wrap;">${message}</p>
            </div>
            <div style="margin-top: 28px; text-align: center;">
              <a href="mailto:${email}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #adc6ff, #0267b8); color: #002e6a; font-weight: 700; border-radius: 8px; text-decoration: none;">Reply to ${name}</a>
            </div>
          </div>
          <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; color: #8c909f; font-size: 12px;">
            Rama Fikri Fathan — Portfolio Website
          </div>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (e: any) {
    console.error('Email error:', e.message);
    res.status(500).json({ error: 'Failed to send email. Check GMAIL_PASS config.' });
  }
});

// ─── About Section ───────────────────────────────────────────────────────────
app.get('/api/about', async (_req, res) => {
  try {
    let about = await prisma.aboutSection.findFirst();
    if (!about) {
      about = await prisma.aboutSection.create({
        data: {
          headline: 'Bridging Creativity and Business Strategy',
          journeyTitle: 'Creative & Entrepreneurial Journey',
          journeyText: 'I channel my entrepreneurial spirit through independent creative projects and freelance collaborations, where I help clients build strong visual identities and effective digital campaigns. Beyond my professional and academic pursuits, I actively contribute to the community by holding strategic leadership roles in the media and research divisions for HIPMI PT Telkom Purwokerto and Dompet Dhuafa Volunteer.',
          skills: JSON.stringify(['Strategic Planning', 'Team Leadership', 'Market Analysis', 'Creative Design', 'Digital Marketing']),
        },
      });
    }
    res.setHeader('Cache-Control', 'no-store');
    res.json(about);
  } catch (e: any) { console.error('About GET error:', e.message); res.status(500).json({ error: 'Failed' }); }
});

app.put('/api/about/:id', async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    const about = await prisma.aboutSection.update({ where: { id: req.params.id }, data });
    res.json(about);
  } catch (e: any) { console.error('About PUT error:', e.message); res.status(500).json({ error: 'Failed' }); }
});

// ─── Stats ───────────────────────────────────────────────────────────────────
app.get('/api/stats', async (_req, res) => {
  try {
    let stats = await prisma.stat.findMany({ orderBy: { order: 'asc' } });
    if (stats.length === 0) {
      await prisma.stat.createMany({
        data: [
          { value: 3, suffix: '+', label: 'Years Exp', order: 1 },
          { value: 10, suffix: '+', label: 'Pro Projects', order: 2 },
          { value: 5, suffix: '+', label: 'Organizations', order: 3 },
          { value: 15, suffix: '+', label: 'Certifications', order: 4 },
        ],
      });
      stats = await prisma.stat.findMany({ orderBy: { order: 'asc' } });
    }
    res.setHeader('Cache-Control', 'no-store');
    res.json(stats);
  } catch (e: any) { console.error('Stats GET error:', e.message); res.status(500).json({ error: 'Failed' }); }
});

app.post('/api/stats', async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    if (data.value !== undefined) data.value = parseInt(data.value) || 0;
    if (data.order !== undefined) data.order = parseInt(data.order) || 0;
    const stat = await prisma.stat.create({ data });
    res.json(stat);
  } catch (e: any) { console.error('Stat POST error:', e.message); res.status(500).json({ error: 'Failed' }); }
});

app.put('/api/stats/:id', async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    if (data.value !== undefined) data.value = parseInt(data.value) || 0;
    if (data.order !== undefined) data.order = parseInt(data.order) || 0;
    const stat = await prisma.stat.update({ where: { id: req.params.id }, data });
    res.json(stat);
  } catch (e: any) { console.error('Stat PUT error:', e.message); res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/stats/:id', async (req, res) => {
  try {
    await prisma.stat.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: 'Failed' }); }
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ API running on http://localhost:${PORT}`);
  });
}

export default app;
