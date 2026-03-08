// backend/scripts/fix-indexes.js
const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndexes() {
  try {
    console.log('🔧 Fixing MongoDB indexes...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Get all indexes
    const indexes = await usersCollection.listIndexes().toArray();
    console.log('📋 Current indexes:');
    indexes.forEach(idx => console.log('  -', idx.name, idx.key));

    // Drop the problematic username index if it exists
    const indexNames = indexes.map(idx => idx.name);
    
    if (indexNames.includes('username_1')) {
      console.log('🗑️  Dropping old username_1 index...');
      await usersCollection.dropIndex('username_1');
      console.log('✅ Dropped username_1 index');
    }

    if (indexNames.includes('username_1_email_1')) {
      console.log('🗑️  Dropping old username_1_email_1 index...');
      await usersCollection.dropIndex('username_1_email_1');
      console.log('✅ Dropped username_1_email_1 index');
    }

    // Verify remaining indexes
    const remainingIndexes = await usersCollection.listIndexes().toArray();
    console.log('\n📋 Remaining indexes:');
    remainingIndexes.forEach(idx => console.log('  -', idx.name, idx.key));

    console.log('\n✅ Index cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixIndexes();
