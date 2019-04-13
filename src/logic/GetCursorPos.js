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
		x: mouseEvent.pageX - refRect.left,
		y: mouseEvent.pageY - refRect.top,
	};
}
