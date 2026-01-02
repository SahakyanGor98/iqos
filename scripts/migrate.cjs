const { createClient } = require('@supabase/supabase-js');

const iqosData = require('../assets/iqos.json');
const tereaData = require('../assets/terea.json');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('Starting migration...');

  const iqosProducts = iqosData.map((item) => ({
    slug: item.slug,
    title: item.title,
    description: item.description,
    image: item.image,
    price: item.price,
    category: item.category,
    in_stock: item.inStock,
    badges: item.badges,
    attributes: {
      line: item.line,
      color: item.color,
      salePrice: item.salePrice,
    },
    brand: 'IQOS',
  }));

  const tereaProducts = tereaData.map((item) => ({
    slug: item.slug,
    title: item.title,
    description: item.description,
    image: item.imageBlock,
    price: item.priceBlock,
    category: item.category,
    in_stock: item.inStock,
    badges: item.badges,
    attributes: {
      origin: item.origin,
      flavors: item.flavors,
      strength: item.strength,
      hasCapsule: item.hasCapsule,
      pricePack: item.pricePack,
      imagePack: item.imagePack,
    },
    brand: item.brand,
  }));

  const allProducts = [...iqosProducts, ...tereaProducts];

  console.log(`Found ${allProducts.length} products`);

  const { error } = await supabase.from('products').upsert(allProducts, { onConflict: 'slug' });

  if (error) {
    console.error('Migration failed:', error);
  } else {
    console.log('✅ Migration completed successfully');
  }
}

migrate();
