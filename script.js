var fileInput = document.getElementById('file-input');
var rotateLeft = document.getElementById('rotate-left');
var rotateRight = document.getElementById('rotate-right');
var saveButton = document.getElementById('save-button');
var canvas = document.getElementById('canvas');

var loadImage = function (file) {
  var img = document.createElement('img');
  var url = URL.createObjectURL(file);
  return new Promise(function(resolve, reject) {
    img.onload = resolve;
    img.src = url;
  }).then(function () {
    return img;
  });
};

var currentImage;
var orientation = 0;
var redrawImage = function () {
  if (!currentImage) {
    return;
  }
  width = currentImage.width;
  height = currentImage.height;
  if (orientation === 1 || orientation === 3) {
    canvas.width = height;
    canvas.height = width;
  } else {
    canvas.width = width;
    canvas.height = height;
  }
  var context = canvas.getContext('2d');
  if (orientation === 1) {
    context.transform(0, -1, 1, 0, 0, width);
  } else if (orientation === 2) {
    context.transform(-1, 0, 0, -1, width, height);
  } else if (orientation === 3) {
    context.transform(0, 1, -1, 0, height, 0);
  }
  context.drawImage(currentImage, 0, 0);
};

rotateLeft.addEventListener('click', function () {
  orientation = (orientation + 1) % 4;
  redrawImage();
});

rotateRight.addEventListener('click', function () {
  orientation = (orientation + 3) %4;
  redrawImage();
});

saveButton.addEventListener('click', function () {
  var format = 'jpg';
  new Promise(function (resolve, reject) {
    if (format === 'jpg') {
      canvas.toBlob(resolve, 'image/jpeg', 0.9);
    } else {
      canvas.toBlob(resolve, 'image/png');
    }
  }).then(function (blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = blob.name = 'file.' + format;
    a.click();
  });
});

fileInput.addEventListener('change', function (e) {
  if (fileInput.value) {
    loadImage(fileInput.files[0]).then(function (img) {
      currentImage = img;
      redrawImage();
    });
  }
});
