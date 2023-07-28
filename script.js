// Decoupage image source et collage dans destination
//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
const canvas = document.getElementById("canvas");
canvas.width = 431;
canvas.height = 768;
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./media/flappy-bird-set.png";
//

// Declaration des sons
const chockSound = new Audio("./sons/sonChoc.mp3");
const flySound = new Audio("./sons/sonVole.mp3");
const scoreSound = new Audio("./sons/sonScore.mp3");

// Paramètres
// pour afficher l'écran d'accueil / demarrer areter le jeu
let gamePlaying = false;
// pour afficher l'écran gameover
let gameover = false;
// paramètres de jeu
const gravity = 0.8;
let speed = 6.2;
const jump = -50;
// taille de l'oiseau dans le fichier image
const birdSize = [51, 36]; //largeur, hauteur
const birdMarginLeft = canvas.width / 10;
// parametrage battement des ailes
const wingsSpeed = 6;

// Variables
let index = 0;
let bestScore = 0;
let currentScore = 0;
// point en cours (vrai tant que les barres n'ont pas dépassé l'oiseau)
let round = true;
let pipe = [];
let flight = 0;
let flyHeight;
// decalage vers le haut de la barre haute
let barPosition = -200;
// espace vertical entre les barres
let spaceBetweenBars = 250;
// taille des bares
const barSize = [77, 500];
// position et taille des barres dans l'image d'origine
const imgDownBar = [433, 108, ...barSize];
const imgUpBar = [511, 108, ...barSize];
// position horizontale des barres
let barMoveX = canvas.width + barSize[0];
// Zone horizontale de contact potentiel
const dangerZoneBegin = birdMarginLeft + birdSize[0];
const dangerZoneEnd = birdMarginLeft - barSize[0];

const render = () => {
  index++;

  console.log("speed", speed);
  flyHeight = canvas.height / 2;
  // backgroung composé de deux images
  // première partie image de fond--------------
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    canvas.width - (((index * speed) / 2) % canvas.width),
    0,
    canvas.width,
    canvas.height
  );
  // Deuxieme partie image de fond --------------
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -(((index * speed) / 2) % canvas.width),
    0,
    canvas.width,
    canvas.height
  );
  // jeu démarré =======================================================
  if (gamePlaying) {
    // Animation des barres
    // decalage ver le haut de la barre du haut

    // deplacement horizontal des barres
    barMoveX =
      canvas.width - (((index * speed) / 2) % (canvas.width + barSize[0]));
    // disparition barres à gauche => positionnement à droite nouvelles barres
    if (barMoveX < -75) {
      barPosition = -Math.floor(Math.random() * barSize[1]);
      barMoveX = canvas.width;
      round = true;
    }
    // definition de l'ordonnée basse de la barre du haut
    const endUpBarPosition = barPosition + barSize[1];
    // Affichage barre du haut
    ctx.drawImage(img, ...imgDownBar, barMoveX, barPosition, ...barSize);
    // Affichage barre du bas
    ctx.drawImage(
      img,
      ...imgUpBar,
      barMoveX,
      endUpBarPosition + spaceBetweenBars,
      ...barSize
    );
    // animation flappy
    flySound.volume = 0.1;
    flySound.play();
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - birdSize[1]);
    ctx.drawImage(
      img,
      432,
      Math.floor(birdSize[1] * (Math.floor(index / wingsSpeed) % 3)),
      ...birdSize,
      // positionnement à gauche
      birdMarginLeft,
      flyHeight,
      ...birdSize
    );
    // traitement des collisions
    if (barMoveX > dangerZoneEnd && barMoveX < dangerZoneBegin) {
      if (
        flyHeight < endUpBarPosition - birdSize[1] ||
        flyHeight + birdSize[1] > endUpBarPosition + spaceBetweenBars
      ) {
        chockSound.play();
        gameover = true;
        gamePlaying = false;
        speed = 6.2;
      }
    }
    // Gestion du score courant
    if (barMoveX < dangerZoneEnd && round === true) {
      round = false;
      scoreSound.play();
      currentScore += 1;
      speed += 0.1;
    }
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - birdSize[1]);
    // Affichage du score
    ctx.font = "bold 30px courier";
    ctx.fillText(`Score : ${currentScore}`, 55, 35);
  }
  // jeu non démarré ===================================================
  else {
    if (gameover) {
      ctx.font = "bold 30px courier";
      ctx.fillText("Game Over !!!", 65, 175);
      ctx.fillText(`Your Score : ${currentScore}`, 55, 215);
      ctx.fillText(`Best Score : ${bestScore}`, 55, 245);
      ctx.fillText("press any key to exit", 28, 575);
    } else {
      ctx.font = "bold 30px courier";
      ctx.fillText(`Best Score : ${bestScore}`, 55, 245);
      ctx.fillText("Click to play !", 48, 535);
      ctx.fillText("press any key to exit", 28, 575);
    }
    // animation flappy
    ctx.drawImage(
      img,
      432,
      Math.floor(birdSize[1] * (Math.floor(index / wingsSpeed) % 3)),
      ...birdSize,
      // positionnement milieu
      canvas.width / 2 - birdSize[0] / 2,
      flyHeight,
      ...birdSize
    );
  }
};

img.onload = render;

// Gestion des évènements ========================================================

document.addEventListener("click", () => (gamePlaying = true));
window.onclick = () => {
  flight += jump;
};
window.addEventListener("keypress", (e) => {
  if (e.key !== "") {
    gamePlaying = false;
    bestScore = currentScore > bestScore ? currentScore : bestScore;
    flight = 0;
    currentScore = 0;
    index = 0;
    gameover = false;
    let speed = 6.2;
  }
});

//
const interval = setInterval(render, 20);
interval;
