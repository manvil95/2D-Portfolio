import { bob, dialogueData, scaleFactor } from "./constants";
import { k } from "./kaboomCtx";
import { displayDialogue, setCamScale } from "./utils";

// Permite cargar una imagen como sprite
// Cualquier item en la carpeta public, se puede routear con './'
// **** P E R S O N A J E ****
// Almacenamos las posiciones del personaje
// const BOB = {
//   idleDown : [3, 27],
//   walkDownStart : [114, 138],
//   walkDownEnd : [119, 143],
//   idleUp : [1, 25],
//   walkUpStart : [102, 126],
//   walkUpEnd : [107, 131],
//   idleSideLeft : [2, 26],
//   walkSideLeftStart : [108, 132],
//   walkSideLeftEnd : [113, 137],
//   idleSideRight : [0, 24],
//   walkSideRightStart : [96, 120],
//   walkSideRightEnd : [101, 125]
// }


k.loadSprite("character", "./assets/Bob_16x16.png", {
    // Properties para indicar como dividir el sprite en frames
    // cuantos frames tiene (frames = length / 16) 1 frame -> 16x16
    // sliceX: 39,
    // sliceY: 31,
    sliceX: 24, // Hay 24 frames por fila (384 / 16)
    sliceY: 14, // Hay 14 frames por columna (224 / 16)
    anims: {
        
        "idle-down-t" : bob.idleDownTop,
        "walk-down-t" : { from: bob.walkDownStartTop, to: bob.walkDownEndTop, loop: true, speed: 8 }, 
        "idle-up-t" : bob.idleUpTop,
        "walk-up-t" : { from: bob.walkUpStartTop, to: bob.walkDownEndTop, loop: true, speed: 8 }, 
        "idle-side-t" : bob.ide,
        "walk-side-t" : { from: bob.walkSideStartTop, to: bob.walkSideEndTop, loop: true, speed: 8 },
        "idle-down" : bob.idleDown,
        "walk-down" : { from: bob.walkDownStart, to: bob.walkDownEnd, loop: true, speed: 8 }, 
        "idle-up" : bob.idleUp,
        "walk-up" : { from: bob.walkUpStart, to: bob.walkUpEnd, loop: true, speed: 8 }, 
        "idle-side" : bob.idleSide,
        "walk-side" : { from: bob.walkSideStart, to: bob.walkSideEnd, loop: true, speed: 8 },

    },
});

// **** M A P A ****
k.loadSprite("map", "./map.png");

k.setBackground(k.Color.fromHex("#311047"));

k.scene("main", async () => {
    // Lógica para la scena
    const mapData = await (await fetch("./map.json")).json();
    const layers = mapData.layers;

    const map = k.add([k.sprite("map"), k.pos(0), k.scale(scaleFactor)]);

    const playerTop = k.make([
        k.sprite("character", { anim: "idle-down-t"}),
        k.area({
            shape: new k.Rect(k.vec2(0, 10), 16, 16),
        }),
        k.body(),
        k.anchor("center"),
        k.pos(0, -16), // Dónde posicionamos el pj
        k.scale(scaleFactor),
        {
            speed: 250,
            direction: "down",
            isInDialogue: false,
        },
        "playeTop",
    ]);
    
    const player = k.make([
        k.sprite("character", { anim: "idle-down"}),
        k.area({
            shape: new k.Rect(k.vec2(0, 10), 16, 16),
        }),
        k.body(),
        k.anchor("center"),
        k.pos(), // Dónde posicionamos el pj
        k.scale(scaleFactor),
        {
            speed: 250,
            direction: "down",
            isInDialogue: false,
        },
        "player",
    ]);

    player.onUpdate(() => {
        playerTop.pos = k.vec2(player.pos.x, player.pos.y + 20);
    });

    for (const layer of layers) {
        if (layer.name === "boundaries") { // Nombre de los límites en map.json
            for (const boundary of layer.objects) {
                map.add([
                    k.area({
                        shape: new k.Rect(
                            k.vec2(0),
                            boundary.width,
                            boundary.height
                        ),
                    }),
                    k.body({ isStatic: true }),
                    k.pos(boundary.x, boundary.y),
                    boundary.name,
                ]);

                if (boundary.name) {
                    player.onCollide(boundary.name, () => {
                        player.isInDialogue = true;
                        displayDialogue(
                            dialogueData[boundary.name],
                            () => (player.isInDialogue = false)
                        );
                    });
                }
            }

            continue;
        }

        if (layer.name === "spawnpoint") {
            for (const entity of layer.objects) {
                if (entity.name === "player") {

                    player.pos = k.vec2(
                        (map.pos.x + entity.x) * scaleFactor,
                        (map.pos.y + entity.y) * scaleFactor
                    );
                    k.add(player);
                    continue;
                }
            }
        }
    }

    setCamScale(k);

    k.onResize(() => {
        setCamScale(k);
    });
    
    
    k.onUpdate(() => {
        k.camPos(player.worldPos().x, player.worldPos().y - 100);
    });
    

    k.onMouseDown((mouseBtn) => {
        if (mouseBtn !== "left" || player.isInDialogue) return;

        const worldMousePos = k.toWorld(k.mousePos());
        player.moveTo(worldMousePos, player.speed);

        const mouseAngle = player.pos.angle(worldMousePos);

        const lowerBound = 50;
        const upperBound = 125;

        if (
            mouseAngle > lowerBound &&
            mouseAngle < upperBound &&
            player.curAnim() !== "walk-up"
        ) {
            player.play("walk-up");
            player.direction = "up";
            return;
        }

        if (
            mouseAngle < -lowerBound &&
            mouseAngle > -upperBound &&
            player.curAnim() !== "walk-down"
        ) {
            player.play("walk-down");
            player.direction = "down";
            return;
        }

        if (Math.abs(mouseAngle) > upperBound) {
            player.flipX = true;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "right";
            return;
        }

        if (Math.abs(mouseAngle) < lowerBound) {
            player.flipX = false;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "left";
            return;
        }
    });

    function stopAnims() {
        if (player.direction === "down") {
            player.play("idle-down");
            return;
        }
        if (player.direction === "up") {
            player.play("idle-up");
            return;
        }

        player.play("idle-side");
    }

    k.onMouseRelease(stopAnims);

    k.onKeyRelease(() => {
        stopAnims();
    });
    k.onKeyDown((key) => {
        const keyMap = [
            k.isKeyDown("right"),
            k.isKeyDown("left"),
            k.isKeyDown("up"),
            k.isKeyDown("down"),
        ];

        let nbOfKeyPressed = 0;
        for (const key of keyMap) {
            if (key) {
                nbOfKeyPressed++;
            }
        }

        if (nbOfKeyPressed > 1) return;

        if (player.isInDialogue) return;
        if (keyMap[0]) {
            player.flipX = true;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "right";
            player.move(player.speed, 0);
            return;
        }

        if (keyMap[1]) {
            player.flipX = false;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "left";
            player.move(-player.speed, 0);
            return;
        }

        if (keyMap[2]) {
            if (player.curAnim() !== "walk-up") player.play("walk-up");
            player.direction = "up";
            player.move(0, -player.speed);
            return;
        }

        if (keyMap[3]) {
            if (player.curAnim() !== "walk-down") player.play("walk-down");
            player.direction = "down";
            player.move(0, player.speed);
        }
    });
});

k.go("main");
