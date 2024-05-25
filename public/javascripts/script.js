var page1Content = document.querySelector("#page1-content");
var cursor = document.querySelector("#cursor");
// var homevideo = document.querySelector("#hinduismvideo");

document.addEventListener("DOMContentLoaded", () => {
  const page1 = document.querySelector("#page1");
  const video = document.querySelector("#hinduismvideo");

  page1.addEventListener("click", () => {
    const videoSrc = encodeURIComponent(video.src); // Encode the video source
    window.location.href = `play?src=${videoSrc}`;
  });
});


page1Content.addEventListener("mousemove", function (dets) {
  gsap.to(cursor, {
    x: dets.x,
    y: dets.y,
  });
});

page1Content.addEventListener("mouseenter", function () {
  gsap.to(cursor, {
    scale: 1,
    opacity: 1,
  });
});

page1Content.addEventListener("mouseleave", function () {
  gsap.to(cursor, {
    scale: 0,
    opacity: 0,
  });
});

// function locoScroll(){

//     const scroll = new LocomotiveScroll({
//         el: document.querySelector('#main'),
//         smooth: true,
//         lerp: 0.1
//     });
// }
// locoScroll();

var tl = gsap.timeline();
tl.from("#loader #first", {
  x: 100,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
});

tl.to("#loader #first", {
  x: -100,
  opacity: 0,
  duration: 1,
  stagger: -0.2,
});

tl.from("#loader #second,#imp", {
  x: 100,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
});

tl.to("#loader #second,#imp", {
  x: -100,
  opacity: 0,
  duration: 1,
  stagger: -0.2,
});

tl.to("#loader", {
  opacity: 0,
  duration: 1,
});
tl.to("#loader", {
  display: "none",
});

gsap.from("#page3", {
  scrollTrigger: {
    trigger: "#page3",
    start: "top 80%", // Adjust as needed
    end: "top 40%", // Adjust as needed
    scrub: 1,
    // markers: true,
  },
  y: 100,
  opacity: 0,
});

var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

// tl.from("#loader #imp",{
//     x: 100,
//     opacity: 0,
//     duration: 1,
//     stagger:0.2
// })
// tl.to("#loader #imp",{
//     opacity: 0,
//     x:-100,
//     duration: 1,
//     stagger: -0.2
// })

// tl.to("#loader h3",{
//     opacity: 0
// })
