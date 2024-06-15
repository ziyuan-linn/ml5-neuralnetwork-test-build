/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates neuroevolution with ml5.neuralNetwork.
 */

let birds = [];
let pipes = [];
let nextBirds = [];

function setup() {
  createCanvas(640, 240);
  // cpu is higher performance for tiny neural networks like in this example
  ml5.setBackend("cpu");

  for (let i = 0; i < 200; i++) {
    birds[i] = new Bird();
  }
  pipes.push(new Pipe());
}

function draw() {
  background(255);

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].show();
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  for (let bird of birds) {
    if (bird.alive) {
      for (let pipe of pipes) {
        if (pipe.collides(bird)) {
          bird.alive = false;
        }
      }
      bird.think(pipes);
      bird.update();
      bird.show();
    }
  }

  if (frameCount % 100 == 0) {
    pipes.push(new Pipe());
  }

  if (allBirdsDead()) {
    normalizeFitness();
    reproduction();
  }
}

function allBirdsDead() {
  for (let bird of birds) {
    if (bird.alive) {
      return false;
    }
  }
  return true;
}

function reproduction() {
  for (let i = 0; i < birds.length; i++) {
    let parentA = weightedSelection();
    let parentB = weightedSelection();
    parentA.crossover(parentB, gotCrossOver);
  }
}

function gotCrossOver(child) {
  child.mutate(0.01);
  nextBirds.push(new Bird(child));
  if (nextBirds.length == birds.length) {
    birds = nextBirds;
    nextBirds = [];
  }
}

// Normalize all fitness values
function normalizeFitness() {
  let sum = 0;
  for (let bird of birds) {
    sum += bird.fitness;
  }
  for (let bird of birds) {
    bird.fitness = bird.fitness / sum;
  }
}

function weightedSelection() {
  // Start with the first element
  let index = 0;
  // Pick a starting point
  let start = random(1);
  // At the finish line?
  while (start > 0) {
    // Move a distance according to fitness
    start = start - birds[index].fitness;
    // Next element
    index++;
  }
  // Undo moving to the next element since the finish has been reached
  index--;
  // Instead of returning the entire Bird object, just the brain is returned
  return birds[index].brain;
}
