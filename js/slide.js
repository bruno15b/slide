export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
  }

  onFinish() {
    this.wrapper.removeEventListener("mousemove", this.onMove);
  }

  onMove(event) {
    console.log(event);
  }

  onStart(event) {
    event.preventDefault();
    this.wrapper.addEventListener("mousemove", this.onMove);
    this.wrapper.addEventListener("mouseup", this.onFinish);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    return this;
  }
}
