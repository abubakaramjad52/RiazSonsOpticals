import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://riazsonsopticals.pk';
const PRODUCTS_FILE = path.join(__dirname, '../src/data/initialProducts.ts');
const OUTPUT_SITEMAP = path.join(__dirname, '../public/sitemap.xml');

const main = () => {
  try {
    console.log('Generating sitemap...');

    // 1. Base static and category routes
    const urls = [
      { loc: `${DOMAIN}/`, changefreq: 'daily', priority: '1.0' },
      { loc: `${DOMAIN}/?category=men`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${DOMAIN}/?category=women`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${DOMAIN}/?category=blue-cut`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${DOMAIN}/?category=sunglasses`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${DOMAIN}/?category=transition`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${DOMAIN}/?category=contact-lenses`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${DOMAIN}/?category=eyeglasses`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${DOMAIN}/?category=accessories`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${DOMAIN}/?category=kids-eyewear`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${DOMAIN}/?category=rimless`, changefreq: 'weekly', priority: '0.8' },
    ];

    // 2. Read products from file and parse their IDs
    if (fs.existsSync(PRODUCTS_FILE)) {
      const content = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      
      // Regex to find matching product block configurations
      // Match something like: id: 'bc-1',
      const idRegex = /id:\s*['"]([^'"]+)['"]/g;
      let match;
      const productIds = [];
      
      while ((match = idRegex.exec(content)) !== null) {
        productIds.push(match[1]);
      }

      console.log(`Found ${productIds.length} products to index.`);

      // Add product deep-link URLs to sitemap
      productIds.forEach((id) => {
        urls.push({
          loc: `${DOMAIN}/?product=${id}`,
          changefreq: 'weekly',
          priority: '0.6',
        });
      });
    } else {
      console.warn('initialProducts.ts not found! Sitemap will only contain category pages.');
    }

    // 3. Generate XML
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const xmlFooter = '</urlset>';
    const xmlUrls = urls
      .map(
        (url) => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
      )
      .join('\n');

    const sitemapXml = `${xmlHeader}\n${xmlUrls}\n${xmlFooter}`;

    fs.writeFileSync(OUTPUT_SITEMAP, sitemapXml, 'utf-8');
    console.log(`Successfully generated sitemap.xml at: ${OUTPUT_SITEMAP}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
};

main();
