const findElement = (selector) => {
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
};

// Finding the lyrics element
let lyricsElem;

(async () => {
  try {
    lyricsElem = await findElement("#main"); // TODO: Find an unique identifer for the lyric element
    console.log("Element found:", lyricsElem);
  } catch (error) {
    console.error("Error finding element:", error);
  }
})();

const mytest = () => {
  console.log("hi"); //TODO: inject lyrics
};

const findMain = setInterval(() => {
  if (lyricsElem) {
    mytest(); 
    clearInterval(findMain);
  }
  console.log("findMain interval.");
}, 1000);


//Finding current playback time
let timerElem;
let time;

(async () => {
  try {
    timerElem = await findElement(".playback-bar__progress-time-elapsed");
    console.log("Element found:", timerElem);
  } catch (error) {
    console.error("Error finding element:", error);
  }
})();

const setTimer = () => {
  setInterval(() => {
    let temp = timerElem.innerText;
    temp = temp.split(":");
    time = temp[0] * 60 * 1000 + temp[1] * 1000; // Converting into milliseconds
    console.log(time);
  }, 1000);
};

const findTimer = setInterval(() => {
  if (timerElem) {
    setTimer();
    clearInterval(findTimer);
  }
  console.log("findTimer Interval");
}, 1000);


// Finding the song that's playing
let songNameElem;
let songName;

(async () => {
  try {
    songNameElem = await findElement('[data-testid="context-item-link"]');
  } catch (error) {
    console.error("Error finding element:", error);
  }
})();

const setSongName = () => {
  setInterval(async () => {
    let temp = songNameElem.innerText;
    temp = temp.split("(")[0];
    temp = temp.split("{")[0];
    temp = temp.split("[")[0];
    songName = temp;
    console.log(songName);
    try {
      songNameElem = await findElement('[data-testid="context-item-link"]');
    } catch (error) {
      console.error("Error finding element:", error);
    }
  }, 1000);
};

const findSongNameElem = setInterval(() => {
  if (songNameElem) {
    setSongName();
    clearInterval(findSongNameElem);
  }
  console.log("findSongNameElem Interval");
}, 1000);
