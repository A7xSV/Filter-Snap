// DOM elements
const clearButton = document.getElementById('clear-button');
const photoFilter = document.getElementById('photo-filter');
const takePhoto   = document.getElementById('take-photo');
const video       = document.getElementById('video');
const canvas      = document.getElementById('canvas');
const photos      = document.getElementById('photos');

// Global variables
var streaming     = false;
var width         = 500;
var height        = 0;
var filter        = 'none';

// Get media stream
navigator.mediaDevices.getUserMedia({video: true, audio: false})
  .then(function(stream) {
    // Link to the video source
    video.srcObject = stream;

    // Play the video
    video.play();
  })
  .catch(function(err) {
    console.log(`Error ${err}`);
  });

// Play when ready
video.addEventListener('canplay', function(e) {
  if (!streaming) {
    // Set video/canvas height
    height = video.videoHeight / (video.videoWidth / width);

    video.setAttribute('height', height);
    video.setAttribute('width', width);
    
    canvas.setAttribute('height', height);
    canvas.setAttribute('width', width);

    streaming = true;
  }
}, false);

// On take photo button click
takePhoto.addEventListener('click', function(e) {
  takePicture();
  e.preventDefault();
}, false);

// On filter select
photoFilter.addEventListener('change', function(e) {
  // Set selected filter
  filter = e.target.value;

  // Apply the filter to the video
  video.style.filter = filter;
  e.preventDefault();
});

// On clear button click
clearButton.addEventListener('click', function() {
  // Clear all existing photos
  photos.innerHTML = '';
  
  // Reset filter
  filter = 'none';
  video.style.filter = filter;
  photoFilter.selectedIndex = 0;
});

// Get the picture on canvas to then extract the URL and create an img element from it
function takePicture() {
  // Create canvas
  const context = canvas.getContext('2d');
  if (width && height) {
    // Set canvas properties
    canvas.height = height;
    canvas.width  = width;

    // Draw an image of the video on the canvas
    context.drawImage(video, 0, 0, width, height);

    // Create an image from the canvas
    const imageUrl = canvas.toDataURL('image/png');

    // Create a new img element
    const img = document.createElement('img');

    // Set the image source to data URL
    img.setAttribute('src', imageUrl);

    // Set image filter
    img.style.filter = filter;

    // Add image to photos div
    photos.appendChild(img);
  }
}