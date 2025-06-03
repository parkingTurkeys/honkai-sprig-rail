/*

Madam Herta is a peerless gem
Madam Herta is an unrivalled genius
Madam Herta is an *inimitable* beauty

@title: hsr-battle
@author: me
@tags: []
@addedOn: 2025-00-00

!Warning => unfinished and broken!!!!
(it breaks after 4 turns, only has single target attack, and doesn't even use RES and RES PEN and healers overall and also baaaaaaasically any stat that isnt shown in the preview)

move targets with J and L
Skill is I, Basic Attack is K


*/
//load enemies and characters
let characters;
let playerTurnOn = false; 
const characterLoad = ["m7", "tb", "dh", "lr"]
let dmgcalc;
let msg = "press I for skill"

// levels at randomy (i took a secondary/ 4 star signature lc) enhanced bc i dont feel like thinking about ~~stigmata~~ relics and lcs :) , traces up to char ascension 3, lvl 50/50, E6
characters = [
  {
    info:  {level: 50, name:"Stelle", id:"tb", type:"phys", path:"dest", pathName: "The Destruction", enemy: false},
    stats: {HP: 1311, ATK: 667, DEF: 482, SPD: 100, CRITrate: 0.50, CRITdmg: 0.80, baseAction: 100},
    temp:  {HP: 1311, buffs: [], action: 100, energy: 0, debuffs: [], aggro:5},
    attacks: {
      basic: {target:"single", energy: 20, toughness: 10, dmg: 0.7, sp: 1, name: "Farewell Hit"},
      skill: {target:"blast", energy: 30, toughness: [10, 20, 10], dmg: 0.8125, sp: -1, name: "RIP Home Run"},
      ult:   {target:"enhance", cost: 120, energy: -120, name: "Stardust Ace", eval:"characters[0].temp.action = 0"},
      enhancedBasic: {target:"single", energy: 5, toughness: 30, dmg: 3.45, name: "Blowout: Farewell Hit"},
      enhancedSkill: {target:"blast", energy: 5, toughness: [10,20,10], dmg: [1.242, 2.07, 1.242], name: "Blowout: RIP Home Run"},
      talent: {trigger:"self-break-weakness", buff: {type:"atk", effect:1.13, max: 2}}
    }, x:0
      },
  {
    info:  {name:"March 7th", id:"m7", type:"ice", path:"pres", pathName: "The Preservation", enemy: false},
    stats: {HP: 1204, ATK: 537, DEF: 625, SPD: 101, CRITrate: 0.30, CRITdmg: 0.40, dotsMax: 2, baseAction: 99.0099009901},
    temp:  {HP: 1204, buffs: [], action: 99.0099009901, dots: 2, energy: 0, debuffs: [], aggro:6},
    attacks: {
      basic: {target:"single", dots:1, energy:20, toughness:10, dmg: 0.8, sp: 1, name: "Frigid Cold Arrow"},
      skill: {target:"ally", dots:1, energy:30, buff: {type:"shield", effect:10, duration:3}, name:"The Power of Cuteness"},
      ult:   {target:"aoe", cost:120, energy:-115, toughness: 20, dmg: 1.08, debuff:{chance: 0.50, duration: 1, canAct:false, dot: "0.39 * characters[1].stats.ATK"}, name: "Glacial Cascade", dmgDistribution: [0.25,0.25,0.25,0.25]},
      talent:{trigger: "shield-attacked", type:"counter", dots: -1, target:"counter", dmg: 0.65, name: "Girl Power"}
    }, x:3
      },
  {
    info:  {name:"Asta", id:"lr", type:"fire", path:"harm", pathName: "The Harmony", enemy: false},
    stats: {HP: 1259, ATK: 567, DEF: 483, SPD: 106, CRITrate: 0.30, CRITdmg: 0.40, dotsMax: 5, baseAction: 94.3396226415},
    temp:  {HP: 1259, buffs: [], action: 94.3396226415, dots: 0, energy: 0, debuffs: [], aggro:4},
    attacks: {
      basic: {target:"single", dots:1, eval: "if (enemies.target.weaknesses.includes('fire')) {characters[2].temp.dots++}", energy:20, toughness:10, dmg: 0.7, sp: 1, name: "Spectrum Beam"},
      skill: {target:"bounce", dots: 5 - Math.round(Math.random()), energy:30, toughness: [10,5,5,5,5], name:"Meteor Storm", dmg:0.325},
      ult:   {target:"team", cost:120, energy:-115, name: "Astral Blessing", buff: {target:"team", duration: 2, type: "speed", effect:"0.402"}},
      talent:{trigger: "247", type:"dots", buff: {target:"team", duration:"action", type:"atk", effect: 0}}
    }, x:6
      },
  {
    info:  {name:"Dan Heng", id:"dh", type:"wind", path:"hunt", pathName: "The Hunt", enemy: false},
    stats: {HP: 1108, ATK: 620, DEF: 442, SPD: 110, CRITrate: 0.55, CRITdmg: 0.8, baseAction: 90.9090909091},
    temp:  {HP: 1108, buffs: [], action: 90.9090909091, energy: 0, debuffs: [], aggro:3},
    attacks: {
      basic: {target:"single",energy:20, toughness:10, dmg: 0.7, sp: 1, name: "Cloudlancer Art: North Wind", dmgDistribution: [0.45, 0.55]},
      skill: {target:"single", sp: -1, energy:30, toughness: 20, name:"Cloudlancer Art: Torrent", dmg:1.69, debuff: {chance:0.55, type:"speed", effect: 0.12}},
      ult:   {target:"single", cost:100, energy:-95, name: "Ethereal Dream", dmg:2.88},
      talent:{/*haha no*/}
    }, x:9
      }
]
characters[1].attacks.skill.buff.effect = 0.45125 * characters[1].stats.DEF+475
characters[2].attacks.talent.buff.effect = characters[2].temp.dots*0.091

