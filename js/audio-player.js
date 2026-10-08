// ==========================================================
// REPRODUCTOR DE AUDIO - Willi ArVi Music
// Lee los MP3 de la carpeta music/ del repositorio de GitHub
// ==========================================================

class AudioPlayer {
    constructor() {
        this.tracks = [];
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.isShuffle = false;
        this.isRepeat = false;

        this.audio = document.getElementById('audioElement');
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.progressBar = document.getElementById('progressBar');

        this.init();
    }

    async init() {
        await this.loadTracks();
        if (!this.tracks.length) {
            this.showEmpty();
            return;
        }
        this.setupEventListeners();
        this.loadTrack(0);
    }

    showEmpty() {
        const trackEl = document.getElementById('currentTrack');
        if (trackEl) trackEl.textContent = 'Sin canciones disponibles';
        const albumEl = document.getElementById('currentAlbum');
        if (albumEl) albumEl.textContent = 'Sube tus MP3 a la carpeta music/ del repositorio';
        const playlist = document.getElementById('playlist');
        if (playlist) {
            playlist.innerHTML = '<div style="text-align:center;padding:2rem;color:#888;font-style:italic;">Aún no hay canciones publicadas.</div>';
        }
    }

    prettifyFileName(name) {
        return name
            .replace(/\.mp3$/i, '')
            .replace(/[-_]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    async loadTracks() {
        try {
            const { user, repo, musicFolder } = CONFIG.github;
            const url = `https://api.github.com/repos/${user}/${repo}/contents/${musicFolder}`;
            const r = await fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } });
            if (!r.ok) throw new Error(`GitHub API error: ${r.status}`);
            const items = await r.json();

            const mp3s = items
                .filter(i => i.type === 'file' && /\.mp3$/i.test(i.name))
                .sort((a, b) => a.name.localeCompare(b.name));

            this.tracks = mp3s.map((item, i) => ({
                id: i + 1,
                title: this.prettifyFileName(item.name),
                artist: 'Willi ArVi',
                album: '',
                url: item.download_url,
                cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            }));
        } catch (e) {
            console.warn('No se pudo cargar la música (probablemente estás en local):', e);
            this.tracks = [];
        }
    }

    setupEventListeners() {
        if (this.playBtn) this.playBtn.addEventListener('click', () => this.togglePlay());
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.previous());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
        if (this.shuffleBtn) this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        if (this.repeatBtn) this.repeatBtn.addEventListener('click', () => this.toggleRepeat());

        if (this.audio) {
            this.audio.addEventListener('ended', () => this.onTrackEnd());
            this.audio.addEventListener('timeupdate', () => this.updateProgress());
            this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        }

        if (this.progressBar) {
            this.progressBar.addEventListener('click', (e) => this.seek(e));
        }
    }

    loadTrack(index) {
        if (index < 0 || index >= this.tracks.length) return;
        this.currentTrackIndex = index;
        const track = this.tracks[index];

        const trackEl = document.getElementById('currentTrack');
        const albumEl = document.getElementById('currentAlbum');
        const artEl = document.getElementById('currentAlbumArt');

        if (trackEl) trackEl.textContent = track.title;
        if (albumEl) albumEl.textContent = track.artist + (track.album ? ' - ' + track.album : '');
        if (artEl) artEl.src = track.cover;

        if (this.audio) {
            this.audio.src = track.url;
            this.audio.load();
        }

        const currentTimeEl = document.getElementById('currentTime');
        if (currentTimeEl) currentTimeEl.textContent = '0:00';
        const totalEl = document.getElementById('totalTime');
        if (totalEl) totalEl.textContent = '0:00';
        const progressFill = document.getElementById('progressFill');
        if (progressFill) progressFill.style.width = '0%';

        this.updatePlaylistUI();
    }

    togglePlay() {
        if (this.isPlaying) this.pause();
        else this.play();
    }

    play() {
        if (!this.audio || !this.tracks.length) return;
        this.audio.play().then(() => {
            this.isPlaying = true;
            if (this.playBtn) this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            const albumArt = document.querySelector('.album-art');
            if (albumArt) albumArt.classList.add('playing');
        }).catch(e => console.warn('Error al reproducir:', e));
    }

    pause() {
        if (!this.audio) return;
        this.audio.pause();
        this.isPlaying = false;
        if (this.playBtn) this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
        const albumArt = document.querySelector('.album-art');
        if (albumArt) albumArt.classList.remove('playing');
    }

    next() {
        let nextIndex;
        if (this.isShuffle) nextIndex = this.getRandomTrackIndex();
        else nextIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        this.loadTrack(nextIndex);
        if (this.isPlaying) this.play();
    }

    previous() {
        const prevIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        this.loadTrack(prevIndex);
        if (this.isPlaying) this.play();
    }

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        if (this.shuffleBtn) this.shuffleBtn.classList.toggle('active', this.isShuffle);
    }

    toggleRepeat() {
        this.isRepeat = !this.isRepeat;
        if (this.repeatBtn) this.repeatBtn.classList.toggle('active', this.isRepeat);
    }

    onTrackEnd() {
        if (this.isRepeat) {
            this.audio.currentTime = 0;
            this.play();
        } else {
            this.next();
        }
    }

    getRandomTrackIndex() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.tracks.length);
        } while (newIndex === this.currentTrackIndex && this.tracks.length > 1);
        return newIndex;
    }

    formatTime(seconds) {
        if (!isFinite(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    updateProgress() {
        if (!this.audio || !isFinite(this.audio.duration)) return;
        const pct = (this.audio.currentTime / this.audio.duration) * 100;
        const progressFill = document.getElementById('progressFill');
        if (progressFill) progressFill.style.width = pct + '%';
        const currentTimeEl = document.getElementById('currentTime');
        if (currentTimeEl) currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }

    updateDuration() {
        const totalEl = document.getElementById('totalTime');
        if (totalEl && this.audio) totalEl.textContent = this.formatTime(this.audio.duration);
    }

    seek(e) {
        if (!this.audio || !isFinite(this.audio.duration)) return;
        const rect = this.progressBar.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        this.audio.currentTime = pct * this.audio.duration;
    }

    updatePlaylistUI() {
        const playlist = document.getElementById('playlist');
        if (!playlist) return;

        playlist.innerHTML = this.tracks.map((track, index) => `
            <div class="track-item ${index === this.currentTrackIndex ? 'playing' : ''}"
                 onclick="audioPlayer.loadTrack(${index}); audioPlayer.play();">
                <div class="track-number">${index + 1}</div>
                <div class="track-details">
                    <h5>${track.title}</h5>
                    <p>${track.artist}${track.album ? ' - ' + track.album : ''}</p>
                </div>
            </div>
        `).join('');
    }
}

let audioPlayer;

document.addEventListener('DOMContentLoaded', function () {
    audioPlayer = new AudioPlayer();
    window.audioPlayer = audioPlayer;
});