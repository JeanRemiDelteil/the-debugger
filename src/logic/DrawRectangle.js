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
		let hasMouseMoved = false;
		
		
		/**
		 * @param {MouseEvent} event
		 */
		function _onMouseMove(event) {
			shape.draw({
				x: event.x,
				y: event.y,
			});
			
			/**
			 * Double click is fired only if the mouse did not moved between clicks
			 */
			hasMouseMoved = true;
		}
		
		/**
		 * @param {MouseEvent} event
		 */
		function _onMouseUp(event) {
			containerDOM.removeEventListener('mousemove', _onMouseMove);
			containerDOM.removeEventListener('mouseup', _onMouseUp);
			containerDOM.removeEventListener('mouseleave', _onMouseUp);
			
			if (hasMouseMoved) {
				shape.finalize({
					x: event.x,
					y: event.y,
				});
				shapes.push(shape);
			}
			else {
				shape.remove();
			}
			
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
