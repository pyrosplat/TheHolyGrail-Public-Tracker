// Achievement definitions
export const ACHIEVEMENTS = [
  // First Item Milestones
  {
    key: 'first_unique',
    name: 'First Blood',
    description: 'Find your first unique item',
    icon: '🏆',
    category: 'milestone',
    rarity: 'common',
    points: 10,
    conditions: { totalItems: { min: 1 } },
  },
  {
    key: 'first_set',
    name: 'Set Collector',
    description: 'Find your first set item',
    icon: '🎯',
    category: 'milestone',
    rarity: 'common',
    points: 10,
    conditions: { setItems: { min: 1 } },
  },
  {
    key: 'first_rune',
    name: 'Runic Awakening',
    description: 'Find your first high rune',
    icon: '🗿',
    category: 'milestone',
    rarity: 'common',
    points: 15,
    conditions: { totalRunes: { min: 1 } },
  },
  {
    key: 'first_runeword',
    name: 'Word Smith',
    description: 'Create your first runeword',
    icon: '⚡',
    category: 'milestone',
    rarity: 'common',
    points: 20,
    conditions: { totalRunewords: { min: 1 } },
  },

  // Progress Milestones
  {
    key: 'grail_10',
    name: 'Getting Started',
    description: 'Reach 10% Holy Grail completion',
    icon: '🌟',
    category: 'milestone',
    rarity: 'common',
    points: 25,
    conditions: { overallCompletion: { min: 10 } },
  },
  {
    key: 'grail_25',
    name: 'Quarter Master',
    description: 'Reach 25% Holy Grail completion',
    icon: '🌟',
    category: 'milestone',
    rarity: 'common',
    points: 50,
    conditions: { overallCompletion: { min: 25 } },
  },
  {
    key: 'grail_50',
    name: 'Halfway There',
    description: 'Reach 50% Holy Grail completion',
    icon: '⭐',
    category: 'milestone',
    rarity: 'rare',
    points: 100,
    conditions: { overallCompletion: { min: 50 } },
  },
  {
    key: 'grail_75',
    name: 'Three Quarters',
    description: 'Reach 75% Holy Grail completion',
    icon: '🌟',
    category: 'milestone',
    rarity: 'epic',
    points: 200,
    conditions: { overallCompletion: { min: 75 } },
  },
  {
    key: 'grail_90',
    name: 'Almost There',
    description: 'Reach 90% Holy Grail completion',
    icon: '💎',
    category: 'milestone',
    rarity: 'epic',
    points: 400,
    conditions: { overallCompletion: { min: 90 } },
  },
  {
    key: 'grail_95',
    name: 'So Close',
    description: 'Reach 95% Holy Grail completion',
    icon: '💎',
    category: 'milestone',
    rarity: 'legendary',
    points: 800,
    conditions: { overallCompletion: { min: 95 } },
  },

  // Completion Achievements
  {
    key: 'grail_complete',
    name: 'Holy Grail Master',
    description: 'Complete the Holy Grail - find every item!',
    icon: '👑',
    category: 'completion',
    rarity: 'legendary',
    points: 2000,
    conditions: { overallCompletion: { min: 100 } },
  },
  {
    key: 'all_sets',
    name: 'Set Completionist',
    description: 'Find all set items in the game',
    icon: '🎯',
    category: 'completion',
    rarity: 'epic',
    points: 300,
    conditions: { allSetsFound: true },
  },
  {
    key: 'all_runes',
    name: 'Rune Master',
    description: 'Find all 33 runes',
    icon: '🗿',
    category: 'completion',
    rarity: 'epic',
    points: 500,
    conditions: { totalRunes: { min: 33 } },
  },
  {
    key: 'rainbow_facets',
    name: 'Rainbow Collection',
    description: 'Find all 8 Rainbow Facet variants',
    icon: '🌈',
    category: 'completion',
    rarity: 'legendary',
    points: 750,
    conditions: { rainbowFacets: { min: 8 } },
  },

  // Item Category Achievements
  {
    key: 'weapon_collector',
    name: 'Weapon Master',
    description: 'Find 50 unique weapons',
    icon: '⚔️',
    category: 'milestone',
    rarity: 'rare',
    points: 75,
    conditions: { weaponsOwned: { min: 50 } },
  },
  {
    key: 'armor_collector',
    name: 'Armorer',
    description: 'Find 30 unique armor pieces',
    icon: '🛡️',
    category: 'milestone',
    rarity: 'rare',
    points: 60,
    conditions: { armorOwned: { min: 30 } },
  },
  {
    key: 'ethereal_hunter',
    name: 'Ghost Hunter',
    description: 'Find 25 ethereal items',
    icon: '👻',
    category: 'milestone',
    rarity: 'epic',
    points: 100,
    conditions: { totalEthItems: { min: 25 } },
  },

  // Streak Achievements
  {
    key: 'week_streak',
    name: 'Weekly Warrior',
    description: 'Find items for 7 consecutive days',
    icon: '🔥',
    category: 'special',
    rarity: 'rare',
    points: 50,
    conditions: { currentStreak: { min: 7 } },
  },
  {
    key: 'month_streak',
    name: 'Monthly Champion',
    description: 'Find items for 30 consecutive days',
    icon: '🏆',
    category: 'special',
    rarity: 'epic',
    points: 200,
    conditions: { currentStreak: { min: 30 } },
  },

  // Speed Achievements
  {
    key: 'speed_demon',
    name: 'Speed Demon',
    description: 'Find 10 items in a single day',
    icon: '⚡',
    category: 'speed',
    rarity: 'rare',
    points: 100,
    conditions: { itemsInDay: { min: 10 } },
  },
  {
    key: 'marathon',
    name: 'Marathon Runner',
    description: 'Find items for 30 consecutive days',
    icon: '🏃',
    category: 'speed',
    rarity: 'epic',
    points: 300,
    conditions: { currentStreak: { min: 30 } },
  },
  {
    key: 'dedication',
    name: 'Dedication',
    description: 'Find items for 100 consecutive days',
    icon: '🔥',
    category: 'speed',
    rarity: 'legendary',
    points: 1000,
    conditions: { currentStreak: { min: 100 } },
  },

  // Special Achievements
  {
    key: 'early_bird',
    name: 'Early Bird',
    description: 'One of the first 100 players to register',
    icon: '🐦',
    category: 'special',
    rarity: 'rare',
    points: 50,
    conditions: { registrationRank: { max: 100 } },
  },
  {
    key: 'community_hero',
    name: 'Community Hero',
    description: 'Help 10 other players by sharing progress',
    icon: '🤝',
    category: 'special',
    rarity: 'epic',
    points: 200,
    conditions: { communityPoints: { min: 100 } },
  },
  {
    key: 'beta_tester',
    name: 'Beta Tester',
    description: 'Participated in the webapp beta testing',
    icon: '🧪',
    category: 'special',
    rarity: 'rare',
    points: 75,
    conditions: { betaTester: true },
  },
  {
    key: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete both normal AND ethereal Holy Grail',
    icon: '🎭',
    category: 'special',
    rarity: 'legendary',
    points: 3000,
    conditions: { 
      normalCompletion: { min: 100 },
      etherealCompletion: { min: 100 }
    },
  },
]

