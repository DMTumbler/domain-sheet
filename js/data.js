const UNIT_TABLE = [
    {name: 'Militia', m: 1, w: 0, s: 0},
    {name: 'Levies', m: 1, w: 0, s: 0},
    {name: 'Rangers', m: 1, w: 1, s: 0},
    {name: 'Gadaal Scouts', m: 1, w: 1, s: 1},
    {name: 'Slingers', m: 1, w: 1, s: 0},
    {name: 'Archers', m: 1, w: 1, s: 0},
    {name: 'Longbowmen', m: 2, w: 1, s: 1},
    {name: 'Crossbowmen', m: 1, w: 1, s: 0},
    {name: 'Light Cavalry', m: 2, w: 2, s: 0},
    {name: 'Heavy Cavalry', m: 2, w: 3, s: 0},
    {name: 'Horse Archers', m: 2, w: 2, s: 0},
    {name: 'Mounted Knights', m: 3, w: 4, s: 1},
    {name: 'Light Infantry', m: 1, w: 1, s: 0},
    {name: 'Pikemen', m: 2, w: 1, s: 0},
    {name: 'Eirengarder Pike', m: 2, w: 1, s: 1},
    {name: 'Heavy Infantry', m: 2, w: 2, s: 0},
    {name: 'Skandr Reavers', m: 2, w: 2, s: 0},
    {name: 'Foot Knights', m: 3, w: 3, s: 1},
    {name: 'Warrior Monks', m: 3, w: 0, s: 2},
    {name: 'Kueh Samurai', m: 3, w: 3, s: 2},
    {name: 'Dwarf Crossbows', m: 2, w: 1, s: 1},
    {name: 'Dwarf Sappers', m: 2, w: 1, s: 2},
    {name: 'Dwarf Warriors', m: 2, w: 1, s: 1},
    {name: 'Dwarf Heroes', m: 3, w: 3, s: 2},
    {name: 'Elf Bowmen', m: 1, w: 1, s: 2},
    {name: 'Elf War Mages', m: 2, w: 1, s: 2},
    {name: 'Elf Warriors', m: 2, w: 2, s: 2},
    {name: 'Elf Zealots', m: 4, w: 2, s: 3},
    {name: 'Halfling Militia', m: 0, w: 1, s: 1},
    {name: 'Halfling Pikemen', m: 1, w: 1, s: 2},
    {name: 'Halfling Slingers', m: 0, w: 1, s: 1},
    {name: 'Ballista', m: 2, w: 2, s: 0},
    {name: 'Catapult', m: 2, w: 3, s: 0},
    {name: 'Trebuchet', m: 2, w: 4, s: 0},
    {name: 'Sailing Ship', m: 3, w: 5, s: 0},
    {name: 'Skandr Longship', m: 3, w: 3, s: 1},
    {name: 'Transport Ship', m: 2, w: 4, s: 0},
    {name: 'War Galley', m: 3, w: 4, s: 0},
    {name: 'Barrier', m: 0, w: 2, s: 0},
    {name: 'Tower', m: 1, w: 4, s: 0},
    {name: 'Citadel', m: 3, w: 6, s: 0},
    {name: 'Harbor Chain', m: 0, w: 2, s: 0}
];

function unitOptions(selected) {
    let out = '<option value="__custom"' + (selected === '__custom' || !selected ? ' selected' : '') + '>— Custom —</option>';
    UNIT_TABLE.forEach(function (u) {
        out += '<option value="' + u.name + '"' + (selected === u.name ? ' selected' : '') + '>' + u.name + '</option>';
    });
    return out;
}

