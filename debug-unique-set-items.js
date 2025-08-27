const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query'],
});

async function findUniqueAndSetItems() {
  try {
    // Get all users with grail progress
    const users = await prisma.grailProgress.findMany({
      include: {
        user: {
          select: {
            username: true,
            displayName: true
          }
        }
      }
    });

    console.log(`\n📊 Found ${users.length} users with grail progress\n`);

    // Look through each user's items to find unique and set items
    for (const userProgress of users) {
      const user = userProgress.user;
      console.log(`🔍 Examining user: ${user.displayName || user.username}`);
      
      const items = userProgress.items;
      const itemKeys = Object.keys(items);
      
      // Look for non-rune items
      const nonRuneItems = itemKeys.filter(key => {
        const item = items[key];
        return !item.type.startsWith('r') || item.type === 'runeword';
      });
      
      console.log(`   Non-rune items: ${nonRuneItems.length}`);
      
      if (nonRuneItems.length > 0) {
        console.log('\n🔍 SAMPLE NON-RUNE ITEMS:');
        console.log('===========================');
        
        nonRuneItems.slice(0, 15).forEach((key, index) => {
          const item = items[key];
          console.log(`\n${index + 1}. Key: "${key}"`);
          console.log(`   Type: "${item.type}"`);
          console.log(`   Name: "${item.name}"`);
          
          // Show just the structure, not all the save data
          const sampleSave = Object.keys(item.inSaves)[0];
          const sampleItemData = item.inSaves[sampleSave][0];
          console.log(`   Sample data:`, JSON.stringify(sampleItemData, null, 4));
        });
        
        // Look for patterns
        const patterns = {
          unique_armor: nonRuneItems.filter(key => {
            const item = items[key];
            return item.type && (
              item.type.includes('arn') || item.type.includes('arm') || 
              item.type.includes('hel') || item.type.includes('cap') ||
              item.type.includes('lea') || item.type.includes('stu') ||
              item.type.includes('rin') || item.type.includes('cha') ||
              item.type.includes('brs') || item.type.includes('plt')
            );
          }),
          unique_weapons: nonRuneItems.filter(key => {
            const item = items[key];
            return item.type && (
              item.type.includes('axe') || item.type.includes('bow') || 
              item.type.includes('swrd') || item.type.includes('mace') ||
              item.type.includes('spear') || item.type.includes('dag') ||
              item.type.includes('staff') || item.type.includes('wand')
            );
          }),
          potential_sets: nonRuneItems.filter(key => key.toLowerCase().includes('set') || key.toLowerCase().includes('sigon') || key.toLowerCase().includes('tancred') || key.toLowerCase().includes('aldur')),
          runewords: nonRuneItems.filter(key => key.startsWith('runeword') || items[key].type === 'runeword')
        };
        
        console.log('\n🔍 ITEM CATEGORIZATION:');
        console.log('========================');
        console.log(`Potential armor: ${patterns.unique_armor.length} items`);
        if (patterns.unique_armor.length > 0) {
          console.log(`   Examples: ${patterns.unique_armor.slice(0, 5).join(', ')}`);
        }
        
        console.log(`Potential weapons: ${patterns.unique_weapons.length} items`);
        if (patterns.unique_weapons.length > 0) {
          console.log(`   Examples: ${patterns.unique_weapons.slice(0, 5).join(', ')}`);
        }
        
        console.log(`Potential sets: ${patterns.potential_sets.length} items`);
        if (patterns.potential_sets.length > 0) {
          console.log(`   Examples: ${patterns.potential_sets.slice(0, 5).join(', ')}`);
        }
        
        console.log(`Runewords: ${patterns.runewords.length} items`);
        if (patterns.runewords.length > 0) {
          console.log(`   Examples: ${patterns.runewords.slice(0, 5).join(', ')}`);
        }
        
        console.log('\n================================\n');
        
        // If we found good examples, we can stop here
        if (nonRuneItems.length > 10) {
          break;
        }
      }
    }

    console.log('\n✅ Unique and set item examination complete!');

  } catch (error) {
    console.error('❌ Error examining unique and set items:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Check if we have the database URL
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  console.log('Please make sure you have a .env file with DATABASE_URL set');
  process.exit(1);
}

findUniqueAndSetItems();