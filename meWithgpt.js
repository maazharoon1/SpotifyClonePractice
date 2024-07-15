let currentSong = new Audio();
let play = document.getElementById('play');
let songListItems = [];
let card1 = document.querySelector('.card');
let card2 = document.querySelector('.m-189');
let intervalId ;


function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
function playMusic(trackElement) {
  currentSong.src = trackElement.href;
  currentSong.play();

  currentSong.addEventListener('loadedmetadata', () => {
    let duration = formatTime(currentSong.duration);
    document.querySelector('.songInfo').innerText = trackElement.innerText.replace("Maaz", '');

    if (intervalId) {
      clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
      document.querySelector('.songTime').innerText = duration + '/' + formatTime(currentSong.currentTime);
    }, 100);
  });
}
// playMusic(currentSong)


async function getSongs(folder) {
  try {
    // Pause current song if it's playing
    if (!currentSong.paused) {
      currentSong.pause();
    }

    // Fetch songs for the new folder
    let response = await fetch(`http://localhost:8080/http://localhost:8000/${folder}/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    let text = await response.text();

    let tempUl = document.createElement('ul');
    tempUl.innerHTML = text;
    let liElements = tempUl.getElementsByTagName('li');

    let songList = document.querySelector('.songList ul');
    if (!songList) {
      console.error('songList element not found');
      return;
    }

    // Clear the current song list
    songList.innerHTML = '';
    songListItems = [];

    for (const li of liElements) {
      let a = li.querySelector('a');
      if (a) {
        // Ensure the URL is correctly prefixed
        a.href = `http://localhost:8080/http://localhost:8000/${folder}/` + a.getAttribute('href');

        // Create new list item
        const newLi = document.createElement('li');
        newLi.classList.add('lis');

        const img = document.createElement('img');
        img.classList.add('invert');
        img.src = "https://spotify.freewebhostmost.com/img/music.svg";
        img.alt = "Music";

        const div = document.createElement('div');
        const an = document.createElement('a');
        an.innerHTML = a.innerText.slice(0, -3) + '<br> Maaz';
        an.href = a.href;

        const div1 = document.createElement('div');
        div1.classList.add('play');

        const img1 = document.createElement('img');
        img1.classList.add('invert');
        img1.src = "https://spotify.freewebhostmost.com/img/play.svg";
        img1.alt = "Play";

        newLi.append(img, div, div1);
        div.append(an);
        div1.append(img1);

        songList.append(newLi);

        // Store the song list items
        songListItems.push(newLi);

        // Add click event listener to play music
        newLi.addEventListener('click', (e) => {
          e.preventDefault();
          playMusic(a);
          play.src = 'image/pause.svg';  // Change the play button to pause when a new song starts
        });
      }
    }

    // Play the first song from the new list

  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const volumeBar = document.getElementById('volume-bar');

  // Set initial volume based on the volume bar value
  currentSong.volume = volumeBar.value;

  // Update audio volume when volume bar is adjusted
  volumeBar.addEventListener('input', function() {
    currentSong.volume = this.value;
  });

  // Event listener for play button
  play.addEventListener('click', () => {
    if (currentSong.paused && currentSong.src) {
      currentSong.play();
      play.src = 'image/pause.svg';
    } else if (!currentSong.src) {
      playMusic(songListItems[0].querySelector('a'));
      play.src = 'image/pause.svg';
    } else {
      currentSong.pause();
      play.src = 'image/play.svg';
    }
  });

  // Event listener for previous button
  document.getElementById('previous').addEventListener('click', () => {
    let currentIndex = songListItems.findIndex(item => item.querySelector('a').href === currentSong.src);
    if (currentIndex > 0) {
      play.src = 'image/pause.svg';
      playMusic(songListItems[currentIndex - 1].querySelector('a'));
    }
  });
  
  // Event listener for next button
  document.getElementById('next').addEventListener('click', () => {
    let currentIndex = songListItems.findIndex(item => item.querySelector('a').href === currentSong.src);
    if (currentIndex < songListItems.length - 1) {
      play.src = 'image/pause.svg';
      playMusic(songListItems[currentIndex + 1].querySelector('a'));
    }
  });

  // Event listener for seekbar
  document.querySelector('.seekbar').addEventListener('click', (e) => {
    let circleStyle = (e.offsetX / e.target.getBoundingClientRect().width);
    currentSong.currentTime = currentSong.duration * circleStyle;
    document.querySelector('.circle').style.left = circleStyle * 100 + '%';
  });

  // Update circle position during song playback
  currentSong.addEventListener('timeupdate', () => {
    document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';
  });
});
getSongs('songs')
// Event listener for card1
card1.addEventListener('click', async () => {
  // Pause the current song before fetching new songs
  if (!currentSong.paused) {
    currentSong.pause();
  }

  // Reset UI elements
  play.src = 'image/play.svg';
  document.querySelector('.circle').style.left = '0%';
  
  // Clear song list items
  songListItems = [];

  // Fetch new songs
  await getSongs('songs');

  // Play each song immediately after fetching
  let aElements = document.querySelector('.songList').getElementsByTagName('a');
  if (aElements.length > 0) {
    playMusic(aElements[0]);
    play.src = 'image/pause.svg'; // Start with play button shown as pause
  }
});

// Event listener for card2
card2.addEventListener('click', async () => {
  // Pause the current song before fetching new songs
  if (!currentSong.paused) {
    currentSong.pause();
  }

  // Reset UI elements
  play.src = 'image/play.svg';
  document.querySelector('.circle').style.left = '0%';
  
  // Clear song list items
  songListItems = [];
  
  // Fetch new songs
  await getSongs('folder');

  // Play each song immediately after fetching
  let aElements = document.querySelector('.songList').getElementsByTagName('a');
  if (aElements.length > 0) {
    playMusic(aElements[0]);
    play.src = 'image/pause.svg'; // Start with play button shown as pause
  }
});
