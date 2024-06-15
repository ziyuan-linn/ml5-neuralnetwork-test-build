/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates neuroevolution with ml5.neuralNetwork.
 */

let creatures = [];
let nextCreatures = [];
let timeSlider;
let lifeSpan = 250; // How long should each generation live
let lifeCounter = 0; // Timer for cycle of generation
let food;
let generations = 0;

function setup() {
  createCanvas(640, 240);
  ml5.setBackend("cpu");
  for (let i = 0; i < 50; i++) {
    creatures[i] = new Creature(random(width), random(height));
  }
  glow = new Glow();
  timeSlider = createSlider(1, 20, 1);
}

function draw() {
  background(255);

  glow.update();
  glow.show();

  for (let creature of creatures) {
    creature.show();
  }

  for (let i = 0; i < timeSlider.value(); i++) {
    for (let creature of creatures) {
      creature.seek(glow);
      creature.update(glow);
    }
    lifeCounter++;
  }

  if (lifeCounter > lifeSpan) {
    normalizeFitness();
    reproduction();
    lifeCounter = 0;
    generations++;
  }
  fill(0);
  noStroke();
  text("Generation #: " + generations, 10, 18);
  text("Cycles left: " + (lifeSpan - lifeCounter), 10, 36);
}

function normalizeFitness() {
  for (let creature of creatures) {
    creature.fitness = pow(2, creature.fitness);
  }
  let sum = 0;
  for (let creature of creatures) {
    sum += creature.fitness;
  }
  for (let creature of creatures) {
    creature.fitness = creature.fitness / sum;
  }
}

function reproduction() {
  for (let i = 0; i < creatures.length; i++) {
    let parentA = weightedSelection();
    let parentB = weightedSelection();
    parentA.crossover(parentB, gotChild);
  }
}

function gotChild(child) {
  child.mutate(0.1);
  let childCreature = new Creature(random(width), random(height), child);
  nextCreatures.push(childCreature);
  if (nextCreatures.length === creatures.length) {
    creatures = nextCreatures;
    nextCreatures = [];
  }
}

function weightedSelection() {
  let index = 0;
  let start = random(1);
  while (start > 0) {
    start = start - creatures[index].fitness;
    index++;
  }
  index--;
  return creatures[index].brain;
}
