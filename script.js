const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const repeatButton = document.getElementById('repeat');
const shuffleButton = document.getElementById('shuffle');
const audio = document.getElementById('audio');
const songImage = document.getElementById('song-image');
const songName = document.getElementById('song-name');
const songArtist = document.getElementById('song-artist');
const pauseButton = document.getElementById('pause');
const playButton = document.getElementById('play');
const playListButton = document.getElementById('playlist');

const maxDuration = document.getElementById('max-duration');
const currentTimeRef = document.getElementById('current-time');

const progressBar = document.getElementById('progress-bar');
const playListContainer = document.getElementById('playlist-container');
const closeButton = document.getElementById('close-button');
const playListSongs = document.getElementById('playlist-songs');
const currentProgress = document.getElementById('current-progress');

let index

let loop

const songsList = [
    {
        name: "Son Sözüm",
        link: "assets/semicenk.mp3",
        artist: "Semicenk",
        image: "assets/semicenk.jpeg"
    },
    {
        name: "Vurgunum",
        link: "assets/murat-göğebakan.mp3",
        artist: "Murat Göğebakan",
        image: "assets/murat-göğebakan.jpg"
    },
    {
        name: "Yalan",
        link: "assets/zeynep-avci.mp3",
        artist: "Zeynep Avcı",
        image: "assets/zeynep-avci.jpeg"
    },
    {
        name: "Aramam",
        link: "assets/aramam.mp3",
        artist: "Ibrahim Tatlises",
        image: "assets/ibrahim-tatlises.jpeg"
    },
    {
        name: "Gitme Kal",
        link: "assets/yara-bere-icindeyim.mp3",
        artist: "Hira-i Zerdüş",
        image: "assets/hirai.jpeg"
    },
    {
        name: "Yoluma Taş Koydular",
        link: "assets/kubilay-karca.mp3",
        artist: "Kubilay Karça",
        image: "assets/kubilay-karca.jpg"
    },
]

let events = {
    mouse: {
        click: "click"
    },
    touch: {
        click: "touchstart"
    }
}

let deviceType = "";

const isTouchDevice = () => {
    try {
        document.createEvent('TouchEvent')
        deviceType = "touch"
        return true
    } catch (error) {
        deviceType = "mouse"
        return false
    }
}

const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput/60);
    minute = minute < 10 ? "0" + minute : minute;
    let second = Math.floor(timeInput % 60);
    second = second < 10 ? "0" + second : second;
    return `${minute}:${second}`;
}

const setSong = (arrayIndex) => {
    let {name,link,artist,image} = songsList[arrayIndex];
    audio.src = link;
    songName.innerHTML = name;
    songArtist.innerHTML = artist;
    songImage.src = image

    audio.onloadedmetadata = () => {
        maxDuration.innerText = timeFormatter(audio.duration);
    }
    playListContainer.classList.add("hide");
    playAudio()
}

const playAudio = () => {
    audio.play();
    pauseButton.classList.remove('hide');
    playButton.classList.add('hide');
}

repeatButton.addEventListener('click', () => {
    if(repeatButton.classList.contains('active')) {
        repeatButton.classList.remove('active');
        audio.loop = false;
    } else {
        repeatButton.classList.add('active');
        audio.loop = true;
    }
})

const nextSong = () => {
    if(loop) {
        if(index==(songsList.length - 1)) {
            index = 0
        } else {
            index += 1;
        }
        setSong(index)
    } else {
        let randIndex = Math.floor(Math.random() * songsList.length)
        setSong(randIndex)
    }
    playAudio()
}

const pauseAudio = () => {
    audio.pause();
    pauseButton.classList.add('hide');
    playButton.classList.remove('hide');
}

const previousSong = () => {
    if(index > 0) {
        pauseAudio()
        index -= 1;
    } else {
        index = songsList.length - 1;
    }
    setSong(index)
    playAudio()
}

audio.onended = () => {
    nextSong()
}

shuffleButton.addEventListener('click',() => {
    if(shuffleButton.classList.contains('active')) {
        shuffleButton.classList.remove('active')
        loop = true;
    } else {
        shuffleButton.classList.add('active');
        loop = false;
    }
})

playButton.addEventListener('click',playAudio);

nextButton.addEventListener('click',nextSong);

pauseButton.addEventListener('click',pauseAudio);

prevButton.addEventListener('click', previousSong);

isTouchDevice();
progressBar.addEventListener(events[deviceType].click, (event) => {
    let coordStart = progressBar.getBoundingClientRect().left;

    let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

    currentProgress.style.width = progress * 100 + "%";

    audio.currentTime = progress * audio.duration;

    audio.play()
    pauseButton.classList.remove('hide');
    playButton.classList.add('hide');
})

setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

audio.addEventListener('timeupdate',() => {
    currentTimeRef.innerText = timeFormatter(audio.currentTime);
})

const initPlaylist = () => {
    for (let i in songsList) {
        playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
            <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
            <span id="playlist-song-name">
                ${songsList[i].name}
            </span>
            <span id="playlist-song-artist-album">
                ${songsList[i].artist}
            </span>
        </span>
        </li>
        `
    }
}

playListButton.addEventListener('click', () => {
    playListContainer.classList.remove('hide')
});

closeButton.addEventListener('click', () => {
    playListContainer.classList.add('hide')
});

window.onload = () => {
    index = 0
    setSong(index)
    initPlaylist()
}

