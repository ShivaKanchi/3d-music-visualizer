// Handles modal (song selection popup) open/close and population

// Handle clicking outside the modal content to close it
function handleOutsideClick(event) {
  const popupContent = document.querySelector(".popup-content");
  if (popupContent && !popupContent.contains(event.target)) {
    closeSongPopup();
  }
}

function openSongPopup() {
  const popup = document.getElementById("song-selection-popup");
  if (popup) {
    popup.style.display = "flex";
    popup.setAttribute("aria-hidden", "false");
    populateSongList();

    // Add event listener for clicking outside the modal to close it
    setTimeout(() => {
      popup.addEventListener("click", handleOutsideClick);
    }, 100);
  }
}

function closeSongPopup() {
  const popup = document.getElementById("song-selection-popup");
  if (popup) {
    popup.style.display = "none";
    popup.setAttribute("aria-hidden", "true");
    popup.removeEventListener("click", handleOutsideClick);
  }
}

function populateSongList() {
  const ul = document.getElementById("predefined-songs");
  if (!ul) return;
  ul.innerHTML = "";
  // Try fetching metadata file to build list of available songs
  fetch("data/music-metadata.json")
    .then((res) => res.json())
    .then((data) => {
      // metadata may include multiple fields; support filename or tracks
      const entries = [];
      if (Array.isArray(data.tracks) && data.tracks.length) {
        data.tracks.forEach((t, idx) => {
          entries.push({
            name: t.title || t.filename || "Track " + (idx + 1),
            file: t.filename || t.file || t.src,
            viz: t.viz || "spiral",
          });
        });
      } else if (data.filename) {
        entries.push({
          name: data.title || data.filename,
          file: data.filename,
          viz: data.viz || "spiral",
        });
      }
      // Fallback if metadata didn't give any entries
      if (entries.length === 0) {
        entries.push({
          name: "Default song",
          file: data.filename || "",
          viz: "spiral",
        });
      }

      entries.forEach((entry) => {
        const li = document.createElement("li");
        const songContent = document.createElement("div");
        songContent.className = "song-item-content";

        // Add play icon
        const playIcon = document.createElement("i");
        playIcon.className = "fas fa-play play-icon";

        // Add song name
        const songName = document.createElement("span");
        songName.textContent = entry.name;

        songContent.appendChild(playIcon);
        songContent.appendChild(songName);

        li.appendChild(songContent);
        li.dataset.file = entry.file;
        li.dataset.viz = entry.viz || "spiral";

        li.addEventListener("click", () => {
          closeSongPopup();
          if (li.dataset.file) {
            currentVisualization = li.dataset.viz || "spiral";
            loadAudioFromUrl("music/" + li.dataset.file);
          }
        });
        ul.appendChild(li);
      });
    })
    .catch(() => {
      // Fallback hardcoded list
      const fallback = [
        {
          name: "Default (provided)",
          file: "default.mp3",
          viz: "", // spiral
        },
      ];
      fallback.forEach((entry) => {
        const li = document.createElement("li");
        const songContent = document.createElement("div");
        songContent.className = "song-item-content";

        // Add play icon
        const playIcon = document.createElement("i");
        playIcon.className = "fas fa-play play-icon";

        // Add song name
        const songName = document.createElement("span");
        songName.textContent = entry.name;

        songContent.appendChild(playIcon);
        songContent.appendChild(songName);

        li.appendChild(songContent);
        li.dataset.file = entry.file;
        li.dataset.viz = entry.viz;

        li.addEventListener("click", () => {
          closeSongPopup();
          currentVisualization = entry.viz;
          loadAudioFromUrl("music/" + entry.file);
        });
        ul.appendChild(li);
      });
    });
}

window.openSongPopup = openSongPopup;
window.closeSongPopup = closeSongPopup;
window.populateSongList = populateSongList;

// Add event listener for close button
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("close-modal-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeSongPopup);
  }
});
