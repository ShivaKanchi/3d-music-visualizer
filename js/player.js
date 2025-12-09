// Handles play icon, file upload, and player UI
function setIconsVisible(visible) {
  const upload = document.getElementById("upload-icon-container");
  const tooltip = document.getElementById("tooltip-container");
  if (upload) upload.style.display = visible ? "flex" : "none";
  if (tooltip) tooltip.style.display = visible ? "block" : "none";
}

// Set up event listeners for icons
document.addEventListener("DOMContentLoaded", function () {
  // Plus icon triggers file upload
  const uploadIcon = document.getElementById("upload-icon-container");
  if (uploadIcon) {
    uploadIcon.addEventListener("click", function () {
      const fileInput = document.getElementById("hidden-file-input");
      if (fileInput) {
        fileInput.click();
      }
    });
  }

  // Play icon opens song selection modal
  const playIcon = document.getElementById("tooltip-container");
  if (playIcon) {
    playIcon.addEventListener("click", function () {
      if (window.openSongPopup) window.openSongPopup();
    });
  }

  // Handle file selection
  const fileInput = document.getElementById("hidden-file-input");
  if (fileInput) {
    fileInput.addEventListener("change", function (event) {
      if (window.handleFileSelect) {
        window.handleFileSelect(event);
      }
    });
  }
});

window.setIconsVisible = setIconsVisible;
