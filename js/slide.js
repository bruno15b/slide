import debounce from "./debounce.js";
export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    };
    this.activeClass = "active";
  }

  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
  }

  moveSlide(distX) {
    this.slide.style.transform = `translate3d(${distX}px,0,0)`;
    this.dist.movePosition = distX;
  }

  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.movement;
  }

  onMove(event) {
    const pointerPosition = event.type === "mousemove" ? event.clientX : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onFinish(event) {
    const pointerPosition = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.dist.finalPosition = this.dist.movePosition;
    this.wrapper.removeEventListener("mousemove", this.onMove);
    this.transition(true);
    this.changeSlideOnFinish();
  }

  activNextSlide() {
    if (this.index.next) {
      this.changeSlide(this.index.next);
      this.slideArray[this.index.prev].item.classList.remove(this.activeClass);
    }
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
      this.slideArray[this.index.next].item.classList.remove(this.activeClass);
    }
  }

  changeSlideOnFinish() {
    if (this.dist.movement > 70 && this.index.next !== undefined) {
      this.activNextSlide();
    } else if (this.dist.movement < -70 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
    this.changeActiveClass();
  }

  onStart(event) {
    let moveType;
    if (event.type === "mousedown") {
      event.preventDefault();
      this.dist.startX = event.clientX;
      moveType = "mousemove";
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      moveType = "touchmove";
    }
    this.wrapper.addEventListener(moveType, this.onMove);
    this.transition(false);
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onFinish);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("touchend", this.onFinish);
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    return (this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    });
  }

  slideConfig() {
    this.slideArray = [...this.slide.children].map((item) => {
      const position = item.offsetLeft;
      return { item, position };
    });
    return this.slideArray;
  }

  calcMargin(index) {
    return (this.wrapper.offsetWidth - this.slideConfig()[index].item.offsetWidth) / 2;
  }

  offsetWidthMarginLeft(index) {
    const position = this.slideConfig()[index].position;
    const margin = this.calcMargin(index);
    return -(position - margin);
  }

  changeActiveClass() {
    this.slideArray[this.index.active].item.classList.add(this.activeClass);
  }

  changeSlide(index) {
    this.moveSlide(this.offsetWidthMarginLeft(index));
    this.slidesIndexNav(index);
    this.dist.finalPosition = this.offsetWidthMarginLeft(index);
  }

  onResize() {
    setTimeout(() => {
      this.slideConfig();
      this.changeSlide(this.index.active);
    }, 500);
  }

  addResizeEvent() {
    window.addEventListener("resize", this.onResize);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onFinish = this.onFinish.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 50);
    this.clickSlide = this.clickSlide.bind(this);
  }

  init() {
    this.transition();
    this.bindEvents();
    this.addSlideEvents();
    this.changeSlide(2);
    this.changeActiveClass();
    this.addResizeEvent();
    this.addClickNavEvent();
    return this;
  }
}

export class SlideNav extends Slide {
  clickSlide(event) {
    event.preventDefault();
    const form = document.forms.nav;
    console.log(form.next);
    if (form.next == event.target) {
      this.activNextSlide();
      this.changeActiveClass();
    } else if (form.prev == event.target) {
      this.activePrevSlide();
      this.changeActiveClass();
    }
  }

  addClickNavEvent() {
    document.forms.nav.addEventListener("click", this.clickSlide);
  }
}
