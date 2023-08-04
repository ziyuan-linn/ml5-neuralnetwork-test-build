// Copyright (c) 2020 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
BodyPix
=== */

let bodypix;
let video;
let segmentation;
let i = 1;

const options = {
  outputStride: 32,  //16 or 32 for ResNet, 
  multiSegmentation: false,
  segmentBodyParts: true
}


function setup() {
  bodypix = ml5.bodyPix(options);
  createCanvas(480, 360);
  // load up your video
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide(); // Hide the video element, and just show the canvas
  //frameRate(50);
}

function videoReady() {
  bodypix.segmentWithParts(video, gotResults, options);
}



function draw() {
  bodypix.segmentWithParts(video, gotResults, options);

}

// function gotResults(err, result) {
//   console.log("gotResults is called the", i, "th time.");
//   if (err) {
//     console.log(err);
//     return;
//   }
//   segmentation = result;

//   background(255, 0, 0);
//   image(video, 0, 0, width, height)
//   // GH: segmentation.partMask is an ImageData object
//   // it appears like p5 can't draw those to the canvas directly
//   tint(255, 100) // for controlling mask transparency
//   image(segmentation.partMask, 0, 0, width, height);
//   bodypix.segmentWithParts(video, gotResults, options);
//   i = i + 1;
// }


function draw() {
  //background(255, 0, 0);
  bodypix.segmentWithParts(video, gotResults, options);

}

function gotResults(err, result) {
  console.log("gotResults is called the", i, "th time.");
  if (err) {
    console.log(err);
    return;
  }
  segmentation = result;
  image(video, 0, 0, width, height);
  tint(255, 120) // for controlling mask transparency
  image(segmentation.partMask, 0, 0, width, height);
  bodypix.segmentWithParts(video, gotResults, options);
  
}