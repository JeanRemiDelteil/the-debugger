/**
 * @param {HTMLElement} containerDOM
 * @param {RectangleShape} Shape
 */
export const DrawShape = function (containerDOM, Shape) {
	
	/**
	 * @type {RectangleShape[]}
	 */
	const shapes = [];
	
	
	/**
	 * @param {MouseEvent} event
	 */
	function _onMouseDown(event) {
		
		// Instantiate a new Shape and set up drawing callbacks
		const shape = new Shape(event);
		shapes.push(shape);
		
		
		/**
		 * @param {MouseEvent} event
		 */
		function _onMouseMove(event) {
			shape.onMove(event);
		}
		
		/**
		 * @param {MouseEvent} event
		 */
		function _onMouseUp(event) {
			containerDOM.removeEventListener('mousemove', _onMouseMove);
			containerDOM.removeEventListener('mouseup', _onMouseUp);
			
			shape.onFinalize(event);
		}
		
		containerDOM.addEventListener('mousemove', _onMouseMove);
		containerDOM.addEventListener('mouseup', _onMouseUp);
		
		containerDOM.appendChild(shape.getElement());
	}
	
	
	function setListeners() {
		containerDOM.addEventListener('mousedown', _onMouseDown);
	}
	
	function removeListeners() {
		containerDOM.removeEventListener('mousedown', _onMouseDown);
	}
	
	
	// noinspection JSUnusedGlobalSymbols
	return {
		setListeners,
		removeListeners,
	};
};
