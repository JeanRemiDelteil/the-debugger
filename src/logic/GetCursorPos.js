/**
 * Return cursor position relative to the given reference Element
 *
 * @param {MouseEvent} mouseEvent
 * @param {HTMLElement} refElementDOM
 *
 * @return {{x: number, y: number}}
 */
export function getCursorPos(mouseEvent, refElementDOM) {
	// /!\ resource consuming, but best solution to get a correct positioning
	const refRect = refElementDOM.getBoundingClientRect();
	
	return {
		x: 100 * (mouseEvent.pageX - refRect.left) / refRect.width,
		y: 100 * (mouseEvent.pageY - refRect.top) / refRect.height,
	};
}
