// 2. This code loads the IFrame Player API code asynchronously.
let tag = document.createElement('script');
let playBtn = document.querySelector("#playBtn");
let pauseBtn = document.querySelector("#pauseBtn");
let runOffBtn = document.querySelector("#runOffBtn");
let runOffInput = document.querySelector("#runOffInput");
const phoneInput = document.querySelector("#phoneInput");
const nameInput = document.querySelector("#nameInput");
const statusMessage = document.querySelector("#statusMessage");

// Youtube API
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
 

    videoId: 'MPmyncxmsus',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {

  playBtn.addEventListener("click", function() {
    player.playVideo();
  });
  

  pauseBtn.addEventListener("click", function() {
    player.pauseVideo();
  });

  runOffBtn.addEventListener("click", function() {
    let seconds = Number.isFinite(+runOffInput.value) ? +runOffInput.value : 0;
    player.pauseVideo();
    player.seekTo(seconds);
    player.playVideo();
  });
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),

var done = false;

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    done = true;
  }
}


//Phone number mask
Array.prototype.forEach.call(document.body.querySelectorAll("*[data-mask]"), applyDataMask);

function applyDataMask(field) {
    var mask = field.dataset.mask.split('');
    
    // For now, this just strips everything that's not a number
    function stripMask(maskedData) {
        function isDigit(char) {
            return /\d/.test(char);
        }
        return maskedData.split('').filter(isDigit);
    }
    
    // Replace `_` characters with characters from `data`
    function applyMask(data) {
        return mask.map(function(char) {
            if (char != '_') return char;
            if (data.length == 0) return char;
            return data.shift();
        }).join('')
    }
    
    function reapplyMask(data) {
        return applyMask(stripMask(data));
    }
    
    function changed() {   
        var oldStart = field.selectionStart;
        var oldEnd = field.selectionEnd;
        
        field.value = reapplyMask(field.value);
        
        field.selectionStart = oldStart;
        field.selectionEnd = oldEnd;
    }
    
    field.addEventListener('click', changed)
    field.addEventListener('keyup', changed)
}

let map;

// Google Maps API
function initMap() {
  const center = {lat: 50.490846593594256, lng: 30.50709543848514};

  const markerPos1 = {lat: 50.50957728551686, lng: 30.650867465579285};
  const markerPos2 = {lat:  50.49856013105758, lng: 30.392770694048842};
  const markerPos3 = {lat: 50.42688596643492, lng: 30.45108786166534};

  map = new google.maps.Map(document.getElementById("map"), {
    center,
    // disableDefaultUI: true,
    zoom: 12,
  });

  const marker1 = new google.maps.Marker({
    position: markerPos1,
    map: map,
    icon: "img/marker-green.svg"
  });

  const marker2 = new google.maps.Marker({
    position: markerPos2,
    map: map,
    icon: "img/marker-orange.svg"
  });

  const marker3 = new google.maps.Marker({
    position: markerPos3,
    map: map,
    icon: "img/marker-orange.svg"
  });
}

// Google Sheets POST
const scriptURL = 'https://script.google.com/macros/s/AKfycbwJUCQs_Xj3vOPgdzcLRiDlJCjFk2sPUHo044LZ3J236v1IosCVqBnc2gfIEAdEt1M-/exec'
  const form = document.forms['google-sheet']
  form.addEventListener('submit', e => {
    e.preventDefault()
    const formInputValue = nameInput.value.trim();
    let submitted = false;
    let span = document.createElement("span");
        span.classList.add("span-message");
        span.innerHTML= "Form Submitting...";
        statusMessage.appendChild(span);
    
    if(formInputValue.length > 3) {
      fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => {
        statusMessage.removeChild(span);

        span.classList.add("success-message");
        const link = document.createElement("a");
        link.setAttribute("target", "_blank");
        link.setAttribute("href", "https://docs.google.com/spreadsheets/d/1lbf-QDdMA7Rcg0lvTuZp9xTlNxZzfoQEC9Jb_nJPiLM/edit?usp=sharing");
        link.innerHTML = "Google Sheets";
        span.innerHTML= "Data has been sent to ";
        span.appendChild(link);
        statusMessage.appendChild(span);

        nameInput.value = "";
        phoneInput.value = "";

        setTimeout(() => statusMessage.removeChild(span), 8000);

      })
      .catch(error => console.error('Error!', error.message))
    } else {
      statusMessage.removeChild(span);


      span.classList.add("error-message");
      span.innerHTML= "Your name must be at least <b>3</b> characters!";
      statusMessage.appendChild(span);

      nameInput.value = "";
      phoneInput.value = "";
      
      setTimeout(() => statusMessage.removeChild(span), 3000);
    }
  })






