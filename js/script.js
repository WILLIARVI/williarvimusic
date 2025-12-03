// Audio Player Functionality
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
        
        this.init();
    }
    
    init() {
        this.loadTracks();
        this.setupEventListeners();
        this.loadTrack(this.currentTrackIndex);
    }
    
    loadTracks() {
        // This would normally load from an API
        this.tracks = [
            {
                id: 1,
                title: "Mi Canción Nueva",
                artist: "Willi ArVi",
                album: "Single 2024",
                duration: "3:45",
                url: "music/mi-cancion-nueva.mp3",
                cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            },
            {
                id: 2,
                title: "Sueños Urbanos",
                artist: "Willi ArVi",
                album: "EP 2023",
                duration: "4:20",
                url: "music/suenos-urbanos.mp3",
                cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
            },
            {
                id: 3,
                title: "Bajo las Estrellas",
                artist: "Willi ArVi",
                album: "EP 2023",
                duration: "3:55",
                url: "music/bajo-las-estrellas.mp3",
                cover: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=400&fit=crop"
            },
            {
                id: 4,
                title: "Ritmo en la Ciudad",
                artist: "Willi ArVi",
                album: "Single 2022",
                duration: "4:10",
                url: "music/ritmo-en-la-ciudad.mp3",
                cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop"
            }
        ];
    }
    
    setupEventListeners() {
        if (this.playBtn) {
            this.playBtn.addEventListener('click', () => this.togglePlay());
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previous());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        if (this.shuffleBtn) {
            this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        }
        
        if (this.repeatBtn) {
            this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        }
        
        if (this.audio) {
            this.audio.addEventListener('ended', () => this.onTrackEnd());
        }
    }
    
    loadTrack(index) {
        if (index < 0 || index >= this.tracks.length) return;
        
        this.currentTrackIndex = index;
        const track = this.tracks[index];
        
        // Update UI
        document.getElementById('currentTrack').textContent = track.title;
        document.getElementById('currentAlbum').textContent = `${track.artist} - ${track.album}`;
        document.getElementById('totalTime').textContent = track.duration;
        document.getElementById('currentAlbumArt').src = track.cover;
        
        // Update playlist
        this.updatePlaylistUI();
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.isPlaying = true;
        this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        document.querySelector('.album-art').classList.add('playing');
        
        // Simulate progress for demo
        this.simulateProgress();
    }
    
    pause() {
        this.isPlaying = false;
        this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
        document.querySelector('.album-art').classList.remove('playing');
    }
    
    next() {
        let nextIndex;
        
        if (this.isShuffle) {
            nextIndex = this.getRandomTrackIndex();
        } else {
            nextIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        }
        
        this.loadTrack(nextIndex);
        if (this.isPlaying) this.play();
    }
    
    previous() {
        let prevIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        this.loadTrack(prevIndex);
        if (this.isPlaying) this.play();
    }
    
    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.classList.toggle('active', this.isShuffle);
    }
    
    toggleRepeat() {
        this.isRepeat = !this.isRepeat;
        this.repeatBtn.classList.toggle('active', this.isRepeat);
    }
    
    onTrackEnd() {
        if (this.isRepeat) {
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
    
    updatePlaylistUI() {
        const playlist = document.getElementById('playlist');
        if (!playlist) return;
        
        playlist.innerHTML = this.tracks.map((track, index) => `
            <div class="track-item ${index === this.currentTrackIndex ? 'playing' : ''}" 
                 onclick="audioPlayer.loadTrack(${index}); audioPlayer.play();">
                <div class="track-number">${index + 1}</div>
                <div class="track-details">
                    <h5>${track.title}</h5>
                    <p>${track.artist} - ${track.album}</p>
                </div>
                <div class="track-duration">${track.duration}</div>
            </div>
        `).join('');
    }
    
    simulateProgress() {
        const progressFill = document.getElementById('progressFill');
        const currentTimeEl = document.getElementById('currentTime');
        
        if (!this.isPlaying || !progressFill) return;
        
        let progress = parseFloat(progressFill.style.width) || 0;
        
        const interval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(interval);
                return;
            }
            
            progress += 0.5;
            progressFill.style.width = `${progress}%`;
            
            // Calculate current time
            const totalTime = this.tracks[this.currentTrackIndex].duration;
            const [mins, secs] = totalTime.split(':').map(Number);
            const totalSeconds = mins * 60 + secs;
            const currentSeconds = Math.floor((progress / 100) * totalSeconds);
            
            const displayMins = Math.floor(currentSeconds / 60);
            const displaySecs = currentSeconds % 60;
            currentTimeEl.textContent = `${displayMins}:${displaySecs < 10 ? '0' : ''}${displaySecs}`;
            
            if (progress >= 100) {
                clearInterval(interval);
                this.onTrackEnd();
            }
        }, 100);
    }
}

// Initialize audio player
let audioPlayer;

document.addEventListener('DOMContentLoaded', function() {
    audioPlayer = new AudioPlayer();
    
    // Expose to global scope
    window.audioPlayer = audioPlayer;
});