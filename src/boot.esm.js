import {DrawShape} from './logic/DrawRectangle.js';
import {RectangleShape} from './logic/RectangleShape.js';


const rectangleDrawer = DrawShape(document.body, RectangleShape);

rectangleDrawer.setListeners();
