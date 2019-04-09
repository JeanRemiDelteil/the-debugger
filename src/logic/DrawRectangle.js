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
		// avoid parallel drawings
		containerDOM.removeEventListener('mousedown', _onMouseDown);
		
		
		// Instantiate a new Shape and set up drawing callbacks
		const shape = new Shape({
			x: event.x,
			y: event.y,
		});
		shapes.push(shape);
		
		
		/**
		 * @param {MouseEvent} event
		 */
		function _onMouseMove(event) {
			shape.onMove({
				x: event.x,
				y: event.y,
			});
		}
		
		/**
		 * @param {MouseEvent} event
		 */
		function _onMouseUp(event) {
			containerDOM.removeEventListener('mousemove', _onMouseMove);
			containerDOM.removeEventListener('mouseup', _onMouseUp);
			containerDOM.removeEventListener('mouseleave', _onMouseUp);
			
			shape.onFinalize({
				x: event.x,
				y: event.y,
			});
			
			// Set initial listener back !
			containerDOM.addEventListener('mousedown', _onMouseDown);
		}
		
		containerDOM.addEventListener('mousemove', _onMouseMove);
		containerDOM.addEventListener('mouseup', _onMouseUp);
		containerDOM.addEventListener('mouseleave', _onMouseUp);
		
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
