

document.addEventListener("DOMContentLoaded", () => {
   const urlParams = new URLSearchParams(window.location.search);
   const videoSrc = urlParams.get("src");

   if (videoSrc) {
     const video = document.getElementById("playVideo");
     const source = document.getElementById("videoSource");
     source.src = decodeURIComponent(videoSrc);
     video.load();
     video.play();
   } else {
     console.log("Cannot play video");
   }
 });