let sp = 3;

let enemies = [
  {
    info: {name: "flamespawn", type: "fire", id: "FS", enemy: true, index:0},
    stats: {HP:1235, ATK: 234, DEF: 700, SPD:83, toughness: 10},
    weaknesses: ["phys", "ice", "wind"],
    temp: {HP:1235, buffs: [], action: 120.481927711, toughness: 10},
    attacks: {default: {energy:10, target: "single", dmg: 2.5, name:"Distract"}},
    attackOrder: ["default"], index:0
  },
  {
    info: {name: "Incineration Shadewalker", type: "fire", id: "IS", enemy: true, index:1},
    stats: {HP:4795, ATK: 276, DEF: 740, SPD: 100, toughness: 20},
    weaknesses: ["ice", "wind", "imag"],
    temp: {HP:4795, buffs:[], action: 100, toughness: 20},
    attacks: {default: {energy:15, target: "single", dmg:3.0}},
    attackOrder: ["default"], index:0
  },
  {
    info: {name: "flamespawn", type: "fire", id: "FS", enemy: true}, index:2,
    stats: {HP:1235, ATK: 234, DEF: 700, SPD:83, toughness: 10},
    weaknesses: ["phys", "ice", "wind"],
    temp: {HP:1235, buffs: [], action: 120.481927711, toughness: 10},
    attacks: {default: {energy:10, target: "single", dmg: 2.5, name:"Distract"}},
    attackOrder: ["default"], index:0
  }
]


const herta = "h"
const stelle = "s"
const m7 = "7"
const asta = "a"
const cardbg = "_"
const danheng = "C"
const selectult = "o"
const skill = "O"
const basic = "0"
const ult = "-"
const flamespawn = "F"
const enemySelect = "@"
const active = "/"  
const incinerationShadewalker = "I"


