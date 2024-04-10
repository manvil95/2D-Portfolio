import Kaboom from "kaboom";

export const k = Kaboom({ // Variable global para usar en todo el contexto
    global: false, // Var para no hacer global la constante
    touchToMouse: true, // Var para usar app en movil
    canvas: document.getElementById("game"),
});

