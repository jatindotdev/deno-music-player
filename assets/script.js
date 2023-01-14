const albumImg = document.getElementById('album-img');
const songName = document.getElementById('song-name');
const inputField = document.getElementById('input');
const searchButton = document.getElementById('search');
const audioPlayer = document.querySelector('audio');

let searchQuery = '';

inputField.focus();

const handleSearch = async () => {
  if (searchQuery.length > 0) {
    const query = searchQuery.toLowerCase().split(' ').join('+');
    const res = await fetch(`/audio?query=${query}`);
    const data = await res.json();

    albumImg.src = data['albumArt']['url'];
    songName.textContent = data['title'];
    audioPlayer.src = data['url'];
    audioPlayer.play();
    inputField.value = '';
  }
};

document.addEventListener('keyup', async (event) => {
  if (event.code === 'Slash' && document.activeElement !== inputField) {
    inputField.focus();
  }

  if (event.code === 'Enter' && document.activeElement === inputField) {
    handleSearch();
  }

  if (event.code === 'Space' && document.activeElement !== inputField) {
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
});

inputField.addEventListener('input', (e) => {
  searchQuery = e.currentTarget.value.trim();
});

searchButton.addEventListener('click', handleSearch);
