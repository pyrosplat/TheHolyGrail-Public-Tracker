import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Use the detailed category counts that are now synced from the desktop client
// These give us the exact counts that match the desktop client

interface CategorySummary {
  name: string
  owned: number
  exists: number
  percentage: number
}

interface ItemsResponse {
  categories: CategorySummary[]
  totalOwned: number
  totalExists: number
  overallPercentage: number
  grailType: string
  includeRunes: boolean
  includeRunewords: boolean
  actualItems?: any // The actual items data for detailed view if needed
  categorizedItems?: {
    uniqueArmor: any[]
    uniqueWeapons: any[]
    uniqueOther: any[]
    sets: any[]
    ethUniqueArmor: any[]
    ethUniqueWeapons: any[]
    ethUniqueOther: any[]
    runes: any[]
    runewords: any[]
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params

    // Get player data
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        grailProgress: true
      }
    })

    if (!user || !user.grailProgress) {
      return NextResponse.json(
        { error: 'Player not found or has no grail data' },
        { status: 404 }
      )
    }

    const grailProgress = user.grailProgress
    const categories: CategorySummary[] = []

    // Use the detailed category counts that are synced from the desktop client
    // These match exactly what the desktop client shows
    
    // Add unique armor
    if (grailProgress.armorExists > 0) {
      categories.push({
        name: 'Unique Armor',
        owned: grailProgress.armorOwned,
        exists: grailProgress.armorExists,
        percentage: grailProgress.armorExists > 0 ? (grailProgress.armorOwned / grailProgress.armorExists) * 100 : 0
      })
    }

    // Add unique weapons
    if (grailProgress.weaponsExists > 0) {
      categories.push({
        name: 'Unique Weapons',
        owned: grailProgress.weaponsOwned,
        exists: grailProgress.weaponsExists,
        percentage: grailProgress.weaponsExists > 0 ? (grailProgress.weaponsOwned / grailProgress.weaponsExists) * 100 : 0
      })
    }

    // Add unique other
    if (grailProgress.otherExists > 0) {
      categories.push({
        name: 'Unique Other',
        owned: grailProgress.otherOwned,
        exists: grailProgress.otherExists,
        percentage: grailProgress.otherExists > 0 ? (grailProgress.otherOwned / grailProgress.otherExists) * 100 : 0
      })
    }

    // Add sets
    if (grailProgress.setsExists > 0) {
      categories.push({
        name: 'Sets',
        owned: grailProgress.setsOwned,
        exists: grailProgress.setsExists,
        percentage: grailProgress.setsExists > 0 ? (grailProgress.setsOwned / grailProgress.setsExists) * 100 : 0
      })
    }

    // Add ethereal categories if applicable
    const grailType = grailProgress.grailType
    const showEtherealSeparately = grailType === 'Ethereal' || grailType === 'Each'
    
    if (showEtherealSeparately) {
      if (grailProgress.ethArmorExists > 0) {
        categories.push({
          name: 'Ethereal Unique Armor',
          owned: grailProgress.ethArmorOwned,
          exists: grailProgress.ethArmorExists,
          percentage: grailProgress.ethArmorExists > 0 ? (grailProgress.ethArmorOwned / grailProgress.ethArmorExists) * 100 : 0
        })
      }

      if (grailProgress.ethWeaponsExists > 0) {
        categories.push({
          name: 'Ethereal Unique Weapons',
          owned: grailProgress.ethWeaponsOwned,
          exists: grailProgress.ethWeaponsExists,
          percentage: grailProgress.ethWeaponsExists > 0 ? (grailProgress.ethWeaponsOwned / grailProgress.ethWeaponsExists) * 100 : 0
        })
      }

      if (grailProgress.ethOtherExists > 0) {
        categories.push({
          name: 'Ethereal Unique Other',
          owned: grailProgress.ethOtherOwned,
          exists: grailProgress.ethOtherExists,
          percentage: grailProgress.ethOtherExists > 0 ? (grailProgress.ethOtherOwned / grailProgress.ethOtherExists) * 100 : 0
        })
      }
    }

    // Add runes if enabled
    if (grailProgress.includeRunes && grailProgress.totalRunes >= 0) {
      categories.push({
        name: 'Runes',
        owned: grailProgress.totalRunes,
        exists: 33, // Total runes in D2R
        percentage: grailProgress.totalRunes >= 0 ? (grailProgress.totalRunes / 33) * 100 : 0
      })
    }

    // Add runewords if enabled
    if (grailProgress.includeRunewords && grailProgress.totalRunewords >= 0) {
      // Calculate expected runewords based on game version and settings
      // For D2R, there are approximately 78-93+ runewords depending on patches
      const expectedRunewords = 93 // This matches your client count
      categories.push({
        name: 'Runewords',
        owned: grailProgress.totalRunewords,
        exists: expectedRunewords,
        percentage: grailProgress.totalRunewords >= 0 ? (grailProgress.totalRunewords / expectedRunewords) * 100 : 0
      })
    }

    // Calculate totals
    const totalOwned = categories.reduce((sum, cat) => sum + cat.owned, 0)
    const totalExists = categories.reduce((sum, cat) => sum + cat.exists, 0)
    const overallPercentage = totalExists > 0 ? (totalOwned / totalExists) * 100 : 0

    // Process items into proper categories based on desktop client's structure
    const categorizedItems = {
      uniqueArmor: [] as any[],
      uniqueWeapons: [] as any[],
      uniqueOther: [] as any[],
      sets: [] as any[],
      ethUniqueArmor: [] as any[],
      ethUniqueWeapons: [] as any[],
      ethUniqueOther: [] as any[],
      runes: [] as any[],
      runewords: [] as any[]
    }

    // Helper function to categorize items based on actual data structure
    const categorizeItem = (key: string, item: any, isEthereal: boolean = false) => {
      const itemType = item.type || ''
      const itemName = (item.name || key).toLowerCase()
      const keyLower = key.toLowerCase()
      
      // Check for runes first (identified by type codes like r01, r30)
      if (itemType.startsWith('r') && itemType.match(/^r\d+$/)) {
        // This is a rune, but we handle it separately in the main function
        return
      }
      
      // Check for runewords (prefixed with "runeword" or type "runeword")
      if (keyLower.startsWith('runeword') || itemType === 'runeword') {
        // This is a runeword, but we handle it separately in the main function  
        return
      }
      
      // Check for set items by known set family patterns
      const setPatterns = [
        'sigons', 'sigon', // Sigon's Complete Steel
        'tancred', 'tancreds', // Tancred's Battlegear
        'aldurs', 'aldur', // Aldur's Watchtower
        'cleglaw', 'cleglaws', // Cleglaw's Brace
        'hsarus', 'hsaru', // Hsarus' Iron Fist
        'iratha', 'irathas', // Iratha's Finery
        'civerb', 'civerbs', // Civerb's Vestments
        'arctic', 'arctics', // Arctic Gear
        'berserker', 'berserkers', // Berserker's Arsenal
        'deaths', 'death', // Death's Disguise
        'angelic', 'angelics', // Angelic Raiment
        'cathan', 'cathans', // Cathan's Traps
        'infernal', 'infernals', // Infernal Tools
        'milabrega', 'milabregas', // Milabrega's Regalia
        'vidala', 'vidalas', // Vidala's Rig
        'immortal', 'immortals', // Immortal King
        'tal', 'tals', // Tal Rasha's Wrappings
        'griswold', 'griswolds', // Griswold's Legacy
        'trang', 'trangs', // Trang-Oul's Avatar
        'natalya', 'natalyas', // Natalya's Odium
        'mavina', 'mavinas', // M'avina's Battle Hymn
        'orphan', 'orphans', // Orphan's Call
        'cow', 'cows', // Cow King's Leathers
        'sander', 'sanders', // Sander's Folly
        'dangoon', 'dangoons', // The Disciple
        'hwanin', 'hwanins', // Hwanin's Majesty
        'bulkathos', // Bul-Kathos' Children
        'naj', 'najs', // Naj's Ancient Vestige
        'sazabi' // Sazabi's Grand Tribute
      ]
      
      const isSetItem = setPatterns.some(pattern => keyLower.includes(pattern) || itemName.includes(pattern))
      
      if (isSetItem) {
        categorizedItems.sets.push({
          key,
          name: item.name || key,
          type: itemType,
          found: true
        })
        return
      }
      
      // For unique items, categorize by item type
      // Armor type codes
      const armorTypes = [
        // Chest armor
        'qui', 'lea', 'har', 'stu', 'rin', 'sca', 'chn', 'spl', 'brs', 'plt', 'fld', 'got', 'ful', 'anc',
        // Helms
        'cap', 'skp', 'hel', 'fhl', 'ghm', 'crn', 'msk', 'bnh', 'drg',
        // Gloves
        'hgl', 'tgl', 'mgl', 'tgr', 'hgr', 'lgr', 'vgl', 'hgs', 'tgs', 'lgs', 'vgs',
        // Belts
        'lbl', 'hbl', 'mbl', 'tbl', 'vtb', 'thb', 'mvb', 'tgb', 'zgb',
        // Boots
        'lbt', 'hbt', 'cbt', 'tbt', 'plb', 'grb', 'wrb', 'tgr', 'tgs',
        // Shields
        'buc', 'sml', 'lrg', 'kit', 'spi', 'tow', 'got', 'anc', 'war', 'paa', 'nea', 'bsh', 'spk', 'bsp',
        // Circlets
        'cir', 'cor', 'tia', 'dia'
      ]
      
      // Weapon type codes
      const weaponTypes = [
        // Axes
        'hax', 'axe', 'lax', 'bax', 'btx', 'gax', 'gix', '9ax', '7ax', '7wa', '7la', '7ba', '7bt', '7ga', '7gi',
        // Bows
        'bow', 'sbw', 'hbw', 'lbw', 'cbw', 'swb', 'lwb', '6bow', '6s7', '6l7',
        // Crossbows
        'lxb', 'mxb', 'hxb', '6lx', '6mx', '6hx',
        // Daggers
        'dgr', 'dir', 'kri', 'bld', '72h', '7dg', '7di', '7kr', '7bl',
        // Maces/Clubs
        'clb', 'scp', 'gsc', 'wsp', 'mau', 'war', 'fla', '7cl', '7sc', '7qs', '7ws', '7ma', '7fl', '7wh',
        // Polearms
        'bar', 'vou', 'scy', 'pax', 'hal', 'wsc', '7ba', '7vo', '7s8', '7pa', '7h7', '7wc',
        // Spears
        'spr', 'tri', 'brn', 'spt', 'pik', '7sr', '7tr', '7br', '7st', '7p7',
        // Staves
        'sst', 'lst', 'cst', 'bst', 'wst', '6ss', '6ls', '6cs', '6bs', '6ws',
        // Swords
        'swd', 'sim', 'sbr', 'fsb', 'crs', 'bsd', 'lsd', 'flb', 'gsd', 'esw', 'clm', 'gis', 'bsw',
        // Wands
        'wnd', 'ywn', 'bwn', 'gwn', '7wn', '7yw', '7bw', '7gw',
        // Throwing weapons
        'tkn', 'tax', 'bkf', 'bal', 'jav', 'pil', 'ssp', 'gsp', 'tsp', '7tk', '7ta', '7bk', '7b8', '7ja', '7pi', '7s7', '7gl', '7ts',
        // Amazon/Assassin specific
        'amz', 'jaw', 'pas', 'ktr', 'wrb', 'axf', 'ces', 'clw', '7am', '8ja', '8pa', '7kr', '7wb', '7ax', '7ce', '7cl',
        // Orbs
        'orb', 'ob1', 'ob2', 'ob3', 'ob4', 'ob5',
        // Class specific items
        'nec', 'dru', 'bar', 'pal', 'sor', 'ama', 'ass'
      ]
      
      // Jewelry and charm type codes
      const otherTypes = [
        'rin', 'amu', 'jew', // jewelry
        'cm1', 'cm2', 'cm3', 'cm4' // charms
      ]
      
      // Categorize based on type
      const isArmor = armorTypes.some(t => itemType === t || itemType.startsWith(t))
      const isWeapon = weaponTypes.some(t => itemType === t || itemType.startsWith(t))
      const isOther = otherTypes.some(t => itemType === t || itemType.startsWith(t))
      
      let targetCategory = null
      
      if (isArmor) {
        targetCategory = isEthereal ? 'ethUniqueArmor' : 'uniqueArmor'
      } else if (isWeapon) {
        targetCategory = isEthereal ? 'ethUniqueWeapons' : 'uniqueWeapons'
      } else if (isOther) {
        targetCategory = isEthereal ? 'ethUniqueOther' : 'uniqueOther'
      } else {
        // Default to uniqueOther for unknown items
        targetCategory = isEthereal ? 'ethUniqueOther' : 'uniqueOther'
      }
      
      if (targetCategory) {
        categorizedItems[targetCategory].push({
          key,
          name: item.name || key,
          type: itemType,
          found: true
        })
      }
    }

    // Categorize all regular items
    if (grailProgress.items) {
      Object.entries(grailProgress.items).forEach(([key, item]) => {
        categorizeItem(key, item, false)
      })
    }

    // Categorize all ethereal items  
    if (grailProgress.ethItems) {
      Object.entries(grailProgress.ethItems).forEach(([key, item]) => {
        categorizeItem(key, item, true)
      })
    }

    // Add runes
    if (grailProgress.runes) {
      Object.entries(grailProgress.runes).forEach(([key, rune]) => {
        categorizedItems.runes.push({
          key,
          name: rune.name || key,
          type: rune.type || 'rune',
          found: true
        })
      })
    }

    // Add runewords
    if (grailProgress.runewords) {
      Object.entries(grailProgress.runewords).forEach(([key, runeword]) => {
        categorizedItems.runewords.push({
          key,
          name: runeword.name || key,
          type: 'runeword',
          found: true
        })
      })
    }

    const response: ItemsResponse = {
      categories,
      totalOwned,
      totalExists,
      overallPercentage,
      grailType: grailProgress.grailType,
      includeRunes: grailProgress.includeRunes,
      includeRunewords: grailProgress.includeRunewords,
      actualItems: {
        items: grailProgress.items,
        ethItems: grailProgress.ethItems,
        runes: grailProgress.runes,
        runewords: grailProgress.runewords
      },
      categorizedItems // Add the properly categorized items
    }

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error('Items API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}