setLegend(
  [active, bitmap`
................
................
................
................
................
................
................
................
................
................
.............6..
............6.6.
.............6..
...9............
..9.9...........
6669666666666666`],
  [ 
  herta, bitmap`
................
................
......CL.0......
.....CCC900C9...
.....LCCFCC0C9C.
....2CLCCHLHHHC.
...02C9HHHH80H0.
...H02200H86HHC.
....H22HL8666HHH
....222HLHH68HH.
.....222122H8L.H
.....222222HH0..
....2...22CCH...
.....CCCCCCCHH..
.....CCCC0CCCHH.
....CC200C2C2...`],
  [stelle, bitmap`
................
........11......
.....1111111L...
....112L1121L2..
..11122L111L12..
..1122LLLLL211..
.1.100022000211.
..1126122612211.
..118F622F62211.
..1182222221111.
..1.182222111.11
111.18222111..11
11..1.2222.1.11.
.1..12222222211.
.1..2222222222..
1..222222222222.`],
  [m7, bitmap`
................
................
......8..888....
.88..88882888...
.8888.88888288..
.8888828888288..
.8..80028800888.
...888H0828H828.
...8.2722227888.
...8822222228.88
...88.2222228.88
....8.222222888.
...888.LLLL.8.88
..8.882L2L222.8.
...88.L222L228..
....8222222L222.`],
  [asta, bitmap`
................
........8.......
......88888.....
...8888888888...
...888298828888.
...8882888822888
..8888229822288.
..8888222227788.
..8286277222788.
..8268827222288.
.882888222222888
.88988822222.888
.889888222....88
88.998822222...8
8.89982222222...
.88.822222222...`],
  [danheng, bitmap`
....0...........
.....0..........
.....0..0.......
....0000000.....
...00000000.....
..00000000000...
..0020000000000.
..0002202200000.
...0022222222D..
..002D22D222D...
...222222222D...
....22222222....
....2222222.....
.......22.......
................
................`],
  [enemySelect, bitmap`
......4.4444.444
...............4
...............4
................
...............4
...............4
4..............4
...............4
4...............
4..............4
4...............
4...............
................
4...............
4...............
444.4444.4......`],
  [selectult, bitmap`
................
....44444444....
...44......44...
..6..........4..
.646.........44.
.46...........4.
.4............4.
.4...........64.
.4..........6.6.
.4...........64.
.4............4.
.44..........44.
..4..........4..
...44...6..44...
....44464644....
........6.......`],
  [skill, bitmap`
................
....00000000....
...0000000808...
.8808222228080..
800082228282800.
800282822282800.
.80288228282800.
.08282828282800.
.08282828282800.
880282828282800.
.00222222222200.
.00022222222000.
..000222222000..
...0000000000...
....00000000....
................`],
  [basic, bitmap`
................
....00000000....
...0000000000...
..000222222000..
.00022222222000.
.08822282282280.
.00282888282800.
.08882282288200.
.80282282288200.
.08882282282800.
.00222222222200.
.00022222222000.
..000222222000..
...0000000000...
....00000000....
................`],
  [ult, bitmap`
................
....HHH88883....
...HH22222233...
..H22211112223..
.552111LL111233.
.5221LLLLLL1229.
.5211L0000L1129.
.521LL0..0LL129.
.521LL0..0LL129.
.7211L0000L1129.
.7221LL0LLL1229.
.77211LLL111266.
..722211112226..
...7722222266...
....44444466....
................`],
  [cardbg, bitmap`
LLLLLLLLLL1LLLLL
LLLLLLLLLLL1L1LL
LLLL1LL0LLLLL1LL
LLLLL5LLLLLL0LLL
LL1LLLLLLLLLLLLL
LLLLLLL1LLLLLL3L
LL0LL0LLLLLLLL01
LLLLLLLLLL1L3LLL
LLLL1L00LLLLLLLL
LLLLLLLLLLLLLL1L
LLLLLLLLL1LLLLLL
LLL1L5LLLLLLLL5L
L0LLLLL1L1LL1LLL
LLLLLLL0LLLLLLLL
L1LLLLLLLLLLLLLL
LLLLL0LLLLLL1LLL`],
  [incinerationShadewalker, bitmap`
..9C9.99CC9.....
...9C9CCCC9.....
...9C0CCC9......
.0000CCC99......
00009CCCCC9.....
00990CCCCC9.....
.00990CC999.....
.00..000CCC9....
....999LCCC9....
....9CCLCCC.....
....9C9LCCC.....
....9C90CCC0....
...9CC9LLC900...
....99..9CC900..
........9CC9....
.........99.....`],
  [flamespawn, bitmap`
.........7......
..........6.....
.3..9...7..6....
.CC.9.....99.C88
.CCC99...699CC88
.CCC89....98C888
3CCC8.33..98CC8.
3C3C88339888C3..
..33833333883...
...C3C3.3933....
.....33..333....
.....333333.....
......3333......
......333.3.....
.......33.......
........33......`]
)

