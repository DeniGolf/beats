const tag = document.createElement("script");
const playBtn = document.querySelector("#playBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const runOffBtn = document.querySelector("#runOffBtn");
const runOffInput = document.querySelector("#runOffInput");
const phoneInput = document.querySelector("#phoneInput");
const nameInput = document.querySelector("#nameInput");
const statusMessage = document.querySelector("#statusMessage");

// Youtube API
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    videoId: "MPmyncxmsus",
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  playBtn.addEventListener("click", function () {
    player.playVideo();
  });

  pauseBtn.addEventListener("click", function () {
    player.pauseVideo();
  });

  runOffBtn.addEventListener("click", function () {
    let seconds = Number.isFinite(+runOffInput.value) ? +runOffInput.value : 0;
    player.pauseVideo();
    player.seekTo(seconds);
    player.playVideo();
  });
}

let done = false;

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    done = true;
  }
}

//Phone number mask
function doFormat(x, pattern, mask) {
  let strippedValue = x.replace(/[^0-9]/g, "");
  let chars = strippedValue.split("");
  let count = 0;

  let formatted = "";

  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (chars[count]) {
      if (/\*/.test(c)) {
        formatted += chars[count];
        count++;
      } else {
        formatted += c;
      }
    } else if (mask) {
      if (mask.split("")[i]) formatted += mask.split("")[i];
    }
  }
  return formatted;
}

phoneInput.addEventListener("focus", (e) => {
  function format(elem) {
    const val = doFormat(elem.value, elem.getAttribute("data-format"));
    elem.value = doFormat(
      elem.value,
      elem.getAttribute("data-format"),
      elem.getAttribute("data-mask")
    );

    if (elem.createTextRange) {
      let range = elem.createTextRange();
      range.move("character", val.length);
      range.select();
    } else if (elem.selectionStart) {
      if (val.length !== 0) {
        elem.setSelectionRange(val.length, val.length);
      }
    }
  }
  phoneInput.addEventListener("keyup", function () {
    format(phoneInput);
  });
  format(phoneInput);
});

// Google Maps API

let map;
function initMap() {
  const center = { lat: 50.490846593594256, lng: 30.50709543848514 };

  const markerPos1 = { lat: 50.50957728551686, lng: 30.650867465579285 };
  const markerPos2 = { lat: 50.49856013105758, lng: 30.392770694048842 };
  const markerPos3 = { lat: 50.42688596643492, lng: 30.45108786166534 };

  map = new google.maps.Map(document.getElementById("map"), {
    center,
    disableDefaultUI: true,
    zoom: 12,
  });

  const marker1 = new google.maps.Marker({
    position: markerPos1,
    map: map,
    icon: "img/marker-green.svg",
  });

  const marker2 = new google.maps.Marker({
    position: markerPos2,
    map: map,
    icon: "img/marker-orange.svg",
  });

  const marker3 = new google.maps.Marker({
    position: markerPos3,
    map: map,
    icon: "img/marker-orange.svg",
  });
}

// Google Sheets POST
const scriptURL =
  "https://script.google.com/macros/s/AKfycbwJUCQs_Xj3vOPgdzcLRiDlJCjFk2sPUHo044LZ3J236v1IosCVqBnc2gfIEAdEt1M-/exec";
const form = document.forms["google-sheet"];
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formInputValue = nameInput.value.trim();
  let submitted = false;
  let span = document.createElement("span");
  span.classList.add("span-message");
  span.innerHTML = "Form Submitting...";
  statusMessage.appendChild(span);

  if (formInputValue.length > 3) {
    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then((response) => {
        statusMessage.removeChild(span);

        span.classList.add("success-message");
        const link = document.createElement("a");
        link.setAttribute("target", "_blank");
        link.setAttribute(
          "href",
          "https://docs.google.com/spreadsheets/d/1lbf-QDdMA7Rcg0lvTuZp9xTlNxZzfoQEC9Jb_nJPiLM/edit?usp=sharing"
        );
        link.innerHTML = "Google Sheets";
        span.innerHTML = "Data has been sent to ";
        span.appendChild(link);
        statusMessage.appendChild(span);

        nameInput.value = "";
        phoneInput.value = "";

        setTimeout(() => statusMessage.removeChild(span), 8000);
      })
      .catch((error) => console.error("Error!", error.message));
  } else {
    statusMessage.removeChild(span);

    span.classList.add("error-message");
    span.innerHTML = "Your name must be at least <b>3</b> characters!";
    statusMessage.appendChild(span);

    nameInput.value = "";
    phoneInput.value = "";

    setTimeout(() => statusMessage.removeChild(span), 3000);
  }
});
