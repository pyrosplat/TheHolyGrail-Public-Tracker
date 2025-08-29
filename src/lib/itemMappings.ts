// Client-side item categorization and name mapping
// Based on d2-holy-grail seed data structure
import { silospenMapping } from './silospenMapping'

export interface ItemInfo {
  name: string
  category: 'armor' | 'weapons' | 'other'
  subCategory: string
  tier: 'normal' | 'exceptional' | 'elite'
  isSet?: boolean
  isEthereal?: boolean
}

// Comprehensive item mappings based on D2R Holy Grail structure
export const itemMappings: Record<string, ItemInfo> = {
  // === UNIQUE ARMOR ===
  
  // CHEST ARMOR - Normal
  'greyform': { name: 'Greyform', category: 'armor', subCategory: 'Chest', tier: 'normal' },
  'blinkbatsform': { name: "Blinkbat's Form", category: 'armor', subCategory: 'Chest', tier: 'normal' },
  'thecenturion': { name: 'The Centurion', category: 'armor', subCategory: 'Chest', tier: 'normal' },
  'twitchthroe': { name: 'Twitchthroe', category: 'armor', subCategory: 'Chest', tier: 'normal' },
  'darkglow': { name: 'Darkglow', category: 'armor', subCategory: 'Chest', tier: 'normal' },
  'hawkmail': { name: 'Hawkmail', category: 'armor', subCategory: 'Chest', tier: 'normal' },
  'venomward': { name: 'Venom Ward', category: 'armor', subCategory: 'Chest', tier: 'normal' },
  'sparkingmail': { name: 'Sparking Mail', category: 'armor', subCategory: 'Chest', tier: 'normal' },
  'iceblink': { name: 'Iceblink', category: 'armor', subCategory: 'Chest', tier: 'normal' },
  'heavenlygarb': { name: 'Heavenly Garb', category: 'armor', subCategory: 'Chest', tier: 'normal' },
  'rockfleece': { name: 'Rockfleece', category: 'armor', subCategory: 'Chest', tier: 'normal' },
  'boneflesh': { name: 'Boneflesh', category: 'armor', subCategory: 'Chest', tier: 'normal' },
  'rattlecage': { name: 'Rattlecage', category: 'armor', subCategory: 'Chest', tier: 'normal' },
  'goldskin': { name: 'Goldskin', category: 'armor', subCategory: 'Chest', tier: 'normal' },
  'silksofthevictor': { name: 'Silks of the Victor', category: 'armor', subCategory: 'Chest', tier: 'normal' },
  
  // CHEST ARMOR - Exceptional
  'thespiritshroud': { name: 'The Spirit Shroud', category: 'armor', subCategory: 'Chest', tier: 'exceptional' },
  'skinofthevipermagi': { name: 'Skin of the Vipermagi', category: 'armor', subCategory: 'Chest', tier: 'exceptional' },
  'skinoftheflayedone': { name: 'Skin of the Flayed One', category: 'armor', subCategory: 'Chest', tier: 'exceptional' },
  'ironpelt': { name: 'Iron Pelt', category: 'armor', subCategory: 'Chest', tier: 'exceptional' },
  'crowcaw': { name: 'Crow Caw', category: 'armor', subCategory: 'Chest', tier: 'exceptional' },
  'spiritforge': { name: 'Spirit Forge', category: 'armor', subCategory: 'Chest', tier: 'exceptional' },
  'durielsshell': { name: "Duriel's Shell", category: 'armor', subCategory: 'Chest', tier: 'exceptional' },
  'shaftstop': { name: 'Shaftstop', category: 'armor', subCategory: 'Chest', tier: 'exceptional' },
  'skullders': { name: "Skullder's Ire", category: 'armor', subCategory: 'Chest', tier: 'exceptional' },
  'quehegansw': { name: "Que-Hegan's Wisdom", category: 'armor', subCategory: 'Chest', tier: 'exceptional' },
  'toothrow': { name: 'Toothrow', category: 'armor', subCategory: 'Chest', tier: 'exceptional' },
  'guardianangel': { name: 'Guardian Angel', category: 'armor', subCategory: 'Chest', tier: 'exceptional' },
  'atmaswail': { name: "Atma's Wail", category: 'armor', subCategory: 'Chest', tier: 'exceptional' },
  'blackhades': { name: 'Black Hades', category: 'armor', subCategory: 'Chest', tier: 'exceptional' },
  'corpsemourn': { name: 'Corpsemourn', category: 'armor', subCategory: 'Chest', tier: 'exceptional' },
  
  // CHEST ARMOR - Elite
  'ormusrobes': { name: "Ormus' Robes", category: 'armor', subCategory: 'Chest', tier: 'elite' },
  'gladiatorsbane': { name: "The Gladiator's Bane", category: 'armor', subCategory: 'Chest', tier: 'elite' },
  'arkainesvalor': { name: "Arkaine's Valor", category: 'armor', subCategory: 'Chest', tier: 'elite' },
  'leviathan': { name: 'Leviathan', category: 'armor', subCategory: 'Chest', tier: 'elite' },
  'steelcarapace': { name: 'Steel Carapace', category: 'armor', subCategory: 'Chest', tier: 'elite' },
  'templarsmight': { name: "Templar's Might", category: 'armor', subCategory: 'Chest', tier: 'elite' },
  'tyraelsmight': { name: "Tyrael's Might", category: 'armor', subCategory: 'Chest', tier: 'elite' },
  
  // HELMS - Normal
  'bigginsb': { name: "Biggin's Bonnet", category: 'armor', subCategory: 'Helms', tier: 'normal' },
  'tarnhelm': { name: 'Tarnhelm', category: 'armor', subCategory: 'Helms', tier: 'normal' },
  'coifofglory': { name: 'Coif of Glory', category: 'armor', subCategory: 'Helms', tier: 'normal' },
  'duskdeep': { name: 'Duskdeep', category: 'armor', subCategory: 'Helms', tier: 'normal' },
  'wormskull': { name: 'Wormskull', category: 'armor', subCategory: 'Helms', tier: 'normal' },
  'howltusk': { name: 'Howltusk', category: 'armor', subCategory: 'Helms', tier: 'normal' },
  'undeadcrown': { name: 'Undead Crown', category: 'armor', subCategory: 'Helms', tier: 'normal' },
  'faceofhorror': { name: 'The Face of Horror', category: 'armor', subCategory: 'Helms', tier: 'normal' },
  
  // HELMS - Exceptional
  'peasantcrown': { name: 'Peasant Crown', category: 'armor', subCategory: 'Helms', tier: 'exceptional' },
  'rockstopper': { name: 'Rockstopper', category: 'armor', subCategory: 'Helms', tier: 'exceptional' },
  'stealskull': { name: 'Stealskull', category: 'armor', subCategory: 'Helms', tier: 'exceptional' },
  'darksighthelm': { name: 'Darksight Helm', category: 'armor', subCategory: 'Helms', tier: 'exceptional' },
  'vampiregaze': { name: 'Vampire Gaze', category: 'armor', subCategory: 'Helms', tier: 'exceptional' },
  'valkyriewing': { name: 'Valkyrie Wing', category: 'armor', subCategory: 'Helms', tier: 'exceptional' },
  'crownofthieves': { name: 'Crown of Thieves', category: 'armor', subCategory: 'Helms', tier: 'exceptional' },
  'blackhornsface': { name: "Blackhorn's Face", category: 'armor', subCategory: 'Helms', tier: 'exceptional' },
  
  // HELMS - Elite
  'andarielsvisage': { name: "Andariel's Visage", category: 'armor', subCategory: 'Helms', tier: 'elite' },
  'arreatsface': { name: "Arreat's Face", category: 'other', subCategory: 'Class Helms', tier: 'elite' },
  'crownofages': { name: 'Crown of Ages', category: 'armor', subCategory: 'Helms', tier: 'elite' },
  'demonhornsedge': { name: "Demonhorn's Edge", category: 'other', subCategory: 'Class Helms', tier: 'elite' },
  'giantskull': { name: 'Giant Skull', category: 'armor', subCategory: 'Helms', tier: 'elite' },
  'halaberdreign': { name: "Halaberd's Reign", category: 'other', subCategory: 'Class Helms', tier: 'elite' },
  'harlequincrest': { name: 'Harlequin Crest', category: 'armor', subCategory: 'Helms', tier: 'elite' },
  'nightwingsveil': { name: "Nightwing's Veil", category: 'armor', subCategory: 'Helms', tier: 'elite' },
  'ravenlore': { name: 'Ravenlore', category: 'other', subCategory: 'Class Helms', tier: 'elite' },
  'spiritkeeper': { name: 'Spirit Keeper', category: 'other', subCategory: 'Class Helms', tier: 'elite' },
  'steelshade': { name: 'Steel Shade', category: 'armor', subCategory: 'Helms', tier: 'elite' },
  'veilofsteel': { name: 'Veil of Steel', category: 'armor', subCategory: 'Helms', tier: 'elite' },
  'wolfhowl': { name: 'Wolfhowl', category: 'other', subCategory: 'Class Helms', tier: 'elite' },
  
  // CIRCLETS - Elite
  'kirasguardian': { name: "Kira's Guardian", category: 'armor', subCategory: 'Circlets', tier: 'elite' },
  'griffonseye': { name: "Griffon's Eye", category: 'armor', subCategory: 'Circlets', tier: 'elite' },
  
  // GLOVES - Normal
  'thehandofbroc': { name: 'The Hand of Broc', category: 'armor', subCategory: 'Gloves', tier: 'normal' },
  'bloodfist': { name: 'Bloodfist', category: 'armor', subCategory: 'Gloves', tier: 'normal' },
  'chanceguards': { name: 'Chance Guards', category: 'armor', subCategory: 'Gloves', tier: 'normal' },
  'magefist': { name: 'Magefist', category: 'armor', subCategory: 'Gloves', tier: 'normal' },
  'frostburn': { name: 'Frostburn', category: 'armor', subCategory: 'Gloves', tier: 'normal' },
  
  // GLOVES - Exceptional
  'venomgrip': { name: 'Venom Grip', category: 'armor', subCategory: 'Gloves', tier: 'exceptional' },
  'gravepalm': { name: 'Gravepalm', category: 'armor', subCategory: 'Gloves', tier: 'exceptional' },
  'ghoulhide': { name: 'Ghoulhide', category: 'armor', subCategory: 'Gloves', tier: 'exceptional' },
  'lavagout': { name: 'Lava Gout', category: 'armor', subCategory: 'Gloves', tier: 'exceptional' },
  'hellmouth': { name: 'Hellmouth', category: 'armor', subCategory: 'Gloves', tier: 'exceptional' },
  
  // GLOVES - Elite
  'draculsgrasp': { name: "Dracul's Grasp", category: 'armor', subCategory: 'Gloves', tier: 'elite' },
  'souldrainer': { name: 'Soul Drainer', category: 'armor', subCategory: 'Gloves', tier: 'elite' },
  'steelrend': { name: 'Steelrend', category: 'armor', subCategory: 'Gloves', tier: 'elite' },
  
  // BELTS - Normal
  'lenymo': { name: 'Lenymo', category: 'armor', subCategory: 'Belts', tier: 'normal' },
  'snakecord': { name: 'Snakecord', category: 'armor', subCategory: 'Belts', tier: 'normal' },
  'nightsmoke': { name: 'Nightsmoke', category: 'armor', subCategory: 'Belts', tier: 'normal' },
  'goldwrap': { name: 'Goldwrap', category: 'armor', subCategory: 'Belts', tier: 'normal' },
  'bladebuckle': { name: 'Bladebuckle', category: 'armor', subCategory: 'Belts', tier: 'normal' },
  
  // BELTS - Exceptional
  'stringofears': { name: 'String of Ears', category: 'armor', subCategory: 'Belts', tier: 'exceptional' },
  'razortail': { name: 'Razortail', category: 'armor', subCategory: 'Belts', tier: 'exceptional' },
  'gloomstrap': { name: "Gloom's Trap", category: 'armor', subCategory: 'Belts', tier: 'exceptional' },
  'snowclash': { name: 'Snowclash', category: 'armor', subCategory: 'Belts', tier: 'exceptional' },
  'thundergodsvigor': { name: "Thundergod's Vigor", category: 'armor', subCategory: 'Belts', tier: 'exceptional' },
  
  // BELTS - Elite
  'arachnidmesh': { name: 'Arachnid Mesh', category: 'armor', subCategory: 'Belts', tier: 'elite' },
  'nosferatuscoil': { name: "Nosferatu's Coil", category: 'armor', subCategory: 'Belts', tier: 'elite' },
  'verdungosheartycord': { name: "Verdungo's Hearty Cord", category: 'armor', subCategory: 'Belts', tier: 'elite' },
  
  // BOOTS - Normal
  'hotspur': { name: 'Hotspur', category: 'armor', subCategory: 'Boots', tier: 'normal' },
  'gorefoot': { name: 'Gorefoot', category: 'armor', subCategory: 'Boots', tier: 'normal' },
  'treadsofcthon': { name: 'Treads of Cthon', category: 'armor', subCategory: 'Boots', tier: 'normal' },
  'goblintoe': { name: 'Goblin Toe', category: 'armor', subCategory: 'Boots', tier: 'normal' },
  'tearhaunch': { name: 'Tearhaunch', category: 'armor', subCategory: 'Boots', tier: 'normal' },
  
  // BOOTS - Exceptional
  'infernostride': { name: 'Infernostride', category: 'armor', subCategory: 'Boots', tier: 'exceptional' },
  'waterwalk': { name: 'Waterwalk', category: 'armor', subCategory: 'Boots', tier: 'exceptional' },
  'silkweave': { name: 'Silkweave', category: 'armor', subCategory: 'Boots', tier: 'exceptional' },
  'wartraveler': { name: 'War Traveler', category: 'armor', subCategory: 'Boots', tier: 'exceptional' },
  'gorerider': { name: 'Gore Rider', category: 'armor', subCategory: 'Boots', tier: 'exceptional' },
  
  // BOOTS - Elite
  'marrowwalk': { name: 'Marrowwalk', category: 'armor', subCategory: 'Boots', tier: 'elite' },
  'sandstormtrek': { name: 'Sandstorm Trek', category: 'armor', subCategory: 'Boots', tier: 'elite' },
  'shadowdancer': { name: 'Shadow Dancer', category: 'armor', subCategory: 'Boots', tier: 'elite' },
  
  // SHIELDS - Normal
  'peltalunata': { name: 'Pelta Lunata', category: 'armor', subCategory: 'Shields', tier: 'normal' },
  'umbraldisk': { name: 'Umbral Disk', category: 'armor', subCategory: 'Shields', tier: 'normal' },
  'stormguild': { name: 'Stormguild', category: 'armor', subCategory: 'Shields', tier: 'normal' },
  'swordbackhold': { name: 'Swordback Hold', category: 'armor', subCategory: 'Shields', tier: 'normal' },
  'steelclash': { name: 'Steelclash', category: 'armor', subCategory: 'Shields', tier: 'normal' },
  'walloftheeyeless': { name: 'Wall of the Eyeless', category: 'armor', subCategory: 'Shields', tier: 'normal' },
  'bverritkeep': { name: 'Bverrit Keep', category: 'armor', subCategory: 'Shields', tier: 'normal' },
  'theward': { name: 'The Ward', category: 'armor', subCategory: 'Shields', tier: 'normal' },
  
  // SHIELDS - Exceptional
  'visceratuant': { name: 'Visceratuant', category: 'armor', subCategory: 'Shields', tier: 'exceptional' },
  'mosersblessedcircle': { name: "Moser's Blessed Circle", category: 'armor', subCategory: 'Shields', tier: 'exceptional' },
  'stormchaser': { name: 'Stormchaser', category: 'armor', subCategory: 'Shields', tier: 'exceptional' },
  'lanceguard': { name: 'Lance Guard', category: 'armor', subCategory: 'Shields', tier: 'exceptional' },
  'tiamatsrebuke': { name: "Tiamat's Rebuke", category: 'armor', subCategory: 'Shields', tier: 'exceptional' },
  'lidlesswall': { name: 'Lidless Wall', category: 'armor', subCategory: 'Shields', tier: 'exceptional' },
  'gerkessanctuary': { name: "Gerke's Sanctuary", category: 'armor', subCategory: 'Shields', tier: 'exceptional' },
  'radamentssphere': { name: "Radament's Sphere", category: 'armor', subCategory: 'Shields', tier: 'exceptional' },
  
  // SHIELDS - Elite
  'almanega': { name: 'Alma Negra', category: 'other', subCategory: 'Class Shields', tier: 'elite' },
  'blackoakshield': { name: 'Blackoak Shield', category: 'armor', subCategory: 'Shields', tier: 'elite' },
  'boneflame': { name: 'Boneflame', category: 'other', subCategory: 'Class Shields', tier: 'elite' },
  'darkforcespawn': { name: 'Darkforce Spawn', category: 'other', subCategory: 'Class Shields', tier: 'elite' },
  'dragonscale': { name: 'Dragonscale', category: 'other', subCategory: 'Class Shields', tier: 'elite' },
  'headhuntersglory': { name: "Head Hunter's Glory", category: 'armor', subCategory: 'Shields', tier: 'elite' },
  'homunculus': { name: 'Homunculus', category: 'other', subCategory: 'Class Shields', tier: 'elite' },
  'medusasgaze': { name: "Medusa's Gaze", category: 'armor', subCategory: 'Shields', tier: 'elite' },
  'spikethorn': { name: 'Spike Thorn', category: 'armor', subCategory: 'Shields', tier: 'elite' },
  'spiritward': { name: 'Spirit Ward', category: 'armor', subCategory: 'Shields', tier: 'elite' },
  'stoneraven': { name: 'Stoneraven', category: 'other', subCategory: 'Shields', tier: 'elite' },
  'stormshield': { name: 'Stormshield', category: 'armor', subCategory: 'Shields', tier: 'elite' },
  
  // PALADIN SHIELDS - Elite
  
  // === UNIQUE WEAPONS ===
  
  // AXES (1-H) - Normal
  'thegnasher': { name: 'The Gnasher', category: 'weapons', subCategory: 'Axe (1-H)', tier: 'normal' },
  'deathspade': { name: 'Deathspade', category: 'weapons', subCategory: 'Axe (1-H)', tier: 'normal' },
  'bladebone': { name: 'Bladebone', category: 'weapons', subCategory: 'Axe (1-H)', tier: 'normal' },
  'skullsplitter': { name: 'Skull Splitter', category: 'weapons', subCategory: 'Axe (1-H)', tier: 'normal' },
  'rakescar': { name: 'Rakescar', category: 'weapons', subCategory: 'Axe (1-H)', tier: 'normal' },
  
  // AXES (1-H) - Exceptional
  'coldkill': { name: 'Coldkill', category: 'weapons', subCategory: 'Axe (1-H)', tier: 'exceptional' },
  'butcherspupil': { name: "Butcher's Pupil", category: 'weapons', subCategory: 'Axe (1-H)', tier: 'exceptional' },
  'islestrike': { name: 'Islestrike', category: 'weapons', subCategory: 'Axe (1-H)', tier: 'exceptional' },
  'pompeiiswrath': { name: "Pompeii's Wrath", category: 'weapons', subCategory: 'Axe (1-H)', tier: 'exceptional' },
  'guardiannaga': { name: 'Guardian Naga', category: 'weapons', subCategory: 'Axe (1-H)', tier: 'exceptional' },
  
  // AXES (1-H) - Elite
  'razorsedge': { name: "Razor's Edge", category: 'weapons', subCategory: 'Axe (1-H)', tier: 'elite' },
  'runemaster': { name: 'Rune Master', category: 'weapons', subCategory: 'Axe (1-H)', tier: 'elite' },
  'cranebeak': { name: 'Cranebeak', category: 'weapons', subCategory: 'Axe (1-H)', tier: 'elite' },
  'deathcleaver': { name: 'Death Cleaver', category: 'weapons', subCategory: 'Axe (1-H)', tier: 'elite' },
  
  // AXES (2-H) - Normal
  'axeoffechmar': { name: 'Axe of Fechmar', category: 'weapons', subCategory: 'Axe (2-H)', tier: 'normal' },
  'goreshovel': { name: 'Goreshovel', category: 'weapons', subCategory: 'Axe (2-H)', tier: 'normal' },
  'thechieftain': { name: 'The Chieftain', category: 'weapons', subCategory: 'Axe (2-H)', tier: 'normal' },
  'brainhew': { name: 'Brainhew', category: 'weapons', subCategory: 'Axe (2-H)', tier: 'normal' },
  'humongous': { name: 'Humongous', category: 'weapons', subCategory: 'Axe (2-H)', tier: 'normal' },
  
  // AXES (2-H) - Exceptional
  'warlordstrust': { name: "Warlord's Trust", category: 'weapons', subCategory: 'Axe (2-H)', tier: 'exceptional' },
  'spellsteel': { name: 'Spellsteel', category: 'weapons', subCategory: 'Axe (2-H)', tier: 'exceptional' },
  'stormrider': { name: 'Stormrider', category: 'weapons', subCategory: 'Axe (2-H)', tier: 'exceptional' },
  'boneslayerblade': { name: 'Boneslayer Blade', category: 'weapons', subCategory: 'Axe (2-H)', tier: 'exceptional' },
  'theminotaur': { name: 'The Minotaur', category: 'weapons', subCategory: 'Axe (2-H)', tier: 'exceptional' },
  
  // AXES (2-H) - Elite
  'etherealedge': { name: 'Ethereal Edge', category: 'weapons', subCategory: 'Axe (2-H)', tier: 'elite' },
  'hellslayer': { name: 'Hellslayer', category: 'weapons', subCategory: 'Axe (2-H)', tier: 'elite' },
  'messerschmidtsreaver': { name: "Messerschmidt's Reaver", category: 'weapons', subCategory: 'Axe (2-H)', tier: 'elite' },
  'executionersjustice': { name: "Executioner's Justice", category: 'weapons', subCategory: 'Axe (2-H)', tier: 'elite' },
  
  // DAGGERS - Normal
  'gull': { name: 'Gull', category: 'weapons', subCategory: 'Dagger', tier: 'normal' },
  'thediggler': { name: 'The Diggler', category: 'weapons', subCategory: 'Dagger', tier: 'normal' },
  'thejadetando': { name: 'The Jade Tan Do', category: 'weapons', subCategory: 'Dagger', tier: 'normal' },
  'spectralshard': { name: 'Spectral Shard', category: 'weapons', subCategory: 'Dagger', tier: 'normal' },
  
  // DAGGERS - Exceptional
  'spineripper': { name: 'Spineripper', category: 'weapons', subCategory: 'Dagger', tier: 'exceptional' },
  'heartcarver': { name: 'Heart Carver', category: 'weapons', subCategory: 'Dagger', tier: 'exceptional' },
  'blackbogssharp': { name: "Blackbog's Sharp", category: 'weapons', subCategory: 'Dagger', tier: 'exceptional' },
  'stormspike': { name: 'Stormspike', category: 'weapons', subCategory: 'Dagger', tier: 'exceptional' },
  
  // DAGGERS - Elite
  'bartucscutthroat': { name: "Bartuc's Cut-Throat", category: 'other', subCategory: 'Claws', tier: 'elite' },
  'bloodmoon': { name: 'Bloodmoon', category: 'weapons', subCategory: 'Dagger', tier: 'elite' },
  'firelizardstalons': { name: "Firelizard's Talons", category: 'other', subCategory: 'Claws', tier: 'elite' },
  'fleshripper': { name: 'Fleshripper', category: 'weapons', subCategory: 'Dagger', tier: 'elite' },
  'ghostflame': { name: 'Ghostflame', category: 'weapons', subCategory: 'Dagger', tier: 'elite' },
  'shadowkiller': { name: 'Shadow Killer', category: 'other', subCategory: 'Claws', tier: 'elite' },
  'wizardspike': { name: 'Wizardspike', category: 'weapons', subCategory: 'Dagger', tier: 'elite' },
  
  // SWORDS (1-H) - Normal
  'rixotskeen': { name: "Rixot's Keen", category: 'weapons', subCategory: 'Sword (1-H)', tier: 'normal' },
  'bloodcrescent': { name: 'Blood Crescent', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'normal' },
  'skewerofkrintiz': { name: 'Skewer of Krintiz', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'normal' },
  'gleamscythe': { name: 'Gleamscythe', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'normal' },
  'griswoldsedge': { name: "Griswold's Edge", category: 'weapons', subCategory: 'Sword (1-H)', tier: 'normal' },
  'hellplague': { name: 'Hellplague', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'normal' },
  'culwenspoint': { name: "Culwen's Point", category: 'weapons', subCategory: 'Sword (1-H)', tier: 'normal' },
  
  // SWORDS (1-H) - Exceptional
  'shadowfang': { name: 'Shadowfang', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'exceptional' },
  'soulflay': { name: 'Soulflay', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'exceptional' },
  'bloodletter': { name: 'Bloodletter', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'exceptional' },
  'coldsteeleye': { name: 'Coldsteel Eye', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'exceptional' },
  'hexfire': { name: 'Hexfire', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'exceptional' },
  'bladeofalibaba': { name: 'Blade of Ali Baba', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'exceptional' },
  'theatlantean': { name: 'The Atlantean', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'exceptional' },
  'crainte': { name: 'Crainte Vomir', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'exceptional' },
  'bingszwang': { name: 'Bing Sz Wang', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'exceptional' },
  'thepatriarch': { name: 'The Patriarch', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'exceptional' },
  
  // SWORDS (1-H) - Elite
  'azurewrath': { name: 'Azurewrath', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'elite' },
  'lightsabre': { name: 'Lightsabre', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'elite' },
  'djinnslayer': { name: 'Djinn Slayer', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'elite' },
  'deathsweb': { name: "Death's Web", category: 'weapons', subCategory: 'Sword (1-H)', tier: 'elite' },
  'thegrandfather': { name: 'The Grandfather', category: 'weapons', subCategory: 'Sword (1-H)', tier: 'elite' },
  
  // SWORDS (2-H) - Normal
  'shadowfang': { name: 'Shadowfang', category: 'weapons', subCategory: 'Sword (2-H)', tier: 'normal' },
  'soulflay': { name: 'Soulflay', category: 'weapons', subCategory: 'Sword (2-H)', tier: 'normal' },
  'kinemilsawl': { name: "Kinemil's Awl", category: 'weapons', subCategory: 'Sword (2-H)', tier: 'normal' },
  'blacktongue': { name: 'Blacktongue', category: 'weapons', subCategory: 'Sword (2-H)', tier: 'normal' },
  'ripsaw': { name: 'Ripsaw', category: 'weapons', subCategory: 'Sword (2-H)', tier: 'normal' },
  'thepatriarch': { name: 'The Patriarch', category: 'weapons', subCategory: 'Sword (2-H)', tier: 'normal' },
  
  // SWORDS (2-H) - Exceptional
  'craintevomir': { name: 'Crainte Vomir', category: 'weapons', subCategory: 'Sword (2-H)', tier: 'exceptional' },
  'bingszwang': { name: 'Bing Sz Wang', category: 'weapons', subCategory: 'Sword (2-H)', tier: 'exceptional' },
  'thevilehusk': { name: 'The Vile Husk', category: 'weapons', subCategory: 'Sword (2-H)', tier: 'exceptional' },
  'cloudcrack': { name: 'Cloudcrack', category: 'weapons', subCategory: 'Sword (2-H)', tier: 'exceptional' },
  'todesfaelleflamme': { name: 'Todesfaelle Flamme', category: 'weapons', subCategory: 'Sword (2-H)', tier: 'exceptional' },
  'swordguard': { name: 'Swordguard', category: 'weapons', subCategory: 'Sword (2-H)', tier: 'exceptional' },
  
  // SWORDS (2-H) - Elite
  'flamebellow': { name: 'Flamebellow', category: 'weapons', subCategory: 'Sword (2-H)', tier: 'elite' },
  'doombringer': { name: 'Doombringer', category: 'weapons', subCategory: 'Sword (2-H)', tier: 'elite' },
  'thegrandfather2h': { name: 'The Grandfather', category: 'weapons', subCategory: 'Sword (2-H)', tier: 'elite' },
  
  // BOWS - Normal
  'pluckeye': { name: 'Pluckeye', category: 'weapons', subCategory: 'Bow', tier: 'normal' },
  'witherstring': { name: 'Witherstring', category: 'weapons', subCategory: 'Bow', tier: 'normal' },
  'ravenclaw': { name: 'Raven Claw', category: 'weapons', subCategory: 'Bow', tier: 'normal' },
  'roguesbow': { name: "Rogue's Bow", category: 'weapons', subCategory: 'Bow', tier: 'normal' },
  'stormstrike': { name: 'Stormstrike', category: 'weapons', subCategory: 'Bow', tier: 'normal' },
  'wizendraw': { name: 'Wizendraw', category: 'weapons', subCategory: 'Bow', tier: 'normal' },
  'hellclap': { name: 'Hellclap', category: 'weapons', subCategory: 'Bow', tier: 'normal' },
  'blastbark': { name: 'Blastbark', category: 'weapons', subCategory: 'Bow', tier: 'normal' },
  
  // BOWS - Exceptional
  'skystrike': { name: 'Skystrike', category: 'weapons', subCategory: 'Bow', tier: 'exceptional' },
  'riphook': { name: 'Riphook', category: 'weapons', subCategory: 'Bow', tier: 'exceptional' },
  'kukoshakaku': { name: 'Kuko Shakaku', category: 'weapons', subCategory: 'Bow', tier: 'exceptional' },
  'endlesshail': { name: 'Endlesshail', category: 'weapons', subCategory: 'Bow', tier: 'exceptional' },
  'witchwildstring': { name: 'Witchwild String', category: 'weapons', subCategory: 'Bow', tier: 'exceptional' },
  'cliffkiller': { name: 'Cliffkiller', category: 'weapons', subCategory: 'Bow', tier: 'exceptional' },
  'magewrath': { name: 'Magewrath', category: 'weapons', subCategory: 'Bow', tier: 'exceptional' },
  'goldstrikearch': { name: 'Goldstrike Arch', category: 'weapons', subCategory: 'Bow', tier: 'exceptional' },
  
  // BOWS - Elite
  'widowmaker': { name: 'Widowmaker', category: 'weapons', subCategory: 'Bow', tier: 'elite' },
  'eaglehorn': { name: 'Eaglehorn', category: 'weapons', subCategory: 'Bow', tier: 'elite' },
  'windforce': { name: 'Windforce', category: 'weapons', subCategory: 'Bow', tier: 'elite' },
  
  // CROSSBOWS - Normal
  'leadcrow': { name: 'Leadcrow', category: 'weapons', subCategory: 'Crossbow', tier: 'normal' },
  'ichorsting': { name: 'Ichorsting', category: 'weapons', subCategory: 'Crossbow', tier: 'normal' },
  'hellcast': { name: 'Hellcast', category: 'weapons', subCategory: 'Crossbow', tier: 'normal' },
  'doomslinger': { name: 'Doomslinger', category: 'weapons', subCategory: 'Crossbow', tier: 'normal' },
  
  // CROSSBOWS - Exceptional
  'langerbriser': { name: 'Langer Briser', category: 'weapons', subCategory: 'Crossbow', tier: 'exceptional' },
  'pusspitter': { name: 'Pus Spitter', category: 'weapons', subCategory: 'Crossbow', tier: 'exceptional' },
  'burizadokyanon': { name: 'Buriza-Do Kyanon', category: 'weapons', subCategory: 'Crossbow', tier: 'exceptional' },
  'demonmachine': { name: 'Demon Machine', category: 'weapons', subCategory: 'Crossbow', tier: 'exceptional' },
  
  // CROSSBOWS - Elite
  'gutsiphon': { name: 'Gut Siphon', category: 'weapons', subCategory: 'Crossbow', tier: 'elite' },
  'hellrack': { name: 'Hellrack', category: 'weapons', subCategory: 'Crossbow', tier: 'elite' },
  
  // CLUBS (1-H) - Normal
  'felloak': { name: 'Felloak', category: 'weapons', subCategory: 'Club (1-H)', tier: 'normal' },
  'stoutnail': { name: 'Stoutnail', category: 'weapons', subCategory: 'Club (1-H)', tier: 'normal' },
  'crushflange': { name: 'Crushflange', category: 'weapons', subCategory: 'Club (1-H)', tier: 'normal' },
  'bloodrise': { name: 'Bloodrise', category: 'weapons', subCategory: 'Club (1-H)', tier: 'normal' },
  'thegeneralstandoliga': { name: "The General's Tan Do Li Ga", category: 'weapons', subCategory: 'Club (1-H)', tier: 'normal' },
  'ironstone': { name: 'Ironstone', category: 'weapons', subCategory: 'Club (1-H)', tier: 'normal' },
  
  // CLUBS (1-H) - Exceptional
  'darkclancrusher': { name: 'Dark Clan Crusher', category: 'weapons', subCategory: 'Club (1-H)', tier: 'exceptional' },
  'fleshrender': { name: 'Fleshrender', category: 'weapons', subCategory: 'Club (1-H)', tier: 'exceptional' },
  'sureshrillfrost': { name: 'Sureshrill Frost', category: 'weapons', subCategory: 'Club (1-H)', tier: 'exceptional' },
  'moonfall': { name: 'Moonfall', category: 'weapons', subCategory: 'Club (1-H)', tier: 'exceptional' },
  'baezilsvortex': { name: "Baezil's Vortex", category: 'weapons', subCategory: 'Club (1-H)', tier: 'exceptional' },
  'earthshaker': { name: 'Earthshaker', category: 'weapons', subCategory: 'Club (1-H)', tier: 'exceptional' },
  
  // CLUBS (1-H) - Elite
  'nordstenderizer': { name: "Nord's Tenderizer", category: 'weapons', subCategory: 'Club (1-H)', tier: 'elite' },
  'baranarsstar': { name: "Baranar's Star", category: 'weapons', subCategory: 'Club (1-H)', tier: 'elite' },
  'demonlimb': { name: 'Demon Limb', category: 'weapons', subCategory: 'Club (1-H)', tier: 'elite' },
  'stormlash': { name: 'Stormlash', category: 'weapons', subCategory: 'Club (1-H)', tier: 'elite' },
  'horizonstornado': { name: "Horizon's Tornado", category: 'weapons', subCategory: 'Club (1-H)', tier: 'elite' },
  'stonecrusher': { name: 'Stone Crusher', category: 'weapons', subCategory: 'Club (1-H)', tier: 'elite' },
  'schaefershammer': { name: "Schaefer's Hammer", category: 'weapons', subCategory: 'Club (1-H)', tier: 'elite' },
  
  // CLUBS (2-H) - Normal
  'bonesnap': { name: 'Bonesnap', category: 'weapons', subCategory: 'Club (2-H)', tier: 'normal' },
  'steeldriver': { name: 'Steeldriver', category: 'weapons', subCategory: 'Club (2-H)', tier: 'normal' },
  
  // CLUBS (2-H) - Exceptional
  'bloodtreestump': { name: 'Bloodtree Stump', category: 'weapons', subCategory: 'Club (2-H)', tier: 'exceptional' },
  'thegavelofpain': { name: 'The Gavel of Pain', category: 'weapons', subCategory: 'Club (2-H)', tier: 'exceptional' },
  
  // CLUBS (2-H) - Elite
  'windhammer': { name: 'Windhammer', category: 'weapons', subCategory: 'Club (2-H)', tier: 'elite' },
  'earthshifter': { name: 'Earth Shifter', category: 'weapons', subCategory: 'Club (2-H)', tier: 'elite' },
  'thecraniumbasher': { name: 'The Cranium Basher', category: 'weapons', subCategory: 'Club (2-H)', tier: 'elite' },
  
  // POLEARMS - Normal
  'dimoakshew': { name: "Dimoak's Hew", category: 'weapons', subCategory: 'Polearm', tier: 'normal' },
  'steelgoad': { name: 'Steelgoad', category: 'weapons', subCategory: 'Polearm', tier: 'normal' },
  'soulharvest': { name: 'Soul Harvest', category: 'weapons', subCategory: 'Polearm', tier: 'normal' },
  'thebattlebranch': { name: 'The Battlebranch', category: 'weapons', subCategory: 'Polearm', tier: 'normal' },
  'woestave': { name: 'Woestave', category: 'weapons', subCategory: 'Polearm', tier: 'normal' },
  'thegrimreaper': { name: 'The Grim Reaper', category: 'weapons', subCategory: 'Polearm', tier: 'normal' },
  
  // POLEARMS - Exceptional
  'themeatscraper': { name: 'The Meat Scraper', category: 'weapons', subCategory: 'Polearm', tier: 'exceptional' },
  'blackleachblade': { name: 'Blackleach Blade', category: 'weapons', subCategory: 'Polearm', tier: 'exceptional' },
  'athenaswrath': { name: "Athena's Wrath", category: 'weapons', subCategory: 'Polearm', tier: 'exceptional' },
  'pierretombalecouant': { name: 'Pierre Tombale Couant', category: 'weapons', subCategory: 'Polearm', tier: 'exceptional' },
  'husoldalevo': { name: 'Husoldal Evo', category: 'weapons', subCategory: 'Polearm', tier: 'exceptional' },
  'grimsburningdead': { name: "Grim's Burning Dead", category: 'weapons', subCategory: 'Polearm', tier: 'exceptional' },
  
  // POLEARMS - Elite
  'bonehew': { name: 'Bonehew', category: 'weapons', subCategory: 'Polearm', tier: 'elite' },
  'thereaperstoll': { name: "The Reaper's Toll", category: 'weapons', subCategory: 'Polearm', tier: 'elite' },
  'tombreaver': { name: 'Tomb Reaver', category: 'weapons', subCategory: 'Polearm', tier: 'elite' },
  'stormspire': { name: 'Stormspire', category: 'weapons', subCategory: 'Polearm', tier: 'elite' },
  
  // SPEARS - Normal
  'thedragonchang': { name: 'The Dragon Chang', category: 'weapons', subCategory: 'Spear', tier: 'normal' },
  'razortine': { name: 'Razortine', category: 'weapons', subCategory: 'Spear', tier: 'normal' },
  'bloodthief': { name: 'Bloodthief', category: 'weapons', subCategory: 'Spear', tier: 'normal' },
  'lanceofyaggai': { name: 'Lance of Yaggai', category: 'weapons', subCategory: 'Spear', tier: 'normal' },
  'thetannrgorerod': { name: 'The Tannr Gorerod', category: 'weapons', subCategory: 'Spear', tier: 'normal' },
  
  // SPEARS - Exceptional
  'theimpaler': { name: 'The Impaler', category: 'weapons', subCategory: 'Spear', tier: 'exceptional' },
  'kelpiesnare': { name: 'Kelpie Snare', category: 'weapons', subCategory: 'Spear', tier: 'exceptional' },
  'soulfeasttine': { name: 'Soulfeast Tine', category: 'weapons', subCategory: 'Spear', tier: 'exceptional' },
  'honesundan': { name: 'Hone Sundan', category: 'weapons', subCategory: 'Spear', tier: 'exceptional' },
  'spireofhonor': { name: 'Spire of Honor', category: 'weapons', subCategory: 'Spear', tier: 'exceptional' },
  
  // SPEARS - Elite
  'ariocsneedle': { name: "Arioc's Needle", category: 'weapons', subCategory: 'Spear', tier: 'elite' },
  'steelpillar': { name: 'Steel Pillar', category: 'weapons', subCategory: 'Spear', tier: 'elite' },
  'viperfork': { name: 'Viperfork', category: 'weapons', subCategory: 'Spear', tier: 'elite' },
  
  // JAVELINS - Elite (Amazon-specific throwing weapons) - Moved to Other category per user request
  'bloodravenscharge': { name: "Blood Raven's Charge", category: 'other', subCategory: 'Javelins', tier: 'elite' },
  'lycandersaim': { name: "Lycander's Aim", category: 'other', subCategory: 'Javelins', tier: 'elite' },
  'lycandersflank': { name: "Lycander's Flank", category: 'other', subCategory: 'Javelins', tier: 'elite' },
  'titansrevenge': { name: "Titan's Revenge", category: 'other', subCategory: 'Javelins', tier: 'elite' },
  
  // SCEPTERS - Normal
  'knellstriker': { name: 'Knell Striker', category: 'weapons', subCategory: 'Scepter', tier: 'normal' },
  'rusthandle': { name: 'Rusthandle', category: 'weapons', subCategory: 'Scepter', tier: 'normal' },
  'stormeye': { name: 'Stormeye', category: 'weapons', subCategory: 'Scepter', tier: 'normal' },
  
  // SCEPTERS - Exceptional
  'zakarumshand': { name: "Zakarum's Hand", category: 'weapons', subCategory: 'Scepter', tier: 'exceptional' },
  'thefetidsprinkler': { name: 'The Fetid Sprinkler', category: 'weapons', subCategory: 'Scepter', tier: 'exceptional' },
  'handofblessedlight': { name: 'Hand of Blessed Light', category: 'weapons', subCategory: 'Scepter', tier: 'exceptional' },
  
  // SCEPTERS - Elite
  'astreonsironward': { name: "Astreon's Iron Ward", category: 'weapons', subCategory: 'Scepter', tier: 'elite' },
  'heavenslight': { name: "Heaven's Light", category: 'weapons', subCategory: 'Scepter', tier: 'elite' },
  'theredeemer': { name: 'The Redeemer', category: 'weapons', subCategory: 'Scepter', tier: 'elite' },
  
  // STAVES - Normal
  'baneash': { name: 'Bane Ash', category: 'weapons', subCategory: 'Staff', tier: 'normal' },
  'serpentlord': { name: 'Serpent Lord', category: 'weapons', subCategory: 'Staff', tier: 'normal' },
  'spireoflazarus': { name: 'Spire of Lazarus', category: 'weapons', subCategory: 'Staff', tier: 'normal' },
  'thesalamander': { name: 'The Salamander', category: 'weapons', subCategory: 'Staff', tier: 'normal' },
  'theironjangbong': { name: 'The Iron Jang Bong', category: 'weapons', subCategory: 'Staff', tier: 'normal' },
  
  // STAVES - Exceptional
  'razorswitch': { name: 'Razorswitch', category: 'weapons', subCategory: 'Staff', tier: 'exceptional' },
  'ribcracker': { name: 'Ribcracker', category: 'weapons', subCategory: 'Staff', tier: 'exceptional' },
  'chromaticire': { name: 'Chromatic Ire', category: 'weapons', subCategory: 'Staff', tier: 'exceptional' },
  'warpspear': { name: 'Warpspear', category: 'weapons', subCategory: 'Staff', tier: 'exceptional' },
  'skullcollector': { name: 'Skull Collector', category: 'weapons', subCategory: 'Staff', tier: 'exceptional' },
  
  // STAVES - Elite
  'mangsongslesson': { name: "Mang Song's Lesson", category: 'weapons', subCategory: 'Staff', tier: 'elite' },
  'ondalswisdom': { name: "Ondal's Wisdom", category: 'weapons', subCategory: 'Staff', tier: 'elite' },
  
  // ORBS - Elite (Sorceress-specific weapons) - Moved to Other category per user request
  'deathsfathom': { name: "Death's Fathom", category: 'other', subCategory: 'Class Orbs', tier: 'elite' },
  'eschutastemper': { name: "Eschuta's Temper", category: 'other', subCategory: 'Class Orbs', tier: 'elite' },
  'theoculus': { name: 'The Oculus', category: 'other', subCategory: 'Class Orbs', tier: 'elite' },
  
  // WANDS - Normal
  'torchofiro': { name: 'Torch of Iro', category: 'weapons', subCategory: 'Wand', tier: 'normal' },
  'maelstrom': { name: 'Maelstrom', category: 'weapons', subCategory: 'Wand', tier: 'normal' },
  'gravenspine': { name: 'Gravenspine', category: 'weapons', subCategory: 'Wand', tier: 'normal' },
  'umeslament': { name: "Ume's Lament", category: 'weapons', subCategory: 'Wand', tier: 'normal' },
  
  // WANDS - Exceptional
  'suicidebranch': { name: 'Suicide Branch', category: 'weapons', subCategory: 'Wand', tier: 'exceptional' },
  'carinshard': { name: 'Carin Shard', category: 'weapons', subCategory: 'Wand', tier: 'exceptional' },
  'armofkingleoric': { name: 'Arm of King Leoric', category: 'weapons', subCategory: 'Wand', tier: 'exceptional' },
  'blackhandkey': { name: 'Blackhand Key', category: 'weapons', subCategory: 'Wand', tier: 'exceptional' },
  
  // WANDS - Elite
  'boneshade': { name: 'Boneshade', category: 'weapons', subCategory: 'Wand', tier: 'elite' },
  'deathswebwand': { name: "Death's Web", category: 'weapons', subCategory: 'Wand', tier: 'elite' },
  
  // THROWING - Exceptional
  'deathbit': { name: 'Deathbit', category: 'weapons', subCategory: 'Throwing', tier: 'exceptional' },
  'thescalper': { name: 'The Scalper', category: 'weapons', subCategory: 'Throwing', tier: 'exceptional' },
  
  // THROWING - Elite
  'gimmershred': { name: 'Gimmershred', category: 'weapons', subCategory: 'Throwing', tier: 'elite' },
  'lacerator': { name: 'Lacerator', category: 'weapons', subCategory: 'Throwing', tier: 'elite' },
  'warshrike': { name: 'Warshrike', category: 'weapons', subCategory: 'Throwing', tier: 'elite' },
  'demonsarch': { name: "Demon's Arch", category: 'weapons', subCategory: 'Throwing', tier: 'elite' },
  'wraithflight': { name: 'Wraith Flight', category: 'weapons', subCategory: 'Throwing', tier: 'elite' },
  'gargoylesbite': { name: "Gargoyle's Bite", category: 'weapons', subCategory: 'Throwing', tier: 'elite' },
  
  // === JEWELRY & OTHER ===
  'nagelring': { name: 'Nagelring', category: 'other', subCategory: 'Rings', tier: 'normal' },
  'manaldheal': { name: 'Manald Heal', category: 'other', subCategory: 'Rings', tier: 'normal' },
  'stoneofjordan': { name: 'Stone of Jordan', category: 'other', subCategory: 'Rings', tier: 'normal' },
  'dwarfstar': { name: 'Dwarf Star', category: 'other', subCategory: 'Rings', tier: 'normal' },
  'ravenfrost': { name: 'Raven Frost', category: 'other', subCategory: 'Rings', tier: 'normal' },
  'bulkathosw': { name: "Bul-Kathos' Wedding Band", category: 'other', subCategory: 'Rings', tier: 'normal' },
  'carrionwind': { name: 'Carrion Wind', category: 'other', subCategory: 'Rings', tier: 'normal' },
  'naturespeace': { name: "Nature's Peace", category: 'other', subCategory: 'Rings', tier: 'normal' },
  'wispprojector': { name: 'Wisp Projector', category: 'other', subCategory: 'Rings', tier: 'normal' },
  
  // AMULETS
  'nokozanrelic': { name: 'Nokozan Relic', category: 'other', subCategory: 'Amulets', tier: 'normal' },
  'theeyeofetlich': { name: 'The Eye of Etlich', category: 'other', subCategory: 'Amulets', tier: 'normal' },
  'themahimoakcurio': { name: 'The Mahim-Oak Curio', category: 'other', subCategory: 'Amulets', tier: 'normal' },
  'saracenschance': { name: "Saracen's Chance", category: 'other', subCategory: 'Amulets', tier: 'normal' },
  'thecatseye': { name: "The Cat's Eye", category: 'other', subCategory: 'Amulets', tier: 'normal' },
  'therisingsun': { name: 'The Rising Sun', category: 'other', subCategory: 'Amulets', tier: 'normal' },
  'crescentmoon': { name: 'Crescent Moon', category: 'other', subCategory: 'Amulets', tier: 'normal' },
  'atmasscarab': { name: "Atma's Scarab", category: 'other', subCategory: 'Amulets', tier: 'normal' },
  'highlordswrath': { name: "Highlord's Wrath", category: 'other', subCategory: 'Amulets', tier: 'normal' },
  'maraskaleidoscope': { name: "Mara's Kaleidoscope", category: 'other', subCategory: 'Amulets', tier: 'normal' },
  'seraphshymn': { name: "Seraph's Hymn", category: 'other', subCategory: 'Amulets', tier: 'normal' },
  'metalgrid': { name: 'Metalgrid', category: 'other', subCategory: 'Amulets', tier: 'normal' },
  
  // CHARMS
  'annihilus': { name: 'Annihilus', category: 'other', subCategory: 'Charms', tier: 'normal' },
  'gheedsfortune': { name: "Gheed's Fortune", category: 'other', subCategory: 'Charms', tier: 'normal' },
  'hellfiretorch': { name: 'Hellfire Torch', category: 'other', subCategory: 'Charms', tier: 'normal' },
  
  // RAINBOW FACETS (8 total - 2 for each element)
  'rainbowfacetcoldlevelup': { name: 'Rainbow Facet (Cold - Level Up)', category: 'other', subCategory: 'Jewels', tier: 'normal' },
  'rainbowfacetcolddeath': { name: 'Rainbow Facet (Cold - Death)', category: 'other', subCategory: 'Jewels', tier: 'normal' },
  'rainbowfacetfirelevelup': { name: 'Rainbow Facet (Fire - Level Up)', category: 'other', subCategory: 'Jewels', tier: 'normal' },
  'rainbowfacetfiredeath': { name: 'Rainbow Facet (Fire - Death)', category: 'other', subCategory: 'Jewels', tier: 'normal' },
  'rainbowfacetlightninglevelup': { name: 'Rainbow Facet (Lightning - Level Up)', category: 'other', subCategory: 'Jewels', tier: 'normal' },
  'rainbowfacetlightningdeath': { name: 'Rainbow Facet (Lightning - Death)', category: 'other', subCategory: 'Jewels', tier: 'normal' },
  'rainbowfacetpoisonlevelup': { name: 'Rainbow Facet (Poison - Level Up)', category: 'other', subCategory: 'Jewels', tier: 'normal' },
  'rainbowfacetpoisondeath': { name: 'Rainbow Facet (Poison - Death)', category: 'other', subCategory: 'Jewels', tier: 'normal' },
}

