//first project ever in javascript really hella inefficient conway's game of life
//shoot i just realized i dont need to put semicolons at the end of these statements
//sorry i'm used to c++ lol

// Set up constants for low resolution and high resolution.
const lowResW = 50;
const lowResH = 50;

let interval = null;
let intervalTime = 100;

let rTeam = true;

let patternBuffer; // The off-screen graphics buffer.
let bufferPixels;  // The array to hold the pixel data.
let nextBufferPixels;

const bufferSize = lowResW * lowResH;


function setup() {
  createCanvas(500, 500);
  noSmooth();

  // Create the ographics buffer 
  patternBuffer = createGraphics(lowResW, lowResH);
  patternBuffer.noSmooth();

  
  bufferPixels = new Array(bufferSize);
  bufferPixels.fill(0); // fill the array with 0s

  nextBufferPixels = new Array(bufferSize);
  nextBufferPixels.fill(0);
 
}

function draw() {
  let blues = 0;
  let reds = 0;
  
  background(220);
  patternBuffer.background(220);


  patternBuffer.fill(0); // Black pixels
  patternBuffer.noStroke(); // No outline

  if (mouseIsPressed){
    let gx = floor(mouseX / (width / lowResW));
    let gy = floor(mouseY / (height / lowResH));

    if (gx >= 0 && gx < lowResW && gy >= 0 && gy < lowResH) {
      if (rTeam == true){
        bufferPixels[UGC(gx, gy)] = 1;
      }
      else{
        bufferPixels[UGC(gx, gy)] = 2;
      }
    }
  }


  //draw cells in game
  for (let y = 0; y < lowResH; y++) {
    for (let x = 0; x < lowResW; x++) {
      //get the pixel
      const Gpixel = x + y * lowResW;

      // if pixel in array is 1 draw on buffer
      if (bufferPixels[Gpixel] === 1) {// red team
        patternBuffer.fill(255,0,0);
        patternBuffer.rect(x, y, 1, 1);
        reds++;
      }
      if (bufferPixels[Gpixel] === 2) {// blue team
        patternBuffer.fill(0,0,255);
        patternBuffer.rect(x, y, 1, 1);
        blues++;
      }
    }
  }

  // draw buffer onto canvas
  image(patternBuffer, 0, 0, width, height);

  fill(0);
  stroke(150);
  for (let x = 0; x < width; x += width / lowResW) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += height / lowResH) {
    line(0, y, width, y);
  }

  textStyle(BOLD);
  textSize(20);
  stroke(0);
  fill(255, 0, 0); // red color
  text(str(reds),5,495);

  fill(0,0,255) // blue color
  text(str(blues),5,475);

  // color drawing indicator
  
  if (rTeam == true){
    fill(255,0,0);
  }
  else{
    fill(0,0,255);
  }
  rect(480,480,20,20);
}

//defining life function
function doLife() {
    //life logic
    for (let i = 0; i < bufferPixels.length; i++){
      const coords = getCoords(i);
      let liveCells = countNeighbors(coords.x, coords.y);
      let enemies = countEnemies(coords.x, coords.y);
      

      if ((bufferPixels[i] > 0)&& liveCells < 2){
        nextBufferPixels[i] = 0;
      } // underpopulation logic

      if ((bufferPixels[i] > 0) && liveCells > 3){
        nextBufferPixels[i] = 0;
      } // overpopulation logic 


      if ((bufferPixels[i] == 0) && liveCells == 3 && enemies < 0){
        nextBufferPixels[i] = 1;
      } // reproduction logic -- RED

      if ((bufferPixels[i] == 0) && liveCells == 3 && enemies > 0){
        nextBufferPixels[i] = 2;
      } // reproduction logic -- BLUE


      if ((bufferPixels[i] == 1) && (liveCells == 3 || liveCells == 2)){
        nextBufferPixels[i] = 1;
      } // not death logic -- RED

      if ((bufferPixels[i] == 2) && (liveCells == 3 || liveCells == 2)){
        nextBufferPixels[i] = 2;
      } // not death logic -- BLUE


      if ((bufferPixels[i] == 1) && enemies > 0){ // red to blue logic
        nextBufferPixels[i] = 2;
      }

      if ((bufferPixels[i] == 2) && enemies < 0){ // blue to red logic
        nextBufferPixels[i] = 1;
      }
    }
   
    bufferPixels = nextBufferPixels.slice();
    nextBufferPixels.fill(0);

  // Loop through the low res grid and draw rectangles
  
}

function countNeighbors(x, y) {
  let liveCount = 0;

  // Loop through all eight neighbor positions around the cell at (x, y)
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      
      const neighborX = x + i;
      const neighborY = y + j;

      // Skip the cell itself
      if (i === 0 && j === 0) {
        continue;
      }

      
      if (neighborX >= 0 && neighborX < lowResW && neighborY >= 0 && neighborY < lowResH) {
        
        const neighborIndex = neighborX + neighborY * lowResW;

        // Add to the count if the neighbor is alive
        if (bufferPixels[neighborIndex] > 0) {
          liveCount++;
        }
      }
    }
  }
  return liveCount;
}

function countEnemies(x,y){
  let redCount = 0;
  let blueCount = 0;

  // Loop through all eight neighbor positions around the cell at (x, y)
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      
      const enemyX = x + i;
      const enemyY = y + j;

      // Skip the cell itself
      if (i === 0 && j === 0) {
        continue;
      }

      
      if (enemyX >= 0 && enemyX < lowResW && enemyY >= 0 && enemyY < lowResH) {
        
        const enemyIndex = enemyX + enemyY * lowResW;

        // Add to the count if the neighbor is alive
        if (bufferPixels[enemyIndex] === 1) {
          redCount++;
        }
        if (bufferPixels[enemyIndex] === 2){
          blueCount++;
        }
      }
    }
  }
  return blueCount - redCount;
}

function getCoords(index) {
  const x = index % lowResW;
  const y = Math.floor(index / lowResW);
  return { x, y };
}

function UGC(x,y){
  return x+y * lowResW;
}

function keyPressed(){
  if (key === " "){
    if (interval === null){
      interval = setInterval(doLife, intervalTime);
    }
  }

  if (key === "e"){
    rTeam = (rTeam == true) ? false : true;
  }
}

function keyReleased(){
  if (key === " "){
    clearInterval(interval);
    interval = null;
  }
}