setSolids([])

let level = 0
const levels = [
  map`
..........
..........
..........
.@........
..........
..........
_.._.._.._
_.._.._.._`
]

setMap(levels[level])

onInput("w", () => {
  //select ult
})

onInput("a", () => {
  getFirst("o").x -= 1;
})

onInput("s", () => {
  //
})

onInput("d", () => {
  getFirst("o").x += 1;
})

onInput("i", () => {
  //console.log(tilesWith("@")[0][tilesWith("@")[0].length - 1].type)
  if (playerTurnOn) {
    switch (getFirst("@").x) {
      case 2:
        playerAttack(player, true, 0)
        break;
      case 4:
        playerAttack(player, true, 1)
        break;
    }
  }
})

onInput("j", () => {
  getFirst("@").x -= 1;
})

onInput("k", () => {
  if (playerTurnOn) {
    //console.log("basic attack")
    switch (getFirst("@").x) {
      case 2:
        playerAttack(player, false, 0)
        break;
      case 4:
        playerAttack(player, false, 1)
        break;
    }
  }
})

onInput("l", () => {
  getFirst("@").x += 1;
})

afterInput(() => {
  
})

function setup() {
  addSprite(0, 7, "7")
  addSprite(3, 7, "s")
  addSprite(6, 7, "C")
  addSprite(9, 7, "a")
  addSprite(1, 6, "o")
  addSprite(0, 6, "-")
  addSprite(3, 6, "-")
  addSprite(6, 6, "-")
  addSprite(9, 6, "-")
  //load enemies
  addSprite(2, 3, "F")
  addSprite(4, 3, "I")
  addSprite(6, 3, "F")
  //start first turn
  turn()
}

function loadText() {
  clearText()
  addText(String(characters[1].temp.energy), options = {x:0, y:13, color:color`3`})
  addText(String(characters[0].temp.energy), options = {x:6, y:13, color:color`3`})
  addText(String(characters[3].temp.energy), options = {x:12,y:13, color:color`3`})
  addText(String(characters[2].temp.energy), options = {x:18,y:13, color:color`3`})
  addText(msg, options = {x:1, y:1, color:color``})

}
function playerAttack(charNum, skillOn, target) {
  //get the character
  reuse = characters[charNum]
  //remove the damage
  if (skillOn) {
    //add energy! and remove sp! and fun text!
    reuse.temp.energy += reuse.attacks.skill.energy
    sp += reuse.attacks.skill.sp
    msg = reuse.attacks.skill.name
    if (sp < 0) {sp++; return "not enough points!"}
    //console.log(sp)
    //do all damaging skills first!
    if (Object.keys(reuse.attacks.skill).includes("dmg")) {
      //check if you get a crit
      if (Math.random() <= reuse.stats.CRITrate) {
        dmgcalc = reuse.attacks.skill.dmg * reuse.stats.ATK * (1 + reuse.stats.CRITdmg)
      } else {
        dmgcalc = reuse.attacks.skill.dmg * reuse.stats.ATK
      }
      //console.log(dmgcalc)
      if (reuse.temp.buffs.length > 0) {
        //buff logic
      }
      if (reuse.temp.debuffs.length > 0) {
        //debuff logic
      }
      if (enemies[target].temp.toughness > 0) {
        dmgcalc = dmgcalc * 0.9
      } /*figure out def reduction & etc.*/
      if (enemies[target].weaknesses.includes(reuse.info.type)) {
        enemies[target].temp.toughness -= reuse.attacks.skill.toughness
        //console.log(enemies[target].temp.toughness)
      }
    }
  } else {
    //basic attack!
    msg = reuse.attacks.basic.name
    if (sp < 5) {sp += reuse.attacks.basic.sp}
    reuse.temp.energy += reuse.attacks.basic.energy
    if (Math.random() <= reuse.stats.CRITrate) {
        dmgcalc = reuse.attacks.basic.dmg * reuse.stats.ATK * (1 + reuse.stats.CRITdmg)
      } else {
        dmgcalc = reuse.attacks.basic.dmg * reuse.stats.ATK
    }
    //console.log(dmgcalc)
    if (reuse.temp.buffs.length > 0) {
      //buff logic
    }
    if (reuse.temp.debuffs.length > 0) {
      //debuff logic
    }
    if (enemies[target].temp.toughness > 0) {
      dmgcalc = dmgcalc * 0.9
    } /*figure out def reduction & etc.*/
    if (enemies[target].weaknesses.includes(reuse.info.type)) {
      enemies[target].temp.toughness -= reuse.attacks.skill.toughness
      //console.log(enemies[target].temp.toughness)
    }
  }
  enemies[target].temp.HP -= dmgcalc
  //console.log(enemies[target].temp.HP)
  spdforchars = reuse.temp.action
  for (y = 0; y < 4; y++) {
    characters[y].temp.action = characters[y].temp.action - spdforchars
    //console.log(characters[y].temp.action)
  }
  for (y = 0; y < enemies.length; y++) {
    enemies[y].temp.action = enemies[y].temp.action - spdforchars
    //console.log(enemies[y].temp.action)
  }
  reuse.temp.action = reuse.stats.baseAction
  turn()
}