const ASSET_TABLE = [
    {name: 'School', m: 0, w: 2, s: 0, type: 'School 1'},
    {name: 'Academy', m: 0, w: 4, s: -1, type: 'School 2'},
    {name: 'Great Academy', m: 0, w: 8, s: -2, type: 'School 3'},
    {name: 'Barracks', m: 2, w: 0, s: 0, type: 'Barracks 1'},
    {name: 'Training Grounds', m: 4, w: -1, s: 0, type: 'Barracks 2'},
    {name: 'War Academy', m: 8, w: -1, s: -1, type: 'Barracks 3'},
    {name: 'Brutal Tyranny', m: 4, w: 0, s: 0, type: 'Custom'},
    {name: 'Burning Creed', m: 0, w: 0, s: 4, type: 'Custom'},
    {name: 'Democratic Traditions', m: 0, w: 2, s: 2, type: 'Custom'},
    {name: 'Devil Worshippers', m: 4, w: 4, s: 0, type: 'Custom'},
    {name: 'Dwarf Friend', m: 0, w: 4, s: 0, type: 'Custom'},
    {name: 'Halfling Affinity', m: 0, w: 2, s: 2, type: 'Custom'},
    {name: 'Mercantile', m: 0, w: 4, s: 0, type: 'Custom'},
    {name: 'Religious Fervor', m: 0, w: 0, s: 4, type: 'Custom'},
    {name: 'Slavery', m: 0, w: 4, s: -2, type: 'Custom'},
    {name: 'Spartan Culture', m: 4, w: 0, s: 0, type: 'Custom'},
    {name: 'Well-Educated', m: 0, w: 2, s: 2, type: 'Custom'},
    {name: 'Palisade', m: 2, w: 0, s: 0, type: 'Fortifications 1'},
    {name: 'Wall', m: 4, w: -1, s: 0, type: 'Fortifications 2'},
    {name: 'Layered Walls', m: 8, w: -2, s: 0, type: 'Fortifications 3'},
    {name: 'Market', m: 0, w: 2, s: 0, type: 'Market 1'},
    {name: 'Trade Center', m: -1, w: 4, s: 0, type: 'Market 2'},
    {name: 'Mercantile Guilds', m: -1, w: 8, s: -1, type: 'Market 3'},
    {name: 'Militia Muster', m: 1, w: 0, s: 0, type: 'Militia 1'},
    {name: 'Organized Militia', m: 2, w: -1, s: 0, type: 'Militia 2'},
    {name: 'Veteran Guard', m: 4, w: -2, s: 0, type: 'Militia 3'},
    {name: 'Shrine', m: 0, w: 0, s: 2, type: 'Temple 1'},
    {name: 'Temple', m: 0, w: -1, s: 4, type: 'Temple 2'},
    {name: 'Great Temple', m: 0, w: -2, s: 8, type: 'Temple 3'},
    {name: 'Community Aid', m: 0, w: 0, s: 0, type: 'No Type'},
    {name: 'Hell Shrine', m: 2, w: 4, s: 2, type: 'No Type'},
    {name: 'Military Spending', m: 0, w: 0, s: 0, type: 'No Type'},
    {name: 'Necromantic Cult', m: 0, w: 0, s: -2, type: 'No Type'},
    {name: 'Processing Camp', m: 0, w: 2, s: 0, type: 'No Type'},
    {name: 'Resource Extractor', m: 0, w: 2, s: 0, type: 'No Type'},
    {name: 'Siege Supplies', m: -2, w: 0, s: 0, type: 'No Type'},
    {name: 'United Efforts', m: 0, w: 0, s: 0, type: 'No Type'}
];

function assetOptions(selected) {
    let out = '<option value="__custom"' + (selected === '__custom' || !selected ? ' selected' : '') + '>— Custom —</option>';
    ASSET_TABLE.forEach(function (a) {
        out += '<option value="' + a.name + '"' + (selected === a.name ? ' selected' : '') + '>' + a.name + ' (' + a.type + ')</option>';
    });
    return out;
}

const OBSTACLE_TABLE = [
    {name: 'Ancient Curse', value: 'Wealth', save: 'Ignorance'},
    {name: 'Angry Dead', value: 'Military', save: 'Uprising'},
    {name: 'Bad Feng Shui', value: 'Wealth', save: 'Ignorance'},
    {name: 'Bad Reputation', value: 'Social', save: 'Corruption'},
    {name: 'Barren Surroundings', value: 'Wealth', save: 'Poverty'},
    {name: 'Class Hatred', value: 'Social', save: 'Despair'},
    {name: 'Conquering Heirs', value: 'Military', save: 'Uprising'},
    {name: 'Contaminated Land', value: 'Wealth', save: 'Poverty'},
    {name: 'Corrupt Leadership', value: 'Social', save: 'Corruption'},
    {name: 'Covetous Polity', value: 'Military', save: 'Disorder'},
    {name: 'Crushed Spirits', value: 'Social', save: 'Despair'},
    {name: 'Dark Wizards', value: 'Military', save: 'Uprising'},
    {name: 'Demagogue', value: 'Social', save: 'Despair'},
    {name: 'Destructive Customs', value: 'Wealth', save: 'Ignorance'},
    {name: 'Disputed Possession', value: 'Military', save: 'Uprising'},
    {name: 'Disunity', value: 'Social', save: 'Despair'},
    {name: 'Ethnic Feuding', value: 'Social', save: 'Despair'},
    {name: 'Exceptional Poverty', value: 'Wealth', save: 'Poverty'},
    {name: 'Exiled Lord', value: 'Military', save: 'Uprising'},
    {name: 'Failed Settlement', value: 'Wealth', save: 'Poverty'},
    {name: 'Flooding', value: 'Wealth', save: 'Poverty'},
    {name: 'Harsh Conditions', value: 'Wealth', save: 'Poverty'},
    {name: 'Hazardous Resource', value: 'Wealth', save: 'Ignorance'},
    {name: 'Human Raiders', value: 'Military', save: 'Disorder'},
    {name: 'Inaccessible', value: 'Wealth', save: 'Poverty'},
    {name: 'Mercenary Populace', value: 'Social', save: 'Corruption'},
    {name: 'Monsters', value: 'Military', save: 'Disorder'},
    {name: 'Murderous Heirs', value: 'Military', save: 'Uprising'},
    {name: 'No Workers', value: 'Wealth', save: 'Poverty'},
    {name: 'Pervasive Hunger', value: 'Wealth', save: 'Poverty'},
    {name: 'Recalcitrant Locals', value: 'Military', save: 'Disorder'},
    {name: 'Recurrent Sickness', value: 'Wealth', save: 'Ignorance'},
    {name: 'Relic Golems', value: 'Wealth', save: 'Ignorance'},
    {name: 'Riotous Thugs', value: 'Military', save: 'Disorder'},
    {name: 'Secret Society', value: 'Social', save: 'Corruption'},
    {name: 'Severe Damage', value: 'Wealth', save: 'Poverty'},
    {name: 'Shou Raiders', value: 'Military', save: 'Uprising'},
    {name: 'Sinister Cult', value: 'Social', save: 'Corruption'},
    {name: 'Taboo Land', value: 'Wealth', save: 'Ignorance'},
    {name: 'Things From Below', value: 'Military', save: 'Disorder'},
    {name: 'Tide Cult', value: 'Military', save: 'Disorder'},
    {name: 'Tidespawn', value: 'Military', save: 'Uprising'},
    {name: 'Toxic Process', value: 'Wealth', save: 'Ignorance'},
    {name: 'Undeveloped', value: 'Wealth', save: 'Poverty'},
    {name: 'Wasted Production', value: 'Wealth', save: 'Ignorance'},
    {name: 'Xenophobia', value: 'Military', save: 'Disorder'}
];
const SAVE_UNIT = {
    'Uprising': 'Any military unit', 'Disorder': 'Guardsman',
    'Poverty': 'Merchant', 'Ignorance': 'Sage',
    'Despair': 'Prophet', 'Corruption': 'Magistrate'
};
const UNIT_OPTS_FOR_OBSTACLE = ['Matched (correct unit)', 'Correct value, wrong unit quality', 'Wrong value and wrong unit'];

