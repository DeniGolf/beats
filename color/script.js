//Global selections and vars
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll(`input[type="range"]`);
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustBtn = document.querySelectorAll(".adjust");
const lockBtn = document.querySelectorAll(".lock");
const closeAdjustmentsBtn = document.querySelectorAll(".close-adjustment");
const sldierContainers = document.querySelectorAll(".sliders");
let initialColors;
//Local Storage
let savedPalettes = [];

let keyEvent = (event) => {
  if (event.keyCode === 32) {
    randomColors();
  }
  if (event.keyCode === 49) {
    const target = document.querySelectorAll(".lock")[0];
    const lockSVG = target.children[0];
    const activeBg = colorDivs[0];
    activeBg.classList.toggle("locked");
    if (lockSVG.classList.contains("fa-lock-open")) {
      target.innerHTML = '<i class="fas fa-lock"></i>';
    } else {
      target.innerHTML = '<i class="fas fa-lock-open"></i>';
    }
  }
  if (event.keyCode === 50) {
    const target = document.querySelectorAll(".lock")[1];
    const lockSVG = target.children[0];
    const activeBg = colorDivs[1];
    activeBg.classList.toggle("locked");
    if (lockSVG.classList.contains("fa-lock-open")) {
      target.innerHTML = '<i class="fas fa-lock"></i>';
    } else {
      target.innerHTML = '<i class="fas fa-lock-open"></i>';
    }
  }
  if (event.keyCode === 51) {
    const target = document.querySelectorAll(".lock")[2];
    const lockSVG = target.children[0];
    const activeBg = colorDivs[2];
    activeBg.classList.toggle("locked");
    if (lockSVG.classList.contains("fa-lock-open")) {
      target.innerHTML = '<i class="fas fa-lock"></i>';
    } else {
      target.innerHTML = '<i class="fas fa-lock-open"></i>';
    }
  }
  if (event.keyCode === 52) {
    const target = document.querySelectorAll(".lock")[3];
    const lockSVG = target.children[0];
    const activeBg = colorDivs[3];
    activeBg.classList.toggle("locked");
    if (lockSVG.classList.contains("fa-lock-open")) {
      target.innerHTML = '<i class="fas fa-lock"></i>';
    } else {
      target.innerHTML = '<i class="fas fa-lock-open"></i>';
    }
  }
  if (event.keyCode === 53) {
    const target = document.querySelectorAll(".lock")[4];
    const lockSVG = target.children[0];
    const activeBg = colorDivs[4];
    activeBg.classList.toggle("locked");
    if (lockSVG.classList.contains("fa-lock-open")) {
      target.innerHTML = '<i class="fas fa-lock"></i>';
    } else {
      target.innerHTML = '<i class="fas fa-lock-open"></i>';
    }
  }
};

//Event listeners
document.addEventListener("keyup", keyEvent);
generateBtn.addEventListener("click", randomColors);

sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

// colorDivs.forEach((div, index) => {
//   div.addEventListener("change", () => {
//     updateTextUI(index);
//   });
// });

currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClip(hex);
  });
});

popup.addEventListener("transitionend", () => {
  const popupBox = popup.children[0];
  popupBox.classList.remove("active");
  popup.classList.remove("active");
});

adjustBtn.forEach((button, index) => {
  button.addEventListener("click", () => {
    openAdjustmentPanel(index);
  });
});

closeAdjustmentsBtn.forEach((button, index) => {
  button.addEventListener("click", () => {
    closeAdjustmentPanel(index);
  });
});

lockBtn.forEach((button, index) => {
  button.addEventListener("click", (event) => {
    lockLayer(event, index);
  });
});

//Fucntions

//Color Generator
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
  // const letters = "#0123456789ABCDEF";
  // let hash = "#";
  // for (let i = 0; i < 6; i++) {
  //   hash += letters[Math.floor(Math.random() * 16)];
  // }
  // return hash;
}

function randomColors() {
  //Initial colors
  initialColors = [];
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    //Add color to the array
    if (div.classList.contains("locked")) {
      initialColors.push(hexText.innerText);
      return;
    } else {
      initialColors.push(chroma(randomColor).hex());
    }
    //Add the color to the bg
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    //Check for contrast
    checkTextContrast(randomColor, hexText);
    //Initial Colorize Sliders
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll('input[type="range"]');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    colorizeSliders(color, hue, brightness, saturation);
  });
  //Reset inputs
  resetInputs();
  //Check for button contrast
  adjustBtn.forEach((button, index) => {
    checkTextContrast(initialColors[index], button);
    checkTextContrast(initialColors[index], lockBtn[index]);
  });
}

