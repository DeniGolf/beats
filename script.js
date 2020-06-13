let controller;
let slideScene;
let pageScene;

function animateSlides() {
  //Init Controller
  controller = new ScrollMagic.Controller();
  //Selection
  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");
  //Loop over each slide
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");
    //GSAP
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });
    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    slideTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");
    //Create Scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTl)
      // .addIndicators({
      //   colorStart: "white",
      //   colorTrigger: "white",
      //   name: "slide",
      // })
      .addTo(controller);
    //New animation
    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");

    //Create new scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      // .addIndicators({
      //   colorStart: "white",
      //   colorTrigger: "white",
      //   name: "page",
      //   indent: 200,
      // })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}

const mouse = document.querySelector(".cursor");
const mouseText = mouse.querySelector("span");
const burger = document.querySelector(".burger");
function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

function activeCursor(e) {
  let item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouseText.innerText = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    gsap.to(".title-swipe", 1, { y: "100%" });
    mouseText.innerText = "";
  }
}

function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, {
      rotate: "45deg",
      y: 5,
      background: "black",
    });
    gsap.to(".line2", 0.5, {
      rotate: "-45deg",
      y: -5,
      background: "black",
    });
    gsap.to("#logo", 1, {
      color: "black",
    });
    gsap.to(".nav-bar", 1, {
      clipPath: "circle(2500px at 100% -10%",
    });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, {
      rotate: "0",
      y: 0,
      background: "white",
    });
    gsap.to(".line2", 0.5, {
      rotate: "0",
      y: 0,
      background: "white",
    });
    gsap.to("#logo", 1, {
      color: "white",
    });
    gsap.to(".nav-bar", 1, {
      clipPath: "circle(50px at 100% -10%",
    });
    document.body.classList.remove("hide");
  }
}
function detailAnimation() {
  const nav = document.querySelector(".nav-header");
  const section = document.querySelector("section");
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail-slide");
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({ defaults: { duration: 1 } });

    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    console.log(nextSlide);
    if (nextSlide === "end") return;
    const nextImg = nextSlide.querySelector("img");

    const nextNr = nextSlide.querySelector(".fashion-nr");

    const nextText = nextSlide.querySelector(".fashion-text");
    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
    slideTl.fromTo(nextImg, { x: "50%" }, { x: "0%" });
    slideTl.fromTo(
      nextNr,
      { scale: "1.25", x: "-10%", borderWidth: "0" },
      { scale: "1", x: "0%", borderWidth: "3" },
      "-=1"
    );
    slideTl.fromTo(nextText, { opacity: "0" }, { opacity: "1" }, "-=1");
    gsap.fromTo(nav, 1, { y: "-100%" }, { y: "0%" });
    gsap.fromTo(
      section,
      1,
      { y: "-100%", opacity: 0, y: "-50%", scale: "0" },
      {
        y: "0%",
        opacity: 1,
        y: "0%",
        scale: "1",

        ease: Elastic.easeOut.config(1, 0.9),
      }
    );
    //Scene
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      // .addIndicators({
      //   colorStart: "white",
      //   colorTrigger: "white",
      //   name: "detailScene",
      // })
      .addTo(controller);
  });
}
//Event Listeners
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
animateSlides();
detailAnimation();