function obstacleOptions(selected) {
    let out = '<option value="__custom"' + (selected === '__custom' || !selected ? ' selected' : '') + '>— Custom —</option>';
    OBSTACLE_TABLE.forEach(function (o) {
        out += '<option value="' + o.name + '"' + (selected === o.name ? ' selected' : '') + '>' + o.name + ' (' + o.value + '/' + o.save + ')</option>';
    });
    return out;
}

const DOMAIN_ACTIONS = [
    {
        name: 'Accumulate Treasure',
        what: 'Convert your domain\'s wealth into spendable Treasure points.',
        how: 'Roll a Wealth check vs DC 8 + Treasure you already have.'
    },
    {
        name: 'Attack a Location',
        what: 'Send your forces to seize a location by force.',
        how: 'Resolved with mass combat rules.'
    },
    {
        name: 'Disband an Asset',
        what: 'Tear down or dismiss an asset you no longer want or can\'t afford.',
        how: 'No roll — just remove it. Use this when upkeep is over budget.'
    },
    {
        name: 'Establish an Asset',
        what: 'Build a new building, unit, or custom at a location you hold.',
        how: '3 checks (Military, Wealth, Social), each vs DC 12 + the asset\'s value in that stat.'
    },
    {
        name: 'Establish / Erase a Location',
        what: 'Formally mark a new site as a location, or raze one you hold.',
        how: 'No roll for a scratch-built site with no M/W/S value; GM adjudicates anything bigger.'
    },
    {
        name: 'Move an Asset',
        what: 'Relocate a military unit to a new location.',
        how: 'Moves up to its normal overland movement. Buildings can\'t be moved.'
    },
    {
        name: 'Punish Atrocity',
        what: 'Publicly blame a scapegoat to burn off accumulated Atrocity.',
        how: 'Requires a Scapegoat asset first. DC 5 + current Atrocity; removes 1d4+2.'
    },
    {
        name: 'Rectify Disruption',
        what: 'Calm down a shaken asset or unit so it reliably follows orders again.',
        how: 'Removes 1d4+2 Disruption, split across one or more assets as you choose.'
    },
    {
        name: 'Repair an Asset',
        what: 'Heal damage on a wounded asset or unit.',
        how: 'Heals HP up to your current Military value. Scarce/Rare assets cost more HP to heal.'
    },
    {
        name: 'Solve an Obstacle',
        what: 'Send a unit or agent to overcome what\'s blocking a location.',
        how: 'Save vs the Obstacle: d20 + value mod − Obstacle level (×2/×3 penalty if wrong unit/value) vs DC 12.'
    },
    {
        name: 'Withdraw Treasure',
        what: 'Cash out Treasure points into hard coin.',
        how: '1st point = 500gp × Wealth; each further point spent the same action costs one more Treasure than the last.'
    }
];
