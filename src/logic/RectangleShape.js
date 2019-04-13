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
		this._endingPoint = {x, y};
		
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
		const left = Math.min(this._startingPoint.x, this._endingPoint.x);
		const top = Math.min(this._startingPoint.y, this._endingPoint.y);
		
		const width = Math.abs(this._endingPoint.x - this._startingPoint.x);
		const height = Math.abs(this._endingPoint.y - this._startingPoint.y);
		
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
