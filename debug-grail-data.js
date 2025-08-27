const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query'],
});

async function examineGrailData() {
  try {
    // First, let's see how many users have grail progress
    const userCount = await prisma.grailProgress.count();
    console.log(`\n📊 Found ${userCount} users with grail progress\n`);
    
    if (userCount === 0) {
      console.log('❌ No grail progress data found in database');
      return;
    }

    // Get a user with some data
    const grailProgress = await prisma.grailProgress.findFirst({
      where: {
        OR: [
          { totalItems: { gt: 0 } },
          { totalEthItems: { gt: 0 } },
          { totalRunes: { gt: 0 } },
          { totalRunewords: { gt: 0 } }
        ]
      },
      include: {
        user: {
          select: {
            username: true,
            displayName: true
          }
        }
      }
    });

    if (!grailProgress) {
      console.log('❌ No users found with actual grail data');
      return;
    }

    const user = grailProgress.user;
    console.log(`🎯 Examining data for user: ${user.displayName || user.username}`);
    console.log(`📈 Grail Settings:`);
    console.log(`   Game Mode: ${grailProgress.gameMode}`);
    console.log(`   Grail Type: ${grailProgress.grailType}`);
    console.log(`   Include Runes: ${grailProgress.includeRunes}`);
    console.log(`   Include Runewords: ${grailProgress.includeRunewords}\n`);

    console.log(`📊 Summary Stats:`);
    console.log(`   Total Items: ${grailProgress.totalItems}`);
    console.log(`   Total Eth Items: ${grailProgress.totalEthItems}`);
    console.log(`   Total Runes: ${grailProgress.totalRunes}`);
    console.log(`   Total Runewords: ${grailProgress.totalRunewords}`);
    console.log(`   Overall Completion: ${grailProgress.overallCompletion.toFixed(2)}%\n`);

    // Examine the items field structure
    console.log('🔍 EXAMINING ITEMS STRUCTURE:');
    console.log('=====================================');
    
    const items = grailProgress.items;
    const itemKeys = Object.keys(items);
    console.log(`📦 Items field contains ${itemKeys.length} keys\n`);

    if (itemKeys.length > 0) {
      console.log('🔍 First 10 item keys and their data:');
      itemKeys.slice(0, 10).forEach((key, index) => {
        console.log(`\n${index + 1}. Key: "${key}"`);
        console.log(`   Data:`, JSON.stringify(items[key], null, 2));
      });

      // Look for different patterns in keys
      console.log('\n🔍 ITEM KEY PATTERNS:');
      console.log('=====================');
      
      const patterns = {
        runewords: itemKeys.filter(k => k.includes('runeword')),
        uniques: itemKeys.filter(k => !k.includes('runeword') && !k.includes('set')),
        sets: itemKeys.filter(k => k.includes('set') && !k.includes('runeword'))
      };
      
      console.log(`Runeword keys (${patterns.runewords.length}):`, patterns.runewords.slice(0, 5));
      console.log(`Unique item keys (${patterns.uniques.length}):`, patterns.uniques.slice(0, 5));
      console.log(`Set item keys (${patterns.sets.length}):`, patterns.sets.slice(0, 5));
    }

    // Examine ethItems field structure
    console.log('\n🔍 EXAMINING ETHITEMS STRUCTURE:');
    console.log('==================================');
    
    const ethItems = grailProgress.ethItems;
    const ethItemKeys = Object.keys(ethItems);
    console.log(`💎 ethItems field contains ${ethItemKeys.length} keys\n`);

    if (ethItemKeys.length > 0) {
      console.log('🔍 First 5 eth item keys and their data:');
      ethItemKeys.slice(0, 5).forEach((key, index) => {
        console.log(`\n${index + 1}. Key: "${key}"`);
        console.log(`   Data:`, JSON.stringify(ethItems[key], null, 2));
      });
    }

    // Examine runes field structure
    console.log('\n🔍 EXAMINING RUNES STRUCTURE:');
    console.log('===============================');
    
    const runes = grailProgress.runes;
    const runeKeys = Object.keys(runes);
    console.log(`🪨 runes field contains ${runeKeys.length} keys\n`);

    if (runeKeys.length > 0) {
      console.log('🔍 First 10 rune keys and their data:');
      runeKeys.slice(0, 10).forEach((key, index) => {
        console.log(`\n${index + 1}. Key: "${key}"`);
        console.log(`   Data:`, JSON.stringify(runes[key], null, 2));
      });
    }

    // Examine runewords field structure
    console.log('\n🔍 EXAMINING RUNEWORDS STRUCTURE:');
    console.log('===================================');
    
    const runewords = grailProgress.runewords;
    const runewordKeys = Object.keys(runewords);
    console.log(`⚔️ runewords field contains ${runewordKeys.length} keys\n`);

    if (runewordKeys.length > 0) {
      console.log('🔍 All runeword keys and their data:');
      runewordKeys.forEach((key, index) => {
        console.log(`\n${index + 1}. Key: "${key}"`);
        console.log(`   Data:`, JSON.stringify(runewords[key], null, 2));
      });
    }

    console.log('\n✅ Database examination complete!');

  } catch (error) {
    console.error('❌ Error examining grail data:', error);
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

examineGrailData();