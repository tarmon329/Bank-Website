'use strict';

///////////////////////////////////////

//Global Variables:

// Modal window variables

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

//Scroll to view variables
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

//tab var
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
// nav var
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

///////////////////////////////////////

//Modal

const modalInit = function () {
  //Open Modal

  const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    //disable scroll
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function () {
      window.scrollTo(x, y);
    };
  };

  //Close Modal

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
    //enable scroll
    window.onscroll = function () {};
  };
  btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
};
modalInit();

//Scroll into view

btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  section1.scrollIntoView({ behavior: 'smooth' });
});

const navInit = function () {
  //Page Navigation - without Deligation
  // document.querySelectorAll('.nav__link').forEach(anchor =>
  //   anchor.addEventListener('click', function (e) {
  //     e.preventDefault();
  //     document
  //       .querySelector(this.getAttribute('href'))
  //       .scrollIntoView({ behavior: 'smooth' });
  //   })
  // );

  //Page Navigation -  Event Deligation
  document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();
    //matching strategy:
    if (
      e.target.classList.contains('nav__link') &&
      !e.target.classList.contains('btn--show-modal')
    ) {
      document
        .querySelector(e.target.getAttribute('href'))
        .scrollIntoView({ behavior: 'smooth' });
    }
  });
};
navInit();

//Tabbed Component

const tabInit = function () {
  tabsContainer.addEventListener('click', function (e) {
    e.preventDefault();
    const clicked = e.target.closest('.operations__tab');
    if (!clicked) return;

    //Remove active classes
    tabs.forEach(t => {
      t.classList.remove('operations__tab--active');
    });
    //Active tab
    clicked.classList.add('operations__tab--active');

    //Remove active classes
    tabsContent.forEach(t => t.classList.remove('operations__content--active'));
    //Activate content area
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });
};
tabInit();

// Menu fade animation Function
const menuFade = function () {
  const handleHover = function (e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');

      siblings.forEach(el => {
        //matching
        if (el !== link) el.style.opacity = this;
      });
      logo.style.opacity = this;
    }
  };
  // Fade out
  nav.addEventListener('mouseover', handleHover.bind(0.5));
  //Fade in
  nav.addEventListener('mouseout', handleHover.bind(1));
};
menuFade();

// Sticky navigation

const stickyInit = function () {
  //Old computed way
  // window.addEventListener('scroll', function () {
  //   if (window.scrollY > nav.getBoundingClientRect().bottom + 50)
  //     nav.classList.add('sticky');
  //   if (window.scrollY < nav.getBoundingClientRect().bottom + 5)
  //     nav.classList.remove('sticky');
  // });
  //New IntersectingObserver way
  const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  };
  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${nav.getBoundingClientRect().height}px`,
  });
  headerObserver.observe(header);
};
stickyInit();

// Reveal section

const revealInit = function () {
  const allSections = document.querySelectorAll('.section');

  const revealSection = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });

  allSections.forEach(function (section) {
    section.classList.add('section--hidden');
    sectionObserver.observe(section);
  });
};
revealInit();

// Lazy Loading Images

const lazyImg = function () {
  const imgTargets = document.querySelectorAll(`img[data-src]`);
  const loadImg = function (entries, observer) {
    const [entry] = entries;
    const target = entry.target;
    if (!entry.isIntersecting) return;
    target.src = target.dataset.src;
    const event = target.addEventListener('load', () => {
      target.classList.remove('lazy-img');
      target.removeEventListener('load', event);
    });
    observer.unobserve(target);
  };
  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  });
  imgTargets.forEach(img => imgObserver.observe(img));
};
lazyImg();

//Slider

const slider = function () {
  //Variables

  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length - 1;

  // Functions

  const createDots = function () {
    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.classList.add(`dots__dot`);
      dot.dataset.slide = `${i}`;
      dotContainer.append(dot);
    });
  };

  const activateDot = function (slide = curSlide) {
    const dots = dotContainer.querySelectorAll('.dots__dot');
    dots.forEach(dot => dot.classList.remove('dots__dot--active'));
    dots[slide].classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function (e) {
    if (curSlide === maxSlide) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateDot();
  };

  const prevSlide = function (e) {
    if (curSlide === 0) curSlide = maxSlide;
    else curSlide--;
    goToSlide(curSlide);
    activateDot();
  };
  const init = function () {
    createDots();
    activateDot();
    goToSlide(0);
  };
  init();

  //Event handlers

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;
    goToSlide(e.target.dataset.slide);
    curSlide = e.target.dataset.slide;
    activateDot();
  });
};
slider();

////////////////////////////////
////////////////////////////////
////////////////////////////////
/*
// event propagation in practice

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
document.querySelector('.nav__link').addEventListener('click', function (e) {
  e.preventDefault();
  // e.cancelBubble = true;
  this.style.backgroundColor = randomColor();
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});
*/
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
//   console.log(observer);
// };
// const obsOptions = {
//   root: null,
//   threshold: [0.1],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
