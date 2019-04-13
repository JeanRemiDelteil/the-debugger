/**
 * In percents of container size
 * @type {number}
 */
const MINIMUM_SHAPE_SIZE = 1;


export class RectangleShape {
	
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {function(shape: RectangleShape): void} onRotationStart
	 * @param {function(shape: RectangleShape): void} onRotationStop
	 */
	constructor({x, y, onRotationStart, onRotationStop}) {
		this._onRotationEnd = this._onRotationEnd.bind(this);
		
		this._callbacks = {
			onRotationStart,
			onRotationStop,
		};
		this._hasRotated = false;
		
		this._startingPoint = {x, y};
		this._endingPoint = this._startingPoint;
		
		this._initElement();
		this._updateElementPosition();
	}
	
	
	//<editor-fold desc="Private methods">
	
	/**
	 * @private
	 */
	_initElement() {
		const elementDom = document.createElement('div');
		
		elementDom.classList.add('shape-rectangle');
		
		this._color = Math
			.trunc(Math.random() * 0xffffff)
			.toString(16)
			.padStart(6, '0');
		
		elementDom.style.backgroundColor = `#${this._color}`;
		
		this._elementDom = elementDom;
	}
	
	/**
	 * @private
	 */
	_updateElementPosition() {
		if (this._startingPoint === this._endingPoint) return;
		
		const endPoint = {
			...this._endingPoint,
		};
		
		let width = Math.abs(endPoint.x - this._startingPoint.x);
		let height = Math.abs(endPoint.y - this._startingPoint.y);
		
		if (width < MINIMUM_SHAPE_SIZE) {
			width = MINIMUM_SHAPE_SIZE;
			endPoint.x = this._startingPoint.x + Math.sign(endPoint.x - this._startingPoint.x) * MINIMUM_SHAPE_SIZE;
		}
		if (height < MINIMUM_SHAPE_SIZE) {
			height = MINIMUM_SHAPE_SIZE;
			endPoint.y = this._startingPoint.y + Math.sign(endPoint.y - this._startingPoint.y) * MINIMUM_SHAPE_SIZE;
		}
		
		const left = Math.min(this._startingPoint.x, endPoint.x);
		const top = Math.min(this._startingPoint.y, endPoint.y);
		
		
		this._elementDom.style.left = `${left}%`;
		this._elementDom.style.top = `${top}%`;
		
		this._elementDom.style.width = `${width}%`;
		this._elementDom.style.height = `${height}%`;
	}
	
	/**
	 * @private
	 */
	_onDoubleClick() {
		if (this._hasRotated) return;
		this._hasRotated = true;
		
		this._elementDom.addEventListener('transitionend', this._onRotationEnd);
		this._callbacks.onRotationStart(this);
		
		this._elementDom.style.transform = 'rotate(360deg)';
	}
	
	/**
	 * @private
	 */
	_onRotationEnd() {
		this._elementDom.removeEventListener('transitionend', this._onRotationEnd);
		this._callbacks.onRotationStop(this);
	}
	
	//</editor-fold>
	
	
	/**
	 * @return {HTMLDivElement}
	 */
	getElement() {
		return this._elementDom;
	}
	
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	draw({x, y}) {
		this._endingPoint = {x, y};
		
		this._updateElementPosition();
	}
	
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	finalize({x, y}) {
		this.draw({x, y});
		
		this._elementDom.addEventListener('dblclick', () => this._onDoubleClick());
	}
	
	/**
	 * Removes the Dom element from its parents and clean up
	 */
	remove() {
		if (!this._elementDom) return;
		if (!this._elementDom.parentElement) {
			this._elementDom = null;
			
			return;
		}
		
		this._elementDom.parentElement.removeChild(this._elementDom);
		this._elementDom = null;
	}
}
