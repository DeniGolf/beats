class DrumKit {
  constructor() {
    this.pads = document.querySelectorAll(".pad");
    this.playButton = document.querySelector(".play");

    this.kickAudio0 = document.querySelector(".kick-sound-0");
    this.kickAudio1 = document.querySelector(".kick-sound-1");
    this.kickAudio2 = document.querySelector(".kick-sound-2");

    this.snareAudio0 = document.querySelector(".snare-sound-0");
    this.snareAudio1 = document.querySelector(".snare-sound-1");
    this.snareAudio2 = document.querySelector(".snare-sound-2");

    this.hihatAudio1 = document.querySelector(".hihat-sound-1");
    this.hihatAudio0 = document.querySelector(".hihat-sound-0");

    this.index = 0;
    this.bpm = 270;
    this.isPlaying = null;
    this.selects = document.querySelectorAll("select");
    this.muteButtons = document.querySelectorAll(".mute");
    this.clearButton = document.querySelector(".clear");
    this.tempoSlider = document.querySelector(".tempo-slider");
    this.duplicateButtons = document.querySelectorAll(".duplicate-track");
  }
  activePad() {
    this.classList.toggle("active");
  }
  repeat() {
    let step = this.index % 13;
    const activeBars = document.querySelectorAll(`.b${step}`);
    //Loop over the pads
    activeBars.forEach((bar) => {
      bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
      //Check if pads are active
      if (bar.classList.contains("active")) {
        //Check each sound
        if (bar.classList.contains("pads0-0")) {
          this.kickAudio0.currentTime = 0;
          this.kickAudio0.play();
        }
        if (bar.classList.contains("pads0-1")) {
          this.kickAudio1.currentTime = 0;
          this.kickAudio1.play();
        }
        if (bar.classList.contains("pads0-2")) {
          this.kickAudio2.currentTime = 0;
          this.kickAudio2.play();
        }
        //Check each sound
        if (bar.classList.contains("pads1-0")) {
          this.snareAudio0.currentTime = 0;
          this.snareAudio0.play();
        }
        if (bar.classList.contains("pads1-1")) {
          this.snareAudio1.currentTime = 0;
          this.snareAudio1.play();
        }
        if (bar.classList.contains("pads1-2")) {
          this.snareAudio2.currentTime = 0;
          this.snareAudio2.play();
        }
        //Check each sound
        if (bar.classList.contains("pads2-0")) {
          this.hihatAudio0.currentTime = 0;
          this.hihatAudio0.play();
        }
        if (bar.classList.contains("pads2-1")) {
          this.hihatAudio1.currentTime = 0;
          this.hihatAudio1.play();
        }
      }
    });
    this.index++;
  }
  start() {
    const interval = (60 / this.bpm) * 1000;
    //Check if it's playing
    if (!this.isPlaying) {
      this.isPlaying = setInterval(() => {
        this.repeat();
      }, interval);
    } else {
      clearInterval(this.isPlaying);
      this.isPlaying = null;
    }
  }
  updateButton() {
    if (!this.isPlaying) {
      this.playButton.innerText = "Pause";
      this.playButton.classList.add("active");
    } else {
      this.playButton.innerText = "Play";
      this.playButton.classList.remove("active");
    }
  }
  changeSound(event) {
    const selectionName = event.target.name;
    const selectionValue = event.target.value;
    switch (selectionName) {
      case "kick-select-0":
        this.kickAudio0.src = selectionValue;
        break;
      case "kick-select-1":
        this.kickAudio1.src = selectionValue;
        break;
      case "kick-select-2":
        this.kickAudio2.src = selectionValue;
        break;
      case "snare-select-0":
        this.snareAudio0.src = selectionValue;
        break;
      case "snare-select-1":
        this.snareAudio1.src = selectionValue;
        break;
      case "snare-select-2":
        this.snareAudio2.src = selectionValue;
        break;
      case "hihat-select-0":
        this.hihatAudio0.src = selectionValue;
        break;
      case "hihat-select-1":
        this.hihatAudio1.src = selectionValue;
        break;
    }
  }
  mute(event) {
    const muteIndex = event.target.getAttribute("data-track");
    console.log(muteIndex);
    event.target.classList.toggle("active");
    if (event.target.classList.contains("active")) {
      switch (muteIndex) {
        case "0-0":
          this.kickAudio0.volume = 0;
          break;
        case "0-1":
          this.kickAudio1.volume = 0;
          break;
        case "0-2":
          this.kickAudio2.volume = 0;
          break;
        case "1-0":
          this.snareAudio0.volume = 0;
          break;
        case "1-1":
          this.snareAudio1.volume = 0;
          break;
        case "1-2":
          this.snareAudio2.volume = 0;
          break;
        case "2-0":
          this.hihatAudio0.volume = 0;
          break;
        case "2-1":
          this.hihatAudio1.volume = 0;
          break;
      }
    } else {
      switch (muteIndex) {
        case "0-0":
          this.kickAudio0.volume = 1;
          break;
        case "0-1":
          this.kickAudio1.volume = 1;
          break;
        case "0-2":
          this.kickAudio2.volume = 1;
          break;
        case "1-0":
          this.snareAudio0.volume = 1;
          break;
        case "1-1":
          this.snareAudio1.volume = 1;
          break;
        case "1-2":
          this.snareAudio2.volume = 1;
          break;
        case "2-0":
          this.hihatAudio0.volume = 1;
          break;
        case "2-1":
          this.hihatAudio1.volume = 1;
          break;
      }
    }
  }
  clearActive() {
    this.pads.forEach((pad) => {
      if (pad.classList.contains("active")) {
        pad.classList.remove("active");
      }
    });
  }
  // duplicateTrack(event) {
  //   const currentTrackData = event.target.getAttribute("data-track");
  //   const currentTrack = document.querySelector(`.track-${currentTrackData}`);
  //   const copiedTrack = currentTrack.cloneNode(true);
  //   const sequencer = document.getElementsByClassName("sequencer")[0];

  //   switch (currentTrackData) {
  //     case "0":
  //       copiedTrack.classList.add(`kick-copy-${this.inititial0}`);
  //       copiedTrack.children[0].style.opacity = "0";
  //       copiedTrack.children[2].style.opacity = "0";
  //       sequencer.insertBefore(
  //         copiedTrack,
  //         document.querySelector(`.track-${+currentTrackData + 1}`)
  //       );

  //       this.inititial0++;
  //       break;

  //     case "1":
  //       copiedTrack.classList.add(`copy-${this.inititial1}`);
  //       copiedTrack.children[0].style.opacity = "0";
  //       copiedTrack.children[2].style.opacity = "0";

  //       sequencer.insertBefore(
  //         copiedTrack,
  //         document.querySelector(`.track-${+currentTrackData + 1}`)
  //       );
  //       this.inititial1++;
  //       break;
  //     case "2":
  //       copiedTrack.classList.add(`copy-${this.inititial2}`);
  //       copiedTrack.children[0].style.opacity = "0";
  //       copiedTrack.children[2].style.opacity = "0";

  //       sequencer.insertBefore(copiedTrack, document.querySelector(`.play`));
  //       this.inititial2++;
  //       break;
  //   }
  //   const pads = document.querySelectorAll(".pad");

  //   pads.forEach((pad) => {
  //     pad.addEventListener("click", this.activePad);
  //     pad.addEventListener("animationend", function () {
  //       this.style.animation = "";
  //     });
  //   });

  //   console.log();
  // }
  changeTempo(event) {
    const tempoText = document.querySelector(".tempo-nr");
    const slider = document.querySelector("input");
    tempoText.innerText = event.target.value;
    if (+event.target.value > 450) {
      slider.className = `tempo-slider red`;
    } else if (+event.target.value === 20) {
      slider.className = `tempo-slider zero`;
    } else if (+event.target.value > 270) {
      slider.className = `tempo-slider pink`;
    } else {
      slider.className = `tempo-slider blue`;
    }
  }
  updateTempo(event) {
    this.bpm = event.target.value;
    clearInterval(this.isPlaying);
    this.isPlaying = null;
    if (this.playButton.classList.contains("active")) {
      this.start();
    }
  }
}

const drumKit = new DrumKit();

//Event Listeners
drumKit.pads.forEach((pad) => {
  pad.addEventListener("click", drumKit.activePad);
  pad.addEventListener("animationend", function () {
    this.style.animation = "";
  });
});

drumKit.playButton.addEventListener("click", function () {
  drumKit.updateButton();
  drumKit.start();
});

drumKit.selects.forEach((select) => {
  select.addEventListener("change", function (event) {
    drumKit.changeSound(event);
  });
});

drumKit.muteButtons.forEach((button) => {
  button.addEventListener("click", function (event) {
    drumKit.mute(event);
  });
});

drumKit.duplicateButtons.forEach((button) => {
  button.addEventListener("click", function (event) {
    drumKit.duplicateTrack(event);
  });
});

drumKit.tempoSlider.addEventListener("input", function (event) {
  drumKit.changeTempo(event);
});

drumKit.tempoSlider.addEventListener("change", function (event) {
  drumKit.updateTempo(event);
});

drumKit.clearButton.addEventListener("click", function (event) {
  drumKit.clearActive();
});