// Achievement categories for organization
export const ACHIEVEMENT_CATEGORIES = {
  milestone: 'Milestones',
  completion: 'Completion',
  speed: 'Speed',
  special: 'Special',
}

// Rarity colors and styles
export const ACHIEVEMENT_RARITIES = {
  common: {
    color: '#4caf50',
    name: 'Common',
  },
  rare: {
    color: '#2196f3',
    name: 'Rare',
  },
  epic: {
    color: '#9c27b0',
    name: 'Epic',
  },
  legendary: {
    color: '#ff9800',
    name: 'Legendary',
  },
}

function checkAchievementConditions(
  achievement: typeof ACHIEVEMENTS[0],
  progress: any
): boolean {
  const conditions = achievement.conditions
  
  for (const [key, condition] of Object.entries(conditions)) {
    const value = progress[key]
    
    if (typeof condition === 'object' && condition !== null) {
      const conditionObj = condition as any
      
      if ('min' in conditionObj && value < conditionObj.min) {
        return false
      }
      
      if ('max' in conditionObj && value > conditionObj.max) {
        return false
      }
    } else if (condition !== value) {
      return false
    }
  }
  
  return true
}

function calculateAchievementPoints(achievements: any[]): number {
  return achievements.reduce((total, achievement) => {
    return total + (achievement.achievement?.points || 0)
  }, 0)
}

module.exports = {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  ACHIEVEMENT_RARITIES,
  checkAchievementConditions,
  calculateAchievementPoints
}