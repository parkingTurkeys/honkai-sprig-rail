/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: hsr-battle
@author: 
@tags: []
@addedOn: 2025-00-00
*/



const herta = "h"
const stelle = "s"
const m7 = "7"
const asta = "a"
const cardbg = "_"
const danheng = "🌙"

let legend = []
             

setLegend(
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
...888..222.8.88
..8.88......8.8.
...88.......88..
....8........8..`],
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
.889888222228888
.889888222888888
88.9988222228888
8.8998222222288.
.88.82222222288.`],
  [danheng, bitmap`
.........0......
........00......
......0000000...
....00000000000.
...0000000000LL.
....0002000000..
....00002L0220..
...0022020L22D0.
...0022222LDDD0.
...0022222L220..
...0..222222.00.
.......2222.....
........22......
................
................
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
LLLLL0LLLLLL1LLL`]
  
)

setSolids([])

let level = 0
const levels = [
  map`
..........
..........
..........
..........
..........
..........
_.._.._.._
_.._.._.._`
]

setMap(levels[level])



onInput("s", () => {
  
})

afterInput(() => {
  
})

function setup() {
  addSprite(0, 7, "h")
}
setup()