function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function colorizeSliders(color, hue, brightness, saturation) {
  //Scale Saturation
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);
  //Scale Brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);
  //Update input colors
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
    0
  )}, ${scaleSat(1)})`;
  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
    0
  )}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
  hue.style.backgroundImage =
    "linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204, 75, 75))";
}

function hslControls(event) {
  const index =
    event.target.getAttribute("data-hue") ||
    event.target.getAttribute("data-bright") ||
    event.target.getAttribute("data-sat");
  let sliders = event.target.parentElement.querySelectorAll(
    'input[type="range"]'
  );
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const bgColor = initialColors[index];

  let color = chroma(bgColor)
    .set("hsl.h", hue.value)
    .set("hsl.l", brightness.value)
    .set("hsl.s", saturation.value);
  colorDivs[index].style.backgroundColor = color;
  colorizeSliders(color, hue, brightness, saturation);
  //Check for button contrast
  checkTextContrast(color, adjustBtn[index]);
  checkTextContrast(color, lockBtn[index]);
  updateTextUI(index);
}

function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  textHex.innerText = color.hex();
  //Check Contrast
  checkTextContrast(color, textHex);
  for (icon of icons) {
    checkTextContrast(color, icon);
  }
}

function resetInputs() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "brightness") {
      const brightColor = initialColors[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }
    if (slider.name === "saturation") {
      const satColor = initialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}

function copyToClip(hex) {
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  const popupBox = popup.children[0];
  popup.classList.add("active");
  popupBox.classList.add("active");
}

function hideLockButton(index) {
  if (sldierContainers[index].classList.contains("active")) {
    lockBtn[index].style.opacity = "0";
  } else {
    lockBtn[index].style.opacity = "1";
  }
}
function openAdjustmentPanel(index) {
  sldierContainers[index].classList.toggle("active");
  hideLockButton(index);
}
function closeAdjustmentPanel(index) {
  sldierContainers[index].classList.remove("active");
  hideLockButton(index);
}

function lockLayer(event, index) {
  const lockSVG = event.target.children[0];
  const activeBg = colorDivs[index];
  activeBg.classList.toggle("locked");

  if (lockSVG.classList.contains("fa-lock-open")) {
    event.target.innerHTML = '<i class="fas fa-lock"></i>';
  } else {
    event.target.innerHTML = '<i class="fas fa-lock-open"></i>';
  }
}

//Save to palette and Local Storage
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".close-library");

//Event listeners
saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
submitSave.addEventListener("click", savePalette);
libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);

//Functions

function openPalette(event) {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("active");
  popup.classList.add("active");
  document.removeEventListener("keyup", keyEvent);
  document.addEventListener("keydown", (event) => {
    if (event.keyCode === 27) {
      closePalette();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (saveInput.value === "") {
      return;
    }
    if (event.keyCode === 13) {
      savePalette();
    }
  });
}

function closePalette() {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
  document.addEventListener("keyup", keyEvent);
}

function savePalette() {
  const popup = saveContainer.children[0];
  const name = saveInput.value;
  const colors = [];
  if (name === "") {
    return;
  } else {
    saveContainer.classList.remove("active");
    popup.classList.remove("active");
    currentHexes.forEach((hex) => {
      colors.push(hex.innerText);
    });
    //Generate Object
    let paletteNr;
    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
    if (paletteObjects) {
      paletteNr = paletteObjects.length;
    } else {
      paletteNr = savedPalettes.length;
    }
    const paletteObj = { name, colors, nr: paletteNr };
    savedPalettes.push(paletteObj);
    //Save to Local Storage
    saveToLocal(paletteObj);
    saveInput.value = "";
    document.addEventListener("keyup", keyEvent);
    //Generate the palette for library
    const palette = document.createElement("div");
    palette.classList.add("custom-palette");
    const title = document.createElement("h4");
    title.innerText = paletteObj.name;
    const preview = document.createElement("div");
    preview.classList.add("small-preview");
    paletteObj.colors.forEach((smallColor) => {
      const smallDiv = document.createElement("div");
      smallDiv.style.backgroundColor = smallColor;
      preview.appendChild(smallDiv);
    });
    const paletteBtn = document.createElement("button");
    paletteBtn.classList.add("pick-palette-btn");
    paletteBtn.classList.add(paletteObj.nr);
    paletteBtn.innerText = "Select";
    //Attach event to the btn
    paletteBtn.addEventListener("click", (event) => {
      closeLibrary();
      const paletteIndex = event.target.classList[1];
      initialColors = [];
      savedPalettes[paletteIndex].colors.forEach((color, index) => {
        initialColors.push(color);
        colorDivs[index].style.backgroundColor = color;
        const text = colorDivs[index].children[0];
        checkTextContrast(color, text);
        updateTextUI(index);
      });

      resetInputs();
    });
    //Append to library
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);
    libraryContainer.children[0].appendChild(palette);
  }
}

function openLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("active");
  popup.classList.add("active");
  document.removeEventListener("keyup", keyEvent);
  document.addEventListener("keydown", (event) => {
    if (event.keyCode === 27) {
      closeLibrary();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (saveInput.value === "") {
      return;
    }
    if (event.keyCode === 13) {
      savePalette();
    }
  });
}

function closeLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
  document.addEventListener("keyup", keyEvent);
}

function saveToLocal(paletteObj) {
  let localPalettes;
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }
  localPalettes.push(paletteObj);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function getLocal() {
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
    savedPalettes = [...paletteObjects];
    paletteObjects.forEach((paletteObj) => {
      //Generate the palette for library
      const palette = document.createElement("div");
      palette.classList.add("custom-palette");
      const title = document.createElement("h4");
      title.innerText = paletteObj.name;
      const preview = document.createElement("div");
      preview.classList.add("small-preview");
      paletteObj.colors.forEach((smallColor) => {
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv);
      });
      const paletteBtn = document.createElement("button");
      paletteBtn.classList.add("pick-palette-btn");
      paletteBtn.classList.add(paletteObj.nr);
      paletteBtn.innerText = "Select";
      //Attach event to the btn
      paletteBtn.addEventListener("click", (event) => {
        closeLibrary();
        const paletteIndex = event.target.classList[1];
        initialColors = [];
        paletteObjects[paletteIndex].colors.forEach((color, index) => {
          initialColors.push(color);
          colorDivs[index].style.backgroundColor = color;
          const text = colorDivs[index].children[0];
          checkTextContrast(color, text);
          updateTextUI(index);
        });

        resetInputs();
      });
      //Append to library
      palette.appendChild(title);
      palette.appendChild(preview);
      palette.appendChild(paletteBtn);
      libraryContainer.children[0].appendChild(palette);
    });
  }
}

getLocal();
randomColors();
