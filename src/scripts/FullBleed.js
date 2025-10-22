/**
 * @typedef {import('./ContentZoom.js').Mode} Mode
 */

/**
 * @type {Mode}
 */
export class FullBleed {
    /**
     * @param {object} contentZoom
     */
    constructor(contentZoom) {
        this.contentZoom = contentZoom;
    }

    zoomIn() {
        this.contentZoom.options.el.classList.add(this.contentZoom.options.classes.zoomed);
    }

    zoomOut() {
        this.contentZoom.options.el.classList.remove(this.contentZoom.options.classes.zoomed);
    }
}