// Item code to internal key mapping - maps save file item codes to our clean keys
export const itemCodeToKey: Record<string, string> = {
  // UNIQUE ARMOR - CHEST
  'Greyform': 'greyform',
  'Blinkbat\'s Form': 'blinkbatsform',
  'The Centurion': 'thecenturion',
  'Twitchthroe': 'twitchthroe',
  'Darkglow': 'darkglow',
  'Hawkmail': 'hawkmail',
  'Venom Ward': 'venomward',
  'Sparking Mail': 'sparkingmail',
  'Iceblink': 'iceblink',
  'Heavenly Garb': 'heavenlygarb',
  'Rockfleece': 'rockfleece',
  'Boneflesh': 'boneflesh',
  'Rattlecage': 'rattlecage',
  'Goldskin': 'goldskin',
  'Silks of the Victor': 'silksofthevictor',
  'The Spirit Shroud': 'thespiritshroud',
  'Skin of the Vipermagi': 'skinofthevipermagi',
  'Skin of the Flayed One': 'skinoftheflayedone',
  'Iron Pelt': 'ironpelt',
  'Crow Caw': 'crowcaw',
  'Spirit Forge': 'spiritforge',
  'Duriel\'s Shell': 'durielsshell',
  'Shaftstop': 'shaftstop',
  'Skullder\'s Ire': 'skullders',
  'Que-Hegan\'s Wisdom': 'quehegansw',
  'Toothrow': 'toothrow',
  'Guardian Angel': 'guardianangel',
  'Atma\'s Wail': 'atmaswail',
  'Black Hades': 'blackhades',
  'Corpsemourn': 'corpsemourn',
  'Ormus\' Robes': 'ormusrobes',
  'The Gladiator\'s Bane': 'gladiatorsbane',
  'Arkaine\'s Valor': 'arkainesvalor',
  'Leviathan': 'leviathan',
  'Steel Carapace': 'steelcarapace',
  'Templar\'s Might': 'templarsmight',
  'Tyrael\'s Might': 'tyraelsmight',
  
  // UNIQUE ARMOR - HELMS
  'Biggin\'s Bonnet': 'bigginsb',
  'Tarnhelm': 'tarnhelm',
  'Coif of Glory': 'coifofglory',
  'Duskdeep': 'duskdeep',
  'Wormskull': 'wormskull',
  'Howltusk': 'howltusk',
  'Undead Crown': 'undeadcrown',
  'The Face of Horror': 'faceofhorror',
  'Peasant Crown': 'peasantcrown',
  'Rockstopper': 'rockstopper',
  'Stealskull': 'stealskull',
  'Darksight Helm': 'darksighthelm',
  'Vampire Gaze': 'vampiregaze',
  'Valkyrie Wing': 'valkyriewing',
  'Crown of Thieves': 'crownofthieves',
  'Blackhorn\'s Face': 'blackhornsface',
  'Andariel\'s Visage': 'andarielsvisage',
  'Arreat\'s Face': 'arreatsface',
  'Crown of Ages': 'crownofages',
  'Demonhorn\'s Edge': 'demonhornsedge',
  'Giant Skull': 'giantskull',
  'Halaberd\'s Reign': 'halaberdreign',
  'Harlequin Crest': 'harlequincrest',
  'Nightwing\'s Veil': 'nightwingsveil',
  'Ravenlore': 'ravenlore',
  'Spirit Keeper': 'spiritkeeper',
  'Steel Shade': 'steelshade',
  'Veil of Steel': 'veilofsteel',
  'Wolfhowl': 'wolfhowl',
  
  // CIRCLETS
  'Kira\'s Guardian': 'kirasguardian',
  'Griffon\'s Eye': 'griffonseye',
  
  // GLOVES
  'The Hand of Broc': 'thehandofbroc',
  'Bloodfist': 'bloodfist',
  'Chance Guards': 'chanceguards',
  'Magefist': 'magefist',
  'Frostburn': 'frostburn',
  'Venom Grip': 'venomgrip',
  'Gravepalm': 'gravepalm',
  'Ghoulhide': 'ghoulhide',
  'Lava Gout': 'lavagout',
  'Hellmouth': 'hellmouth',
  'Dracul\'s Grasp': 'draculsgrasp',
  'Soul Drainer': 'souldrainer',
  'Steelrend': 'steelrend',
  
  // BELTS
  'Lenymo': 'lenymo',
  'Snakecord': 'snakecord',
  'Nightsmoke': 'nightsmoke',
  'Goldwrap': 'goldwrap',
  'Bladebuckle': 'bladebuckle',
  'String of Ears': 'stringofears',
  'Razortail': 'razortail',
  'Gloom\'s Trap': 'gloomstrap',
  'Snowclash': 'snowclash',
  'Thundergod\'s Vigor': 'thundergodsvigor',
  'Arachnid Mesh': 'arachnidmesh',
  'Nosferatu\'s Coil': 'nosferatuscoil',
  'Verdungo\'s Hearty Cord': 'verdungosheartycord',
  
  // BOOTS
  'Hotspur': 'hotspur',
  'Gorefoot': 'gorefoot',
  'Treads of Cthon': 'treadsofcthon',
  'Goblin Toe': 'goblintoe',
  'Tearhaunch': 'tearhaunch',
  'Infernostride': 'infernostride',
  'Waterwalk': 'waterwalk',
  'Silkweave': 'silkweave',
  'War Traveler': 'wartraveler',
  'Gore Rider': 'gorerider',
  'Marrowwalk': 'marrowwalk',
  'Sandstorm Trek': 'sandstormtrek',
  'Shadow Dancer': 'shadowdancer',
  
  // SHIELDS
  'Pelta Lunata': 'peltalunata',
  'Umbral Disk': 'umbraldisk',
  'Stormguild': 'stormguild',
  'Swordback Hold': 'swordbackhold',
  'Steelclash': 'steelclash',
  'Wall of the Eyeless': 'walloftheeyeless',
  'Bverrit Keep': 'bverritkeep',
  'The Ward': 'theward',
  'Visceratuant': 'visceratuant',
  'Moser\'s Blessed Circle': 'mosersblessedcircle',
  'Stormchaser': 'stormchaser',
  'Lance Guard': 'lanceguard',
  'Tiamat\'s Rebuke': 'tiamatsrebuke',
  'Lidless Wall': 'lidlesswall',
  'Gerke\'s Sanctuary': 'gerkessanctuary',
  'Radament\'s Sphere': 'radamentssphere',
  'Alma Negra': 'almanega',
  'Blackoak Shield': 'blackoakshield',
  'Boneflame': 'boneflame',
  'Darkforce Spawn': 'darkforcespawn',
  'Dragonscale': 'dragonscale',
  'Head Hunter\'s Glory': 'headhuntersglory',
  'Homunculus': 'homunculus',
  'Medusa\'s Gaze': 'medusasgaze',
  'Spike Thorn': 'spikethorn',
  'Spirit Ward': 'spiritward',
  'Stoneraven': 'stoneraven',
  'Stormshield': 'stormshield',
  
  // PALADIN SHIELDS
  
  // WEAPONS - AXES (1-H)
  'The Gnasher': 'thegnasher',
  'Deathspade': 'deathspade',
  'Bladebone': 'bladebone',
  'Skull Splitter': 'skullsplitter',
  'Rakescar': 'rakescar',
  'Coldkill': 'coldkill',
  'Butcher\'s Pupil': 'butcherspupil',
  'Islestrike': 'islestrike',
  'Pompeii\'s Wrath': 'pompeiiswrath',
  'Guardian Naga': 'guardiannaga',
  'Razor\'s Edge': 'razorsedge',
  'Rune Master': 'runemaster',
  'Cranebeak': 'cranebeak',
  'Death Cleaver': 'deathcleaver',
  
  // WEAPONS - AXES (2-H)
  'Axe of Fechmar': 'axeoffechmar',
  'Goreshovel': 'goreshovel',
  'The Chieftain': 'thechieftain',
  'Brainhew': 'brainhew',
  'Humongous': 'humongous',
  'Warlord\'s Trust': 'warlordstrust',
  'Spellsteel': 'spellsteel',
  'Stormrider': 'stormrider',
  'Boneslayer Blade': 'boneslayerblade',
  'The Minotaur': 'theminotaur',
  'Ethereal Edge': 'etherealedge',
  'Hellslayer': 'hellslayer',
  'Messerschmidt\'s Reaver': 'messerschmidtsreaver',
  'Executioner\'s Justice': 'executionersjustice',
  
  // WEAPONS - DAGGERS
  'Gull': 'gull',
  'The Diggler': 'thediggler',
  'The Jade Tan Do': 'thejadetando',
  'Spectral Shard': 'spectralshard',
  'Spineripper': 'spineripper',
  'Heart Carver': 'heartcarver',
  'Blackbog\'s Sharp': 'blackbogssharp',
  'Stormspike': 'stormspike',
  'Bartuc\'s Cut-Throat': 'bartucscutthroat',
  'Bloodmoon': 'bloodmoon',
  'Firelizard\'s Talons': 'firelizardstalons',
  'Fleshripper': 'fleshripper',
  'Ghostflame': 'ghostflame',
  'Shadow Killer': 'shadowkiller',
  'Wizardspike': 'wizardspike',
  
  // WEAPONS - SWORDS (1-H)
  'Rixot\'s Keen': 'rixotskeen',
  'Blood Crescent': 'bloodcrescent',
  'Skewer of Krintiz': 'skewerofkrintiz',
  'Gleamscythe': 'gleamscythe',
  'Griswold\'s Edge': 'griswoldsedge',
  'Hellplague': 'hellplague',
  'Culwen\'s Point': 'culwenspoint',
  'Shadowfang': 'shadowfang',
  'Soulflay': 'soulflay',
  'Bloodletter': 'bloodletter',
  'Coldsteel Eye': 'coldsteeleye',
  'Hexfire': 'hexfire',
  'Blade of Ali Baba': 'bladeofalibaba',
  'The Atlantean': 'theatlantean',
  'Crainte Vomir': 'crainte',
  'Bing Sz Wang': 'bingszwang',
  'The Patriarch': 'thepatriarch',
  'Azurewrath': 'azurewrath',
  'Lightsabre': 'lightsabre',
  'Djinn Slayer': 'djinnslayer',
  'Death\'s Web': 'deathsweb',
  'The Grandfather': 'thegrandfather',
  
  // WEAPONS - SWORDS (2-H)
  'Shadowfang': 'shadowfang',
  'Soulflay': 'soulflay',
  'Kinemil\'s Awl': 'kinemilsawl',
  'Blacktongue': 'blacktongue',
  'Ripsaw': 'ripsaw',
  'The Patriarch': 'thepatriarch',
  'Crainte Vomir': 'craintevomir',
  'Bing Sz Wang': 'bingszwang',
  'The Vile Husk': 'thevilehusk',
  'Cloudcrack': 'cloudcrack',
  'Todesfaelle Flamme': 'todesfaelleflamme',
  'Swordguard': 'swordguard',
  'Flamebellow': 'flamebellow',
  'Doombringer': 'doombringer',
  
  // WEAPONS - BOWS
  'Pluckeye': 'pluckeye',
  'Witherstring': 'witherstring',
  'Raven Claw': 'ravenclaw',
  'Rogue\'s Bow': 'roguesbow',
  'Stormstrike': 'stormstrike',
  'Wizendraw': 'wizendraw',
  'Hellclap': 'hellclap',
  'Blastbark': 'blastbark',
  'Skystrike': 'skystrike',
  'Riphook': 'riphook',
  'Kuko Shakaku': 'kukoshakaku',
  'Endlesshail': 'endlesshail',
  'Witchwild String': 'witchwildstring',
  'Cliffkiller': 'cliffkiller',
  'Magewrath': 'magewrath',
  'Goldstrike Arch': 'goldstrikearch',
  'Widowmaker': 'widowmaker',
  'Eaglehorn': 'eaglehorn',
  'Windforce': 'windforce',
  
  // WEAPONS - CROSSBOWS
  'Leadcrow': 'leadcrow',
  'Ichorsting': 'ichorsting',
  'Hellcast': 'hellcast',
  'Doomslinger': 'doomslinger',
  'Langer Briser': 'langerbriser',
  'Pus Spitter': 'pusspitter',
  'Buriza-Do Kyanon': 'burizadokyanon',
  'Demon Machine': 'demonmachine',
  'Gut Siphon': 'gutsiphon',
  'Hellrack': 'hellrack',
  
  // WEAPONS - CLUBS (1-H)
  'Felloak': 'felloak',
  'Stoutnail': 'stoutnail',
  'Crushflange': 'crushflange',
  'Bloodrise': 'bloodrise',
  'The General\'s Tan Do Li Ga': 'thegeneralstandoliga',
  'Ironstone': 'ironstone',
  'Dark Clan Crusher': 'darkclancrusher',
  'Fleshrender': 'fleshrender',
  'Sureshrill Frost': 'sureshrillfrost',
  'Moonfall': 'moonfall',
  'Baezil\'s Vortex': 'baezilsvortex',
  'Earthshaker': 'earthshaker',
  'Nord\'s Tenderizer': 'nordstenderizer',
  'Baranar\'s Star': 'baranarsstar',
  'Demon Limb': 'demonlimb',
  'Stormlash': 'stormlash',
  'Horizon\'s Tornado': 'horizonstornado',
  'Stone Crusher': 'stonecrusher',
  'Schaefer\'s Hammer': 'schaefershammer',
  
  // WEAPONS - CLUBS (2-H)
  'Bonesnap': 'bonesnap',
  'Steeldriver': 'steeldriver',
  'Bloodtree Stump': 'bloodtreestump',
  'The Gavel of Pain': 'thegavelofpain',
  'Windhammer': 'windhammer',
  'Earth Shifter': 'earthshifter',
  'The Cranium Basher': 'thecraniumbasher',
  
  // WEAPONS - POLEARMS
  'Dimoak\'s Hew': 'dimoakshew',
  'Steelgoad': 'steelgoad',
  'Soul Harvest': 'soulharvest',
  'The Battlebranch': 'thebattlebranch',
  'Woestave': 'woestave',
  'The Grim Reaper': 'thegrimreaper',
  'The Meat Scraper': 'themeatscraper',
  'Blackleach Blade': 'blackleachblade',
  'Athena\'s Wrath': 'athenaswrath',
  'Pierre Tombale Couant': 'pierretombalecouant',
  'Husoldal Evo': 'husoldalevo',
  'Grim\'s Burning Dead': 'grimsburningdead',
  'Bonehew': 'bonehew',
  'The Reaper\'s Toll': 'thereaperstoll',
  'Tomb Reaver': 'tombreaver',
  'Stormspire': 'stormspire',
  
  // WEAPONS - SPEARS
  'The Dragon Chang': 'thedragonchang',
  'Razortine': 'razortine',
  'Bloodthief': 'bloodthief',
  'Lance of Yaggai': 'lanceofyaggai',
  'The Tannr Gorerod': 'thetannrgorerod',
  'The Impaler': 'theimpaler',
  'Kelpie Snare': 'kelpiesnare',
  'Soulfeast Tine': 'soulfeasttine',
  'Hone Sundan': 'honesundan',
  'Spire of Honor': 'spireofhonor',
  'Arioc\'s Needle': 'ariocsneedle',
  'Steel Pillar': 'steelpillar',
  'Viperfork': 'viperfork',
  
  // JAVELINS
  'Blood Raven\'s Charge': 'bloodravenscharge',
  'Lycander\'s Aim': 'lycandersaim',
  'Lycander\'s Flank': 'lycandersflank',
  'Titan\'s Revenge': 'titansrevenge',
  
  // WEAPONS - SCEPTERS
  'Knell Striker': 'knellstriker',
  'Rusthandle': 'rusthandle',
  'Stormeye': 'stormeye',
  'Zakarum\'s Hand': 'zakarumshand',
  'The Fetid Sprinkler': 'thefetidsprinkler',
  'Hand of Blessed Light': 'handofblessedlight',
  'Astreon\'s Iron Ward': 'astreonsironward',
  'Heaven\'s Light': 'heavenslight',
  'The Redeemer': 'theredeemer',
  
  // WEAPONS - STAVES
  'Bane Ash': 'baneash',
  'Serpent Lord': 'serpentlord',
  'Spire of Lazarus': 'spireoflazarus',
  'The Salamander': 'thesalamander',
  'The Iron Jang Bong': 'theironjangbong',
  'Razorswitch': 'razorswitch',
  'Ribcracker': 'ribcracker',
  'Chromatic Ire': 'chromaticire',
  'Warpspear': 'warpspear',
  'Skull Collector': 'skullcollector',
  'Mang Song\'s Lesson': 'mangsongslesson',
  'Ondal\'s Wisdom': 'ondalswisdom',
  
  // ORBS
  'Death\'s Fathom': 'deathsfathom',
  'Eschuta\'s Temper': 'eschutastemper',
  'The Oculus': 'theoculus',
  
  // WEAPONS - WANDS
  'Torch of Iro': 'torchofiro',
  'Maelstrom': 'maelstrom',
  'Gravenspine': 'gravenspine',
  'Ume\'s Lament': 'umeslament',
  'Suicide Branch': 'suicidebranch',
  'Carin Shard': 'carinshard',
  'Arm of King Leoric': 'armofkingleoric',
  'Blackhand Key': 'blackhandkey',
  'Boneshade': 'boneshade',
  'Death\'s Web': 'deathswebwand',
  
  // WEAPONS - THROWING
  'Deathbit': 'deathbit',
  'The Scalper': 'thescalper',
  'Gimmershred': 'gimmershred',
  'Lacerator': 'lacerator',
  'Warshrike': 'warshrike',
  'Demon\'s Arch': 'demonsarch',
  'Wraith Flight': 'wraithflight',
  'Gargoyle\'s Bite': 'gargoylesbite',
  
  // JEWELRY - RINGS
  'Nagelring': 'nagelring',
  'Manald Heal': 'manaldheal',
  'Stone of Jordan': 'stoneofjordan',
  'Dwarf Star': 'dwarfstar',
  'Raven Frost': 'ravenfrost',
  'Bul-Kathos\' Wedding Band': 'bulkathosw',
  'Carrion Wind': 'carrionwind',
  'Nature\'s Peace': 'naturespeace',
  'Wisp Projector': 'wispprojector',
  
  // JEWELRY - AMULETS
  'Nokozan Relic': 'nokozanrelic',
  'The Eye of Etlich': 'theeyeofetlich',
  'The Mahim-Oak Curio': 'themahimoakcurio',
  'Saracen\'s Chance': 'saracenschance',
  'The Cat\'s Eye': 'thecatseye',
  'The Rising Sun': 'therisingsun',
  'Crescent Moon': 'crescentmoon',
  'Atma\'s Scarab': 'atmasscarab',
  'Highlord\'s Wrath': 'highlordswrath',
  'Mara\'s Kaleidoscope': 'maraskaleidoscope',
  'Seraph\'s Hymn': 'seraphshymn',
  'Metalgrid': 'metalgrid',
  
  // CHARMS
  'Annihilus': 'annihilus',
  'Gheed\'s Fortune': 'gheedsfortune',
  'Hellfire Torch': 'hellfiretorch',
  
  // RAINBOW FACETS
  'Rainbow Facet (Cold - Level Up)': 'rainbowfacetcoldlevelup',
  'Rainbow Facet (Cold - Death)': 'rainbowfacetcolddeath',
  'Rainbow Facet (Fire - Level Up)': 'rainbowfacetfirelevelup',
  'Rainbow Facet (Fire - Death)': 'rainbowfacetfiredeath',
  'Rainbow Facet (Lightning - Level Up)': 'rainbowfacetlightninglevelup',
  'Rainbow Facet (Lightning - Death)': 'rainbowfacetlightningdeath',
  'Rainbow Facet (Poison - Level Up)': 'rainbowfacetpoisonlevelup',
  'Rainbow Facet (Poison - Death)': 'rainbowfacetpoisondeath',
}

