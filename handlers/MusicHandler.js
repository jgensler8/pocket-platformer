class MusicHandler {
    static addSong(value) {
        const songUrlValue = value || document.getElementById("addUrl")?.value;
        if (songUrlValue) {
            const url = songUrlValue;
            document.getElementById("addSong").style = "display: none";
            document.getElementById("songSummary").style = "display: block";
            document.getElementById("songUrl").innerHTML = songUrlValue;
            SoundHandler.song.src = url;
            var source = document.getElementById('mainSong');
            source.src = url;
            source.load();
            source.play();
            document.getElementById("musicPlayer").style = "display: block";
            this.setMusicPlayerStyles();
        }
    }

    static deleteSong() {
        document.getElementById("addSong").style = "display: block";
        document.getElementById("songSummary").style = "display: none";
        document.getElementById("songUrl").innerHTML = "";
        SoundHandler.song.src = "";
        document.getElementById("musicPlayer").style = "display: none";
        var source = document.getElementById('mainSong');
        source.src = "";
    }

    static stopMusic() {
        SoundHandler.song.stop();
        this.setMusicPlayerStyles("display: none", "display: inline-block");
    }

    static startMusic() {
        SoundHandler.song.play();
        this.setMusicPlayerStyles();
    }

    static setMusicPlayerStyles (stopButton = "display: inline-block", playButton = "display: none") {
        document.getElementById("stopMusic").style = stopButton;
        document.getElementById("startMusic").style = playButton;
    }
}