function getLowestActionValue() {
  reuse = 20000000
  for (x = 0; x < characters.length; x++) {
    if (characters[x].temp.action < reuse) { reuse = characters[x].temp.action }
  }
  for (x = 0; x < enemies.length; x++) {
    if (enemies[x].temp.action < reuse) { reuse = enemies[x].temp.action }
  }
  for (x = 0; x < characters.length; x++) {
    if (characters[x].temp.action == reuse) { return characters[x] }
  }
  for (x = 0; x < enemies.length; x++) {
    if (enemies[x].temp.action == reuse) { return enemies[x] }
  }
}

function turn() {
  loadText()
  //check if anybody is ded
  for (o = 0; o < enemies.length; o++) {
    console.log(enemies[o].temp.HP)
    if (enemies[o].temp.HP <= 0) {
      enemies.splice(o, 1)
    }
  }
  //check if everyone is ded
  if (enemies.length == 0) {
    return
  }
  //get whos turn it is
  reuse = getLowestActionValue()
  //if it is an enemy
  if (reuse.info.enemy == true) {
  enemyTurn(reuse)
  } else {
  
  playerTurn(reuse)
  }
}

function playerTurn(attacker) {
  playerTurnOn = true
  player = characters.indexOf(attacker)
  addSprite(attacker.x, 7, active)
  console.log(attacker.info.name)
}

function enemyTurn(attacker) {
  playerTurnOn = false
  //remove later
  spdforchars = attacker.temp.action
  for (y = 0; y < 4; y++) {
    characters[y].temp.action = characters[y].temp.action - spdforchars
    //console.log(characters[y].temp.action)
  }
  for (y = 0; y < enemies.length; y++) {
    enemies[y].temp.action = enemies[y].temp.action - spdforchars
    //console.log(enemies[y].temp.action)
  }
  attacker.temp.action = attacker.stats.baseAction
  turn()
}

function enemyAttack(){
  reuse = Math.floor(Math.random()*18)
  if (reuse < 5) {/*attack Stelle*/}
  if (reuse > 4 && reuse < 11) {/*attack March*/}
  if (reuse > 10 && reuse < 15) {/*attack Asta*/}
  if (reuse > 13) {/*attack Dan Heng*/}
}

function getEnemyAtIndex(index) {
  for (k = 0; k < enemies.length; k++) {
    if (enemies[k].info.index == index) {
      return enemies[k]
    }
  }
  //win()
}


setup()
loadText()