// Helper function to get item info by key
export function getItemInfo(key: string): ItemInfo | null {
  // Try direct lookup first
  if (itemMappings[key]) {
    return itemMappings[key]
  }
  
  // Try code mapping
  const mappedKey = itemCodeToKey[key.toLowerCase()]
  if (mappedKey && itemMappings[mappedKey]) {
    return itemMappings[mappedKey]
  }
  
  return null
}

// Helper function to categorize items
export function categorizeItem(key: string, isEthereal: boolean = false): {
  category: string
  subCategory: string  
  tier: string
  displayName: string
} {
  const itemInfo = getItemInfo(key)
  
  if (itemInfo) {
    // Try to get display name from desktop client mapping first
    let displayName = itemInfo.name
    if (silospenMapping[key.toLowerCase()]) {
      displayName = silospenMapping[key.toLowerCase()]
    }
    
    return {
      category: isEthereal ? `eth${itemInfo.category}` : itemInfo.category,
      subCategory: itemInfo.subCategory,
      tier: itemInfo.tier,
      displayName: isEthereal ? `${displayName} (Ethereal)` : displayName
    }
  }
  
  // Enhanced fallback for unknown items - try to categorize by name patterns
  const keyLower = key.toLowerCase()
  let cleanedName = cleanItemName(key)
  
  // Try to get display name from desktop client mapping
  if (silospenMapping[keyLower]) {
    cleanedName = silospenMapping[keyLower]
  }
  
  // Check for armor patterns
  if (keyLower.includes('helm') || keyLower.includes('cap') || keyLower.includes('crown') || 
      keyLower.includes('circlet') || keyLower.includes('mask') || keyLower.includes('visage')) {
    return {
      category: isEthereal ? 'etharmor' : 'armor',
      subCategory: 'Helms',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  if (keyLower.includes('armor') || keyLower.includes('mail') || keyLower.includes('plate') || 
      keyLower.includes('robe') || keyLower.includes('garb') || keyLower.includes('shell') ||
      keyLower.includes('flesh') || keyLower.includes('cage') || keyLower.includes('skin')) {
    return {
      category: isEthereal ? 'etharmor' : 'armor',
      subCategory: 'Chest',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  if (keyLower.includes('glove') || keyLower.includes('gauntlet') || keyLower.includes('fist') ||
      keyLower.includes('grasp') || keyLower.includes('hand')) {
    return {
      category: isEthereal ? 'etharmor' : 'armor',
      subCategory: 'Gloves',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  if (keyLower.includes('belt') || keyLower.includes('cord') || keyLower.includes('sash') ||
      keyLower.includes('wrap') || keyLower.includes('coil')) {
    return {
      category: isEthereal ? 'etharmor' : 'armor',
      subCategory: 'Belts',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  if (keyLower.includes('boot') || keyLower.includes('greave') || keyLower.includes('trek') ||
      keyLower.includes('foot') || keyLower.includes('stride')) {
    return {
      category: isEthereal ? 'etharmor' : 'armor',
      subCategory: 'Boots',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  if (keyLower.includes('shield') || keyLower.includes('buckler') || keyLower.includes('ward')) {
    return {
      category: isEthereal ? 'etharmor' : 'armor',
      subCategory: 'Shields',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  // Check for weapon patterns
  if (keyLower.includes('sword') || keyLower.includes('blade') || keyLower.includes('saber') ||
      keyLower.includes('scimitar') || keyLower.includes('falchion') || keyLower.includes('scythe') ||
      keyLower.includes('keen') || keyLower.includes('crescent') || keyLower.includes('edge') ||
      keyLower.includes('fang') || keyLower.includes('bane') || keyLower.includes('point') ||
      keyLower.includes('sabre') || keyLower.includes('plague') || keyLower.includes('slayer') ||
      keyLower.includes('ripper') || keyLower.includes('cutter')) {
    return {
      category: isEthereal ? 'ethweapons' : 'weapons',
      subCategory: 'Swords',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  if (keyLower.includes('axe') || keyLower.includes('cleaver') || keyLower.includes('hatchet')) {
    return {
      category: isEthereal ? 'ethweapons' : 'weapons',
      subCategory: 'Axes',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  if (keyLower.includes('mace') || keyLower.includes('club') || keyLower.includes('hammer') ||
      keyLower.includes('maul') || keyLower.includes('scepter')) {
    return {
      category: isEthereal ? 'ethweapons' : 'weapons',
      subCategory: 'Maces',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  if (keyLower.includes('bow') || keyLower.includes('crossbow')) {
    return {
      category: isEthereal ? 'ethweapons' : 'weapons',
      subCategory: keyLower.includes('crossbow') ? 'Crossbows' : 'Bows',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  if (keyLower.includes('spear') || keyLower.includes('lance') || keyLower.includes('pike') ||
      keyLower.includes('javelin') || keyLower.includes('pilum')) {
    return {
      category: isEthereal ? 'ethweapons' : 'weapons',
      subCategory: 'Spears',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  if (keyLower.includes('staff') || keyLower.includes('wand') || keyLower.includes('orb')) {
    return {
      category: isEthereal ? 'ethweapons' : 'weapons',
      subCategory: keyLower.includes('wand') ? 'Wands' : keyLower.includes('orb') ? 'Orbs' : 'Staves',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  if (keyLower.includes('dagger') || keyLower.includes('dirk') || keyLower.includes('kris')) {
    return {
      category: isEthereal ? 'ethweapons' : 'weapons',
      subCategory: 'Daggers',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  // Check for jewelry patterns
  if (keyLower.includes('ring')) {
    return {
      category: isEthereal ? 'ethother' : 'other',
      subCategory: 'Rings',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  if (keyLower.includes('amulet')) {
    return {
      category: isEthereal ? 'ethother' : 'other',
      subCategory: 'Amulets',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  if (keyLower.includes('charm')) {
    return {
      category: isEthereal ? 'ethother' : 'other',
      subCategory: 'Charms',
      tier: 'normal',
      displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
    }
  }
  
  // Default fallback for truly unknown items
  return {
    category: isEthereal ? 'ethother' : 'other',
    subCategory: 'Unknown',
    tier: 'normal',
    displayName: isEthereal ? `${cleanedName} (Ethereal)` : cleanedName
  }
}

// Helper to clean up item names (like the desktop client)
export function cleanItemName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .replace(/([a-z])'([A-Z])/g, '$1\'$2')
    .replace(/\bOf\b/g, 'of')
    .replace(/\bThe\b/g, 'the')
    .replace(/\bAnd\b/g, 'and')
    .trim()
}