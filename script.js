const moodSearchTerms = {
    happy: "happy party pop dance positive",
    sad: "sad emotional acoustic heartbreak slow melancholy",
    angry: "hard rock metal",
    relaxed: "chill jazz acoustic calm slow", 
};


let currentAudio = null;
let currentButton = null;  

function loadSongs(mood) {
    loader.style.display = "block";

    fetch(`https://itunes.apple.com/search?term=${moodSearchTerms[mood]}&entity=song&limit=20`)
        .then(res => res.json())
        .then(data => {
            const container = document.querySelector(".playlist");
            const loader = document.getElementById("loader");
            loader.style.display = "none";
            container.innerHTML = "";



            const songs = data.results
                .filter(s => s.previewUrl)
                .map(s => ({
                    name: s.trackName,
                    artist: s.artistName,
                    url: s.previewUrl,
                    cover: s.artworkUrl100
                }));





            if (songs.length === 0) {
                container.innerHTML = "<p>No playable songs.</p>";
                return;
            }

            songs.forEach(song => {
                const songDiv = document.createElement("div");
                songDiv.classList.add("song");

                // Song cover
                const img = document.createElement("img");
                img.src = song.cover || "default-cover.png";
                img.alt = `${song.name} cover`;
                img.classList.add("song-cover");

                // Song text
                const p = document.createElement("p");
                p.textContent = `${song.name} - ${song.artist}`;

                // Play button
                const btn = document.createElement("button");
                btn.classList.add("btn", `btn-${mood}`);
                btn.innerHTML = "&#9654;";

                btn.addEventListener("click", () => {
                    // If the same song is already playing
                    if (currentAudio && currentAudio.src === song.url) {
                        if (!currentAudio.paused) {
                            currentAudio.pause();
                            btn.innerHTML = "&#9654;";
                        } else {
                            currentAudio.play();
                            btn.innerHTML = "&#10074;&#10074;";
                        }
                        return;
                    }

                    // Stop previous audio
                    if (currentAudio) {
                        currentAudio.pause();
                        if (currentButton) currentButton.innerHTML = "&#9654;";
                    }

                    currentAudio = new Audio(song.url);
                    currentAudio.play();
                    btn.innerHTML = "&#10074;&#10074;";
                    currentButton = btn;

                    // Reset button when song ends
                    currentAudio.addEventListener("ended", () => {
                        btn.innerHTML = "&#9654;";
                    });
                });

                // Append elements to div
                songDiv.appendChild(img);
                songDiv.appendChild(p);
                songDiv.appendChild(btn);
                container.appendChild(songDiv);
            });
        })
        .catch(err => console.error("Error fetching songs:", err));
};
