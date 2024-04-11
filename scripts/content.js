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

const whitescroll = (elem, observer) => {
  elem.style.color = "#ffffff"
  yPos = elem.getBoundingClientRect().y;
  let observerPos = observer.getBoundingClientRect().y;
  const delta = yPos - observerPos;
  console.log(delta)
  if (delta > 0) {
      document.querySelector(".lyrics").scrollTop += delta;
  }
}

let lyricsElem;
let curr_elem;
const scrollLyrics = (lyrics, observer) => {
  setInterval(() => {
    child = lyrics.children;
    for (const lyric in child) {
      if (Object.hasOwnProperty.call(child, lyric)) {
        const element = child[lyric];
        if (parseInt(element.dataset.time) <= time) {
          curr_elem = element;
        } else if (curr_elem === undefined) {
          break;
        } else {
          whitescroll(curr_elem, observer);
          // curr_elem.style.color = "#ffffff";
          // let lyricPos = curr_elem.getBoundingClientRect().y;
          // let observerPos = observer.getBoundingClientRect().y;
          // const delta = lyricPos - observerPos;
          // if (delta > 0) {
          //   document.querySelector(".lyrics").scrollTop += delta;
          // }
          break;
        }
      }
    }
  }, 1000);
};

const injectLyrics = async () => {
  lyricsElem = await findElement(".main-view-container");

  const response = await fetch("https://lyrically-proxy.vercel.app/", {
    method: "POST",
    body: JSON.stringify({
      query: artistName + currentSong,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  lyricsElem.innerHTML = "";
  Object.assign(lyricsElem.style, {
    background: "crimson",
    position: "relative",
  });
  const observer = document.createElement("div");
  Object.assign(observer.style, {
    width: "100px",
    height: "100px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  });
  lyricsElem.appendChild(observer);
  const lyrics = document.createElement("div");
  Object.assign(lyrics.style, {
    overflowY: "auto",
    height: "100%",
    scrollBehavior: "smooth",
  });
  lyrics.classList.add("lyrics");

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key];
      let lyric = document.createElement("div");
      lyric.innerText = element.lyrics;
      lyric.setAttribute("data-time", element.seconds);
      Object.assign(lyric.style, {
        color: "#000000",
        textAlign: "center",
        padding: "5px 7px",
        fontSize: "2em",
      });
      lyrics.appendChild(lyric);
    }
  }
  lyricsElem.appendChild(lyrics);
  scrollLyrics(lyrics, observer);
};

let artistName;
let artistNameElem;

const getArtistName = async () => {
  artistNameElem = await findElement(
    '[data-testid="context-item-info-subtitles"]'
  );
  let temp = "";
  for (let i = 0; i < artistNameElem.children.length; i++) {
    temp += artistNameElem.children[i].innerText;
  }
  temp = temp.split(",");
  temp = temp.join("");
  temp = temp.replaceAll(" ", "%20");
  artistName = temp;
};

let songName;
let songNameElem;
let currentSong;

const myfunc = () => {
  const songNameObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      setSongName();
    });
  });

  const config = { childList: true, subtree: true };
  songNameObserver.observe(
    document.querySelector('[data-testid="now-playing-widget"]'),
    config
  );
};

const setSongName = async () => {
  songNameElem = await findElement('[data-testid="context-item-link"]');
  let temp = songNameElem.innerText;
  temp = temp.split("(")[0];
  temp = temp.split("{")[0];
  temp = temp.split("[")[0];
  temp = temp.replaceAll(" ", "%20");
  songName = temp;
  if (currentSong != songName) {
    currentSong = songName;
    await getArtistName();
    await injectLyrics();
  }
};

(async () => {
  try {
    songNameElem = await findElement('[data-testid="context-item-link"]');
    myfunc();
    setSongName();
  } catch (error) {
    console.error("Error finding element:", error);
  }
})();

//Finding current playback time
let timerElem;
let time;

(async () => {
  try {
    timerElem = await findElement(".playback-bar__progress-time-elapsed");
  } catch (error) {
    console.error("Error finding element:", error);
  }
})();

const setTimer = () => {
  setInterval(() => {
    let temp = timerElem.innerText;
    temp = temp.split(":");
    time = parseInt(temp[0]) * 60 + parseInt(temp[1]);
  }, 1000);
};

const findTimer = setInterval(() => {
  if (timerElem) {
    setTimer();
    clearInterval(findTimer);
  }
}, 1000);
