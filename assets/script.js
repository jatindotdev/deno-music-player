const albumImg = document.getElementById("album-img");
const songName = document.getElementById("song-name");
const inputField = document.getElementById("input");
const searchButton = document.getElementById("search");
const audioPlayer = document.querySelector("audio");
const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => `Digit${value}`);

let searchQuery = "";

inputField.focus();

const handleSearch = async () => {
  if (searchQuery.length > 0) {
    const query = encodeURIComponent(searchQuery);
    const res = await fetch(`/search?query=${query}`);
    const data = await res.json();

    albumImg.src = data[0]["thumbnail"]["url"];
    songName.textContent = data[0]["title"];
    audioPlayer.src = `/play?query=${encodeURIComponent(data[0]["url"])}`;
    audioPlayer.play();
    inputField.value = "";
  }
};

document.addEventListener("keyup", async (event) => {
  if (event.code === "Escape") {
    inputField.blur();
  }

  if (document.activeElement !== inputField) {
    if (event.code === "Slash") {
      inputField.focus();
    }

    if (audioPlayer.duration) {
      if (digits.includes(event.code)) {
        audioPlayer.currentTime =
          (digits.indexOf(event.code) / 10) * audioPlayer.duration;
      }

      if (event.code === "ArrowRight") {
        if (audioPlayer.duration - (audioPlayer.currentTime + 10) < 0) return;
        audioPlayer.currentTime += 10;
      }

      if (event.code === "ArrowLeft") {
        if (audioPlayer.currentTime - 10 < 0) return;
        audioPlayer.currentTime -= 10;
      }
    }

    if (event.code === "Space") {
      try {
        if (audioPlayer.paused) {
          await audioPlayer.play();
        } else {
          audioPlayer.pause();
        }
      } catch {
        // No media
      }
    }
  }

  if (document.activeElement === inputField) {
    if (event.code === "Enter") {
      handleSearch();
    }
  }
});

inputField.addEventListener("input", (e) => {
  searchQuery = e.currentTarget.value.trim();
});

searchButton.addEventListener("click", handleSearch);
