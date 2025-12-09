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

window.openSongPopup = openSongPopup;
window.closeSongPopup = closeSongPopup;

// Add event listener for close button
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("close-modal-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeSongPopup);
  }
});
