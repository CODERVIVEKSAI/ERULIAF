let bgAudio = new Audio();
bgAudio.loop = false; 
bgAudio.volume = 0.015; 

const playlist = [
    { title: "Hall of Fame - The Script", file: "Hall Of Fame -The Script.mp3" },
    { title: "Unstoppable - Sia", file: "Unstoppable - Sia.mp3" },
    { title: "I'm Still Standing - Elton John", file: "Elton John - I'm Still Standing.mp3" },
    { title: "Believer - Imagine Dragons", file: "Imagine Dragons - Believer (Audio).mp3" },
    { title: "Victory - Two Steps From Hell", file: "Two_Steps_From_Hell_-_Victory_(mp3.pm).mp3" },
    { title: "Beat It - Michael Jackson", file: "Michael Jackson - Beat It (Official Audio).mp3" }
];

function togglepassword() {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.querySelector(".eye-icon");
    if (!passwordInput || !eyeIcon) return;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off preview-icon"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>';
    } else {
        passwordInput.type = "password";
        eyeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye preview-icon"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "index.html" || currentPage === "signup.html" || currentPage === "") {
        document.body.classList.remove('dark-mode');
        return;
    }

    let savedTrack = localStorage.getItem('selectedTrack');
    const userExplicitlySelected = localStorage.getItem('userSelectedTrack') === 'true';

    if (!savedTrack || !userExplicitlySelected) {
        const randomSong = playlist[Math.floor(Math.random() * playlist.length)];
        savedTrack = randomSong.file;
        localStorage.setItem('selectedTrack', savedTrack);
    }
    bgAudio.src = savedTrack;

    const savedTime = parseFloat(localStorage.getItem('audioPlaybackTime')) || 0;
    bgAudio.currentTime = savedTime;

    bgAudio.addEventListener('timeupdate', () => {
        localStorage.setItem('audioPlaybackTime', bgAudio.currentTime);
    });

    bgAudio.addEventListener('ended', () => {
        const isManual = localStorage.getItem('userSelectedTrack') === 'true';
        if (!isManual) {
            const nextRandomSong = playlist[Math.floor(Math.random() * playlist.length)];
            localStorage.setItem('selectedTrack', nextRandomSong.file);
            localStorage.setItem('audioPlaybackTime', 0);
            bgAudio.src = nextRandomSong.file;
            bgAudio.play();
            
            const musicSelect = document.getElementById('musicSelect');
            if (musicSelect) musicSelect.value = nextRandomSong.file;
        } else {
            bgAudio.currentTime = 0;
            bgAudio.play();
        }
    });

    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle && !document.getElementById('bgMusicToggle')) {
        const darkModeLabel = darkModeToggle.closest('label');
        if (darkModeLabel) {
            const musicContainer = document.createElement('div');
            musicContainer.style.cssText = "margin-bottom: 15px;";
            
            const optionsHtml = playlist.map(song => `<option value="${song.file}">${song.title}</option>`).join('');

            musicContainer.innerHTML = `
                <label style="display:block; margin-bottom: 8px; cursor: pointer; font-weight: 500;">
                    <input type="checkbox" id="bgMusicToggle" onchange="toggleBgMusic(this.checked)"> Background Music
                </label>
                <select id="musicSelect" onchange="changeTrack(this.value)" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #ccc; background: #f8f9fa; color: #333; font-size: 14px; cursor: pointer; box-sizing: border-box; outline: none;">
                    ${optionsHtml}
                </select>
            `;
            darkModeLabel.insertAdjacentElement('afterend', musicContainer);
            document.getElementById('musicSelect').value = savedTrack;
        }
    }

    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        if (darkModeToggle) darkModeToggle.checked = false;
    }

    const isMusicEnabled = localStorage.getItem('bgMusic') === 'enabled';
    const bgMusicToggle = document.getElementById('bgMusicToggle');
    if (bgMusicToggle) {
        bgMusicToggle.checked = isMusicEnabled;
    }

    if (isMusicEnabled) {
        bgAudio.play().catch(() => {});
    }
});

function toggleSettings() {
    const panel = document.getElementById('settings');
    if (panel) {
        panel.classList.toggle('show');
    }
}

function toggleDarkMode(isDark) {
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "index.html" || currentPage === "signup.html") return;

    if (isDark) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
}

function toggleBgMusic(playMusic) {
    if (playMusic) {
        bgAudio.play();
        localStorage.setItem('bgMusic', 'enabled');
    } else {
        bgAudio.pause();
        localStorage.setItem('bgMusic', 'disabled');
    }
}

function changeTrack(newFile) {
    localStorage.setItem('userSelectedTrack', 'true');
    localStorage.setItem('selectedTrack', newFile);
    localStorage.setItem('audioPlaybackTime', 0);
    bgAudio.currentTime = 0;
    bgAudio.src = newFile;
    const isMusicEnabled = localStorage.getItem('bgMusic') === 'enabled';
    if (isMusicEnabled) {
        bgAudio.play();
    }
}


document.addEventListener("click", (e) => {
    const starBtn = e.target.closest('.star-toggle');
    if (!starBtn) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    let targetId = null;
    const dataArray = typeof achieversData !== 'undefined' ? achieversData : [];

    
    const card = starBtn.closest('.card');
    if (card) {
        const link = card.querySelector('a');
        if (link) {
            const pageFilename = link.getAttribute('href').trim();
            const found = dataArray.find(item => item.page.toLowerCase() === pageFilename.toLowerCase());
            if (found) targetId = found.id;
        }
    }

    
    if (!targetId) {
        const currentPath = window.location.pathname.split("/").pop().trim();
        const found = dataArray.find(item => item.page.toLowerCase() === currentPath.toLowerCase());
        if (found) targetId = found.id;
    }

    if (targetId) {
        let starredIds = JSON.parse(localStorage.getItem("starredAchievers")) || [];

        if (starredIds.includes(targetId)) {
            starredIds = starredIds.filter(id => id !== targetId);
            starBtn.classList.remove('starred');
        } else {
            starredIds.push(targetId);
            starBtn.classList.add('starred');
        }

        localStorage.setItem("starredAchievers", JSON.stringify(starredIds));

        if (typeof renderStarredCards === 'function') {
            renderStarredCards();
        }
    }
}, true);


document.addEventListener("DOMContentLoaded", () => {
    let starredIds = JSON.parse(localStorage.getItem("starredAchievers")) || [];
    const currentPath = window.location.pathname.split("/").pop().trim();
    const dataArray = typeof achieversData !== 'undefined' ? achieversData : [];

    const currentAchiever = dataArray.find(item => item.page.toLowerCase() === currentPath.toLowerCase());
    if (currentAchiever) {
        const starBtn = document.querySelector('.star-toggle');
        if (starBtn && starredIds.includes(currentAchiever.id)) {
            starBtn.classList.add('starred');
        }
    }
});