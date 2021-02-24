const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
var videoshow = require("videoshow");
// var Utimes = require("@ronomon/utimes");
// import { timeStamp } from "console";
// import { utimes } from "utimes";
const { utimes } = require("utimes");

var images = [];
let timeStamp1 = 447775200000;
let number1 = 1;
let colorArrayBegin = [
  "#000000",
  "#03001a",
  "#132866",
  "#47167a",
  "#7e2180",
  "#ad4245",
  "#b56d4e",
  "#e6e1a5",
  "#f5f5e9",
];

function createArray(colorArrayBegin) {
  let newColorArray = [];
  for (let index = 0; index < colorArrayBegin.length - 1; index++) {
    const index2 = index + 1;
    const element = colorArrayBegin[index];
    const element2 = colorArrayBegin[index2];
    newColorArray.push(element);
    newColorArray.push(pickcentralcolor(element, element2));
  }
  newColorArray.push(colorArrayBegin[colorArrayBegin.length - 1]);
  return newColorArray;
}

function pickcentralcolor(c1, c2) {
  var c = "#";
  for (var i = 0; i < 3; i++) {
    var sub1 = c1.substring(1 + 2 * i, 3 + 2 * i);
    var sub2 = c2.substring(1 + 2 * i, 3 + 2 * i);
    var v1 = parseInt(sub1, 16);
    var v2 = parseInt(sub2, 16);
    var v = Math.floor((v1 + v2) / 2);
    var sub = v.toString(16).toUpperCase();
    var padsub = ("0" + sub).slice(-2);
    c += padsub;
  }
  return c;
}

createimagefiles(
  createArray(
    createArray(createArray(createArray(createArray(colorArrayBegin))))
  )
);
// makevideo();

// createimagefiles(createArray(colorArrayBegin));
function createimagefiles(colorsArray) {
  for (let index = 0; index < colorsArray.length - 1; index++) {
    const element = colorsArray[index];
    console.log(element);
    const width = 1280;
    const height = 720;
    const superNumber = zeroFill(index, 3);
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    context.fillStyle = element;
    context.fillRect(0, 0, width, height);

    const filename = "./" + superNumber + "test.png";
    const filepath = __dirname + "/" + superNumber + "test.png";
    const imagefile = superNumber + "test.png";
    images.push(imagefile);

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(filename, buffer);
    timeStamp1 += 60000;
    console.log(timeStamp1);
    utimes(filepath, timeStamp1);

    // fs.utimes(filepath, timeStamp1, timeStamp1, () => {
    //   // Get the stats object of the file
    //   console.log("\nDetails after changing time:");

    //   // Get the stats object of the file
    //   changedStats = fs.statSync(filename);

    //   // Access the changed modified and
    //   // access time of the file
    //   console.log("Changed Modification Time:", changedStats.mtime);

    //   console.log("Changed Access Time:", changedStats.atime);
    // });
  }
}

function zeroFill(number, width) {
  width -= number.toString().length;
  if (width > 0) {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join("0") + number;
  }
  return number + ""; // always return a string
}

function makevideo() {
  var videoOptions = {
    fps: 2,
    loop: 2.5, // seconds
    transition: false,
    // transitionDuration: 2.5, // seconds
    videoBitrate: 1024,
    videoCodec: "libx264",
    size: "640x?",
    audioBitrate: "128k",
    audioChannels: 2,
    format: "mp4",
    pixelFormat: "yuv420p",
  };

  videoshow(images, videoOptions)
    .save("video4.mp4")
    .on("start", function (command) {
      console.log("ffmpeg process started:", command);
    })
    .on("error", function (err, stdout, stderr) {
      console.error("Error:", err);
      console.error("ffmpeg stderr:", stderr);
    })
    .on("end", function (output) {
      console.error("Video created in:", output);
    });
}
