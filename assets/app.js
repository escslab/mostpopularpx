(function() {
  function init() {
    var imageLoader = document.getElementById("imageLoader");
    imageLoader.addEventListener("change", handleImage, false);
  }

  function handleImage(e) {
    var canvas = document.getElementById("imageCanvas");
    var ctx = canvas.getContext("2d");

    var reader = new FileReader();
    reader.onload = event => {
      var img = new Image();
      img.onload = () => {
        canvas.width = 200; //img.width;
        canvas.height = 200; //img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        mostPopularRank = analizeImage(imgData);

        console.log(mostPopularRank);

        render(mostPopularRank);
      };

      img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  function analizeImage(imgData) {
    let mapOfPopulariesResult = mapOfPopularies(imgData);
    let mostPopularRank = [];

    var isChecked = document.getElementById("removeSimilar").checked;

    let rankTotal = 5;
    for (let index = 0; index < rankTotal; index++) {
      let theMostPopular;
      if (isChecked) {
        theMostPopular = getTheMostPopular(
          mapOfPopulariesResult,
          mostPopularRank
        );
      } else {
        theMostPopular = getTheMostPopular(mapOfPopulariesResult);
      }

      mostPopularRank.push(theMostPopular);
      mapOfPopulariesResult.delete(theMostPopular[0]);
    }

    return mostPopularRank;
  }

  function mapOfPopularies(imgData) {
    let mapPopularies = new Map();
    for (let i = 0; i < imgData.data.length; i += 4) {
      let key = `${imgData.data[i]}, ${imgData.data[i + 1]}, ${
        imgData.data[i + 2]
      }`;
      if (mapPopularies.get(key)) {
        mapPopularies.set(key, mapPopularies.get(key) + 1);
      } else {
        mapPopularies.set(key, 1);
      }
    }
    return mapPopularies;
  }

  function getTheMostPopular(mapOfPopulariesResult, filterSimilarPixel) {
    let mostPopular = [...mapOfPopulariesResult.entries()].reduce((a, e) =>
      e[1] > a[1] && IsSimilarPixel(a[0], filterSimilarPixel) ? e : a
    );

    return mostPopular;
  }

  function IsSimilarPixel(pixelToCompareRgb, pixels) {
    if (!pixels) {
      return true;
    }

    pixelToCompareRgb = pixelToCompareRgb.split(", ");
    for (const pixel of pixels) {
      for (const pixelToCompare of pixelToCompareRgb) {
        let constains = pixel[0]
          .split(", ")
          .filter(value => pixelToCompare == value);
        if (constains.length > 0) {
          return true;
        }
      }
    }

    return false;
  }

  function render(mostPopularRank) {
    for (let index = 0; index < mostPopularRank.length; index++) {
      var elementRank = document.getElementById(`top-${index}`);
      elementRank.style.backgroundColor = `rgb(${mostPopularRank[index][0]})`;

      let [r, g, b] = mostPopularRank[index][0].split(", ");

      elementRank.querySelector(".value-hex").textContent = `#${fullColorHex(
        r,
        g,
        b
      )}`;
    }
  }

  var fullColorHex = function(r, g, b) {
    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);
    return red + green + blue;
  };

  var rgbToHex = function(rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex;
  };

  function invertColors(ctx, imgData) {
    for (i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = 255 - imgData.data[i];
      imgData.data[i + 1] = 255 - imgData.data[i + 1];
      imgData.data[i + 2] = 255 - imgData.data[i + 2];
      imgData.data[i + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
  }

  window.addEventListener("load", init);
})();
