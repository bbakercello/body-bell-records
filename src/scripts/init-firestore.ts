import { initializeCollections } from '../lib/firebase/migrations/init.js';

async function main() {
  try {
    await initializeCollections();
    console.log('Firestore initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Firestore initialization failed:', error);
    process.exit(1);
  }
}

main(); 