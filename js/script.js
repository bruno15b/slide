import { Slide, SlideNav } from "./slide.js";

const slide = new SlideNav(".slide", ".wrapper", "button");
slide.init(2, ".custom-controls");
