$("button.encode, button.decode").click(function (event) {
  event.preventDefault();
});

// Event listener for the Download Button for Encode Image
$("#downloadButton").click(function () {
  var canvas = document.querySelector(".message canvas");
  var image = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  var link = document.createElement("a");
  link.download = "EncodedImage.png";
  link.href = image;
  link.click();
});

/* This function grabs the input file with name attribute "decodeFile" and gets the first selected element.
   Next, it calls the previewImage() function to read the contents of the file and render them in a canvas element with "decode canvas" class.
   Lastly, it uses jQuery to fade-in the element with "decode" class once the image is rendered.
*/
function previewDecodeImage() {
  var file = document.querySelector("input[name=decodeFile]").files[0];

  previewImage(file, ".decode canvas", function () {
    $(".decode").fadeIn();
  });
}

/*
   This function hides any existing message and nulled images by targeting the elements with "images", ".nulled" and ".message" classes respectively.
   Then, it retrieves the uploaded file using the "baseFile" name attribute.
   It calls previewImage() function to render the contents of the file in an original canvas with ".original canvas" class.
   Once that is done, it uses jQuery to fade-in both the container with "original" class and the element with "images" class.
*/
function previewEncodeImage() {
  var file = document.querySelector("input[name=baseFile]").files[0];

  $(".images .nulled").hide();
  $(".images .message").hide();

  previewImage(file, ".original canvas", function () {
    $(".images .original").fadeIn();
    $(".images").fadeIn();
  });
}

/*
   This function takes three arguments:
   "file" is the uploaded file whose contents need to be previewed.
   "canvasSelector" specifies the canvas element where the file will be rendered.
   "callback" is a function called after the file has been read and rendered, in this case it fades-in the element with "decode" class or container with "images" class.
   A new FileReader object is created to read the contents of the file passed into the function.
   An Image object is instantiated and assigned to the source of the reader object upon load.
   Callback is fired afterwards with an updated canvas element.
*/
function previewImage(file, canvasSelector, callback) {
  var reader = new FileReader();
  var image = new Image();
  var $canvas = $(canvasSelector);
  var context = $canvas[0].getContext("2d");

  if (file) {
    reader.readAsDataURL(file);
  }

  reader.onloadend = function () {
    image.src = URL.createObjectURL(file);

    image.onload = function () {
      $canvas.prop({
        width: image.width,
        height: image.height,
      });

      context.drawImage(image, 0, 0);

      callback();
    };
  };
}

/*
   First, any error message and binary string plots are hidden by targeting elements with ".error" and ".binary" classes, respectively.
   A text area element with "message" class is selected and its value is stored in a variable called "text".
   Elements with ".original canvas", ".nulled canvas" and ".message canvas" classes are then captured using jQuery and stored in relevant variables.
   The width and height dimensions of the original image is determined, and if it is too small to contain the message, an error message is displayed.
   Otherwise, the original image's pixel data is extracted and iterated over, then modified to nullify all odd-valued pixels.
   The text message provided by the user is broken down into an encoded binary string and plotted in the nulled canvas element.
   Lastly, the binary string is exposed to provide a clearer visualization by fading-in the element with ".binary" class along with elements with ".nulled" and ".message" classes.
*/
function encodeMessage() {
  $(".error").hide();
  $(".binary").hide();

  var text = $("textarea.message").val();

  var $originalCanvas = $(".original canvas");
  var $nulledCanvas = $(".nulled canvas");
  var $messageCanvas = $(".message canvas");

  var originalContext = $originalCanvas[0].getContext("2d");
  var nulledContext = $nulledCanvas[0].getContext("2d");
  var messageContext = $messageCanvas[0].getContext("2d");

  var width = $originalCanvas[0].width;
  var height = $originalCanvas[0].height;

  // Check if the image is big enough to hide the message
  if (text.length * 8 > width * height * 3) {
    $(".error").text("Text too long for chosen image....").fadeIn();

    return;
  }

  $nulledCanvas.prop({
    width: width,
    height: height,
  });

  $messageCanvas.prop({
    width: width,
    height: height,
  });

  // Normalize the original image and draw it
  var original = originalContext.getImageData(0, 0, width, height);
  var pixel = original.data;
  for (var i = 0, n = pixel.length; i < n; i += 4) {
    for (var offset = 0; offset < 3; offset++) {
      if (pixel[i + offset] % 2 != 0) {
        pixel[i + offset]--;
      }
    }
  }
  nulledContext.putImageData(original, 0, 0);

  // Convert the message to a binary string
  var binaryMessage = "";
  for (i = 0; i < text.length; i++) {
    var binaryChar = text[i].charCodeAt(0).toString(2);

    // Pad with 0 until the binaryChar has a lenght of 8 (1 Byte)
    while (binaryChar.length < 8) {
      binaryChar = "0" + binaryChar;
    }

    binaryMessage += binaryChar;
  }
  $(".binary textarea").text(binaryMessage);

  // Apply the binary string to the image and draw it
  var message = nulledContext.getImageData(0, 0, width, height);
  pixel = message.data;
  counter = 0;
  for (var i = 0, n = pixel.length; i < n; i += 4) {
    for (var offset = 0; offset < 3; offset++) {
      if (counter < binaryMessage.length) {
        pixel[i + offset] += parseInt(binaryMessage[counter]);
        counter++;
      } else {
        break;
      }
    }
  }
  messageContext.putImageData(message, 0, 0);

  $(".binary").fadeIn();
  $(".images .nulled").fadeIn();
  $(".images .message").fadeIn();
  $("#downloadButton").removeClass("hiddenDownloadButton");
}

/*
   In this function, an element with ".decode canvas" class is first selected using jQuery.
   The pixel data of this decoded canvas is then examined and looped over in order to retrieve any message encoded within.
   The extracted binary string is converted back into a human-readable message and displayed on screen by targeting an element with ".binary-decode textarea" class.
*/
function decodeMessage() {
  var $originalCanvas = $(".decode canvas");
  var originalContext = $originalCanvas[0].getContext("2d");

  var original = originalContext.getImageData(
    0,
    0,
    $originalCanvas.width(),
    $originalCanvas.height()
  );
  var binaryMessage = "";
  var pixel = original.data;
  for (var i = 0, n = pixel.length; i < n; i += 4) {
    for (var offset = 0; offset < 3; offset++) {
      var value = 0;
      if (pixel[i + offset] % 2 != 0) {
        value = 1;
      }

      binaryMessage += value;
    }
  }

  var output = "";
  for (var i = 0; i < binaryMessage.length; i += 8) {
    var c = 0;
    for (var j = 0; j < 8; j++) {
      c <<= 1;
      c |= parseInt(binaryMessage[i + j]);
    }

    output += String.fromCharCode(c);
  }

  $(".binary-decode textarea").text(output);
  $(".binary-decode").fadeIn();
}
