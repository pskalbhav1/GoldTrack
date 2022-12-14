    const URL = "https://teachablemachine.withgoogle.com/models/wuCrh1aHB/";
    const URLx = "https://teachablemachine.withgoogle.com/train/image/1R2tb3BU5q9VYq7_gqhOfrgdG7CTMWr5l";
    let model, webcam, labelContainer, maxPredictions, pprediction;
    console.log(URLx);

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);

        pprediction = prediction;
        const count_value = new Array(maxPredictions).fill(0);
        for (let i = 0; i < maxPredictions; i++) {
            if (prediction[i].probability.toFixed(2) > 0.5)
            {
                count_value[i]=count_value[i]+1;
            }
        }
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                "Name:" + prediction[i].className + ", Prediction: " + prediction[i].probability.toFixed(2) +", Quantity: "+ count_value[i] + " ";
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
        // drawResult(prediction);
    }

    function showPosition() {
      if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
              var positionInfo = "Your current position is (" + "Latitude: " + position.coords.latitude + ", " + "Longitude: " + position.coords.longitude + ")";
              
                 const x = position.coords.latitude.toFixed(0);
                 const y = position.coords.longitude.toFixed(0);
                 const w = 5;
                 const h = 5;
                 const x2 = position.coords.latitude.toFixed(0);
                 const y2 = position.coords.longitude.toFixed(0);
                 const w2 = 10;
                 const h2 = 10;
                   const a = (x + w / 2) - (x2 + w2 / 2);
                   const b = (y + h / 2) - (y2 + h2 / 2);
                   const distance = Math.sqrt(a*a + b*b);
                   console.log(distance);
                
                 document.getElementById("result").innerHTML = positionInfo + ", Distance:" +distance;
          });
      } else {
          alert("Sorry, your browser does not support HTML5 geolocation.");
      }
  }

function drawResult(object) {
  drawBoundingBox(object);
  drawLabel(object);
}



// draw bounding box around the detected object
function drawBoundingBox(object) {
  // Sets the color used to draw lines.
  stroke('green');
  // width of the stroke
  strokeWeight(4);
  // Disables filling geometry
  noFill();
  // draw an rectangle
  // x and y are the coordinates of upper-left corner, followed by width and height
  rect(object.x, object.y, object.width, object.height);
}

// draw label of the detected object (inside the box)
function drawLabel(object) {
  // Disables drawing the stroke
  noStroke();
  // sets the color used to fill shapes
  fill('white');
  // set font size
  textSize(24);
  // draw string to canvas
  text(object.label, object.x + 10, object.y + 24);
}


    // Classifier Variable
  let classifier;
  // Model URL
  let imageModelURL = 'https://teachablemachine.withgoogle.com/models/4LF8PNt2i/';
  
  // Video
  let video;
  let flippedVideo;
  // To store the classification
  let label = "";

  // Load the model first
  function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  }

  function setup() {
    createCanvas(320, 260);
    // Create the video
    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();

    flippedVideo = ml5.flipImage(video);
    // Start classifying
    classifyVideo();
  }

  function draw() {
    background(0);
    // Draw the video
    image(flippedVideo, 0, 0);

    // Draw the label
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text(label, width / 2, height - 4);
    drawResult(prediction);
  }

  // Get a prediction for the current video frame
  function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
    flippedVideo.remove();

  }

  // When we get a result
  function gotResult(error, results) {
    // If there is an error
    if (error) {
      console.error(error);
      return;
    }
    // The results are in an array ordered by confidence.
    console.log(results[0]);
    label = results[0].label;
    // Classifiy again!
    classifyVideo();
  }

  