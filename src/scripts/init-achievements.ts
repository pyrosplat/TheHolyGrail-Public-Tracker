const { PrismaClient } = require('@prisma/client')
const { ACHIEVEMENTS } = require('../lib/achievements')

const prisma = new PrismaClient()

async function initializeAchievements() {
  console.log('Initializing achievements...')
  
  try {
    for (const achievement of ACHIEVEMENTS) {
      await prisma.achievement.upsert({
        where: { key: achievement.key },
        update: {
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          category: achievement.category,
          rarity: achievement.rarity,
          points: achievement.points,
          conditions: achievement.conditions,
        },
        create: {
          key: achievement.key,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          category: achievement.category,
          rarity: achievement.rarity,
          points: achievement.points,
          conditions: achievement.conditions,
        },
      })
    }
    
    console.log(`✅ Initialized ${ACHIEVEMENTS.length} achievements`)
  } catch (error) {
    console.error('❌ Error initializing achievements:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  initializeAchievements()
}

module.exports = initializeAchievements