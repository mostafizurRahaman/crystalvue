const { PrismaClient } = require('@prisma/client');

async function checkModels() {
  const db = new PrismaClient();
  
  // Get all model names
  const models = Object.keys(db).filter(key => 
    typeof db[key] === 'object' && 
    db[key] !== null && 
    key.includes('about') || key.includes('global') || key.includes('hero') || key.includes('slider') || key.includes('category')
  );
  
  console.log('Available models:', models);
  
  // Try each model
  const testModels = ['aboutPage', 'globalSettings', 'heroSlider', 'category'];
  
  for (const model of testModels) {
    if (db[model] && typeof db[model] === 'object') {
      console.log(`✓ ${model} exists as object`);
    } else {
      console.log(`✗ ${model} does not exist or is not an object`);
    }
  }
  
  await db.$disconnect();
}

checkModels().catch(console.error);
