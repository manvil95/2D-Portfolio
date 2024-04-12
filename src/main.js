import { scaleFactor, BOB } from "./constants";
import { k } from "./kaboomCtx";
import { displayDialogue } from "./utils";

// Permite cargar una imagen como sprite
// Cualquier item en la carpeta public, se puede routear con './'
// **** P E R S O N A J E ****
k.loadSprite("bob", "./assets/Bob_16x16.png", {
    // Properties para indicar como dividir el sprite en frames
    // cuantos frames tiene (frames = length / 16) 1 frame -> 16x16
    sliceX: 24, // Hay 24 frames por fila (384 / 16)
    sliceY: 14, // Hay 14 frames por columna (224 / 16)

    // * Tiled to draw maps
    // Se definen los hookup (names) para las animaciones
    anims: {
        "idle-down" : BOB.idleDown,
        "walk-down" : { from: BOB.walkDownStart, to: BOB.walkDownEnd, loop: true, speed: 8 }, 
        "idle-up" : BOB.idleUp,
        "walk-up" : { from: BOB.walkUpStart, to: BOB.walkUpEnd, loop: true, speed: 8 }, 
        "idle-side-left" : BOB.idleSideLeft,
        "walk-side-left" : { from: BOB.walkSideLeftStart, to: BOB.walkSideLeft_end, loop: true, speed: 8 },
        "idle-side-right" : BOB.idleSideRight,
        "walk-side-right" : { from: BOB.walkSideRightStart, to: BOB.walkSideRight_end, loop: true, speed: 8 },
    },
});

// **** M A P A ****
k.loadSprite("map", "./map.png");

k.setBackground(k.Color.fromHex(311047));

k.scene("main", async () => {
    // Lógica para la scena
    const mapData = await (await fetch("./map.json")).json()
    const layers = mapData.layers;

    const map = k.make([k.sprite("map"), k.pos(0), k.scale(scaleFactor)]);

    const player = k.make([
        k.sprite("bob", { anim: "idle-down" }), 
        k.area({
            shape: new k.Rect(k.vec2(0,3), 10, 10)
        }),
        k.body(),
        k.anchor("center"),
        k.pos(), // Dónde posicionamos el pj
        k.scale(scaleFactor),
        {
            speed: 250,
            direction: "down",
            isInDialogue: false
        },
        "player"
    ]);

    for (const layer of layers) {
        if (layer.name === "bounderies") { // Nombre de los límites en map.json
            for (const boundary of layer.objects) {
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height)
                    }),
                    k.body({ isStatic: true }),
                    k.pos(boundary.x, boundary.y),
                    boundary.name
                ])

                if (boundary.name) {
                    player.onCollide(boundary.name, () => {
                       player.isInDialogue = true
                       // TODO utils, crear una nueva
                       player.isInDialogue = true
                       displayDialogue("TODO", () => player.isInDialogue = false)  
                    });
                }
            }
        }
    }
});

k.go("main");