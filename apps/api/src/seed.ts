import { prisma } from './db.js';

async function main() {
  // Clear existing data
  await prisma.certification.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.profile.deleteMany();

  await prisma.profile.create({
    data: {
      name: 'Rama Fikri Fathan',
      title: 'Digital Business & Creative Design Portfolio',
      bio: "I am currently pursuing a Bachelor's degree in Digital Business at Telkom University Purwokerto (since September 2023). My core interests lie at the intersection of digital marketing, business development, and user experience. I strongly believe that aesthetically pleasing visuals must be backed by solid communication strategies and in-depth business analysis.",
      imageUrl: '/profile.png'
    }
  });

  await prisma.service.createMany({
    data: [
      { title: 'Creative Design', description: 'Visual storytelling through Canva, Figma, and Photoshop. Crafting identities that stick.', icon: 'palette', order: 1 },
      { title: 'Digital Marketing', description: 'SEO optimization and strategic ad campaigns to scale business visibility.', icon: 'trending_up', order: 2 },
      { title: 'Business & UI/UX', description: 'Transforming business processes through intuitive, user-centric prototypes.', icon: 'devices', order: 3 },
      { title: 'Multimedia', description: 'Professional photography and videography for events and brands.', icon: 'photo_camera', order: 4 },
    ]
  });

  await prisma.project.createMany({
    data: [
      { title: 'E-Commerce App Redesign', category: 'UI/UX Design', imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop', description: 'Complete overhaul of a local e-commerce platform.', order: 1 },
      { title: 'Tech Startup Branding', category: 'Brand Identity', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop', description: 'Visual identity and brand guidelines for a fintech startup.', order: 2 },
      { title: 'Product Launch Campaign', category: 'Digital Marketing', imageUrl: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=2071&auto=format&fit=crop', description: 'Social media strategy for a new SaaS product.', order: 3 },
      { title: 'Market Analysis Report', category: 'Business Strategy', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop', description: 'Comprehensive study of digital adoption in local SMEs.', order: 4 },
    ]
  });

  await prisma.experience.createMany({
    data: [
      { type: 'work', period: '2024 - 2025', title: 'Founder & Creative Director', organization: 'Apaya Creative Agency', description: "Founded and managed a student-led creative agency providing photography, videography, graphic design, and social media services to support clients' visual and promotional needs.", order: 1 },
      { type: 'work', period: 'Feb 2026 - Jun 2026', title: 'Project Manager', organization: 'ANDEC Digital Transformation Project', description: 'Led a multidisciplinary team in guiding the digital transformation process for an Event Organizer SME, coordinating digital business strategies, stakeholder management, and user experience (UX) design.', order: 2 },
      { type: 'work', period: '2022, Jan 2026 - Feb 2026', title: 'Freelance Graphic Designer', organization: 'Nizar Poster Team & Independent Clients', description: 'Produced visual assets and Instagram feed templates in high volume (up to 20 design themes per month) across various content categories while maintaining visual quality and branding consistency.', order: 3 },
      { type: 'leadership', period: '2025 - 2026', title: 'Head of Media Communication', organization: 'Dompet Dhuafa Volunteer Purwokerto', description: 'Led the media division in developing communication strategies and digital campaigns to increase public awareness, while managing content production and documentation for all social programs.', order: 4 },
      { type: 'leadership', period: '2024 - Present', title: 'Deputy General Chairman of Media and Research', organization: 'HIPMI PT Telkom Purwokerto', description: "Took full responsibility for the organization's media, branding, and research initiatives, supervising and aligning the Media Creative and Research & Information Technology divisions.", order: 5 },
      { type: 'leadership', period: '2023 - 2025', title: 'Head of Media Information', organization: 'IMMI Purwokerto', description: 'Managed all digital communication channels and online presence, planned content schedules, and ensured visual consistency across organizational publications.', order: 6 },
      { type: 'leadership', period: 'Jun 2024', title: 'Head of Public Design & Documentation', organization: 'HIPMI Entrepreneurship Seminar', description: 'Coordinated a team of photographers, videographers, and graphic designers to capture the entire seminar, managed real-time content publication on social media, and produced recap videos alongside promotional design assets.', order: 7 },
      { type: 'leadership', period: 'Mar - Apr 2025', title: 'Head of Public Design & Documentation', organization: 'TelUtizen Ramadhan Festival 2025', description: 'Directed the workflow for the public design and documentation team for the largest annual campus festival, allocating responsibilities to ensure the timely release and high quality of both visual designs and event coverage content.', order: 8 },
      { type: 'leadership', period: 'Nov - Dec 2023', title: 'Head of Public Design & Documentation', organization: 'IMMITALKS Indonesia', description: 'Guided the documentation and design team in capturing key moments of a national-scale Muslimpreneur conference, curating content, designing publication materials, and editing recap videos for public relations needs.', order: 9 },
    ]
  });

  await prisma.certification.createMany({
    data: [
      { year: '2026', title: 'Marketing Management Specialization', organization: 'MySkill', description: 'Acquired comprehensive knowledge in market analysis, brand strategy, digital campaign planning, and consumer behavior to effectively drive business growth and audience engagement.', order: 1 },
      { year: '2026', title: 'Graphic Design Fundamental Specialization', organization: 'MySkill', description: 'Mastered the core principles of visual communication, color theory, typography, and layout design, strengthening technical proficiency in creating impactful and well-structured visual assets.', order: 2 },
    ]
  });

  console.log("Database seeded successfully!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
