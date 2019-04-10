/**
 * @param {HTMLElement} containerDOM
 * @param {RectangleShape} Shape
 */
export const DrawShape = function (containerDOM, Shape) {
	
	// noinspection JSMismatchedCollectionQueryUpdate
	/**
	 * Keep track of all drawn shapes
	 * not useful for now
	 * 
	 * @type {Set<RectangleShape>}
	 */
	const shapes = new Set();
	
	/**
	 * @type {Set<RectangleShape>}
	 */
	let rotatingShapes = new Set();
	let numberOfRotatingShapes = 0;
	
	
	/**
	 * @param {RectangleShape} shape
	 * @private
	 */
	function _onShapeRotateStart(shape) {
		rotatingShapes.add(shape);
		numberOfRotatingShapes++;
	}
	
	/**
	 * @param {RectangleShape} shape
	 * @private
	 */
	function _onShapeRotateStop(shape) {
		numberOfRotatingShapes--;
		
		if (numberOfRotatingShapes) return;
		
		// Remove all shapes having rotated & finished
		rotatingShapes.forEach(shape => {
			shapes.delete(shape);
			
			shape.remove();
		});
		
		rotatingShapes = new Set();
	}
	
	
	/**
	 * @param {MouseEvent} event
	 * @private
	 */
	function _onMouseDown(event) {
		// avoid parallel drawings
		containerDOM.removeEventListener('mousedown', _onMouseDown);
		
		// Instantiate a new Shape and set up drawing callbacks
		const shape = new Shape({
			x: event.x,
			y: event.y,
			onRotationStart: _onShapeRotateStart,
			onRotationStop: _onShapeRotateStop
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
				shapes.add(shape);
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
