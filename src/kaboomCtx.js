import kaboom from "kaboom";

export const k = kaboom({ // Variable global para usar en todo el contexto.
  
  // Properties
  global: false, // Var para no hacer global la constante
  touchToMouse: true, // Var para usar app en movil
  canvas: document.getElementById("game"), // Properties, indica el elemento canvas
  debug: true, // set to false once ready for production
});
