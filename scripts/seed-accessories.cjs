const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const accessoriesData = require('../assets/accessories.json');

// Parse .env file manually
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value.trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAccessories() {
  console.log('Starting accessories seeding to Supabase...');

  const accessoriesProducts = accessoriesData.map((item) => ({
    slug: item.slug,
    title: item.title,
    description: item.description,
    image: Array.isArray(item.image) ? item.image : [item.image],
    price: item.price,
    category: 'accessories',
    in_stock: item.inStock ?? true,
    badges: item.badges,
    attributes: item.attributes,
    brand: item.brand || 'IQOS',
  }));

  console.log(`Found ${accessoriesProducts.length} accessories to seed`);

  const { data, error } = await supabase
    .from('products')
    .upsert(accessoriesProducts, { onConflict: 'slug' })
    .select();

  if (error) {
    console.error('Seeding accessories failed:', error);
  } else {
    console.log(
      `✅ ${data ? data.length : accessoriesProducts.length} Accessories seeded successfully to Supabase!`,
    );
  }
}

seedAccessories();
