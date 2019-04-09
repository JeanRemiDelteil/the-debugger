import {DrawShape} from './DrawRectangle.js';
import {RectangleShape} from './RectangleShape.js';


const rectangleDrawer = DrawShape(document.body, RectangleShape);

rectangleDrawer.setListeners();
