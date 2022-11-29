export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    };
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
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onFinish);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("touchend", this.onFinish);
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
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

  changeSlide(index) {
    this.moveSlide(this.offsetWidthMarginLeft(index));
    this.slidesIndexNav(index);
    this.dist.finalPosition = this.offsetWidthMarginLeft(index);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    return this;
  }
}
