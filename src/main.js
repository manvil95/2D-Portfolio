import { k } from "./kaboomCtx";

// Almacenamos las posiciones del personaje
const BOB = {
    idle_down : [3, 27],
    walk_down_start : [114, 138],
    walk_down_end : [119, 143],
    idle_up : [1, 25],
    walk_up_start : [102, 126],
    walk_up_end : [107, 131],
    idle_side_left : [2, 26],
    walk_side_left_start : [108, 132],
    walk_side_left_end : [113, 137],
    idle_side_right : [0, 24],
    walk_side_right_start : [96, 120],
    walk_side_right_end : [101, 125]
}
// Permite cargar una imagen como sprite
// Cualquier item en la carpeta public, se puede routear con './'
k.loadSprite("bob", "./Bob_16x16.png", {
    // Properties para indicar como dividir el sprite en frames
    // cuantos frames tiene (frames = length / 16) 1 frame -> 16x16
    sliceX: 24, // Hay 24 frames por fila (384 / 16)
    sliceY: 14, // Hay 14 frames por columna (224 / 16)

    // * Tiled to draw maps
    // Se definen los hookup (names) para las animaciones
    anims: {
        "idle-down" : BOB.idle_down,
        "walk-down" : { from: BOB.walk_down_start, to: BOB.walk_down_end, loop: true, speed: 8 }, 
        "idle-up" : BOB.idle_up,
        "walk-up" : { from: BOB.walk_up_start, to: BOB.walk_up_end, loop: true, speed: 8 }, 
        "idle-side-left" : BOB.idle_side_left,
        "walk-side-left" : { from: BOB.walk_side_left_start, to: BOB.walk_side_left_end, loop: true, speed: 8 },
        "idle-side-right" : BOB.idle_side_right,
        "walk-side-right" : { from: BOB.walk_side_right_start, to: BOB.walk_side_right_end, loop: true, speed: 8 },
    }
}) 