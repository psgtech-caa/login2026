/**
 * Sitemap Generator for LOGIN 2026
 * Reads events.json and builds a compliant sitemap.xml with lastmod dates.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://login.psgtech.ac.in';
const EVENTS_PATH = path.resolve(__dirname, '../src/data/events.json');
const OUTPUT_PATH = path.resolve(__dirname, '../public/sitemap.xml');

const staticRoutes = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: 'about', priority: '0.9', changefreq: 'weekly' },
  { path: 'events', priority: '0.95', changefreq: 'daily' },
  { path: 'ctf', priority: '0.95', changefreq: 'weekly' },
  { path: 'the-extraction', priority: '0.95', changefreq: 'weekly' },
  { path: 'login-2026', priority: '0.9', changefreq: 'weekly' },
  { path: 'timeline', priority: '0.8', changefreq: 'weekly' },
  { path: 'gallery', priority: '0.7', changefreq: 'weekly' },
  { path: 'contact', priority: '0.8', changefreq: 'monthly' },
  { path: 'coordinators', priority: '0.75', changefreq: 'monthly' },
  { path: 'winners', priority: '0.8', changefreq: 'daily' },
  { path: 'register', priority: '0.85', changefreq: 'weekly' },
];

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // Static Hub Routes
  for (const route of staticRoutes) {
    const loc = route.path ? `${BASE_URL}/${route.path}` : `${BASE_URL}/`;
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    if (!route.path) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${BASE_URL}/assets/login.webp</image:loc>\n`;
      xml += `      <image:title>LOGIN 2026 National Technical Symposium - PSG Tech Coimbatore</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  }

  // Dynamic Event Routes
  if (fs.existsSync(EVENTS_PATH)) {
    try {
      const eventsData = JSON.parse(fs.readFileSync(EVENTS_PATH, 'utf-8'));
      if (Array.isArray(eventsData)) {
        for (const event of eventsData) {
          const slug = event.slug || event.id;
          xml += `  <url>\n`;
          xml += `    <loc>${BASE_URL}/events/${slug}</loc>\n`;
          xml += `    <lastmod>${today}</lastmod>\n`;
          xml += `    <changefreq>weekly</changefreq>\n`;
          xml += `    <priority>${event.is_flagship ? '0.9' : '0.85'}</priority>\n`;
          if (event.guardian_asset) {
            xml += `    <image:image>\n`;
            xml += `      <image:loc>${BASE_URL}${event.guardian_asset}</image:loc>\n`;
            xml += `      <image:title>${event.name} Arena - LOGIN 2026 PSG Tech</image:title>\n`;
            xml += `    </image:image>\n`;
          }
          xml += `  </url>\n`;
        }
      }
    } catch (err) {
      console.error('Error reading events.json:', err);
    }
  }

  xml += `</urlset>\n`;

  fs.writeFileSync(OUTPUT_PATH, xml, 'utf-8');
  console.log(`Successfully generated sitemap at: ${OUTPUT_PATH}`);
}

generateSitemap();
