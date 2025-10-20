/**
 * @typedef {import('./ContentZoom.js').Mode} Mode
 */

/**
 * @type {Mode}
 */
export class FullBleed {
    /**
     * @param {object} options
     */
    constructor(options) {
        this.options = options;
    }

    zoomIn() {
        this.options.el.classList.add(this.options.classes.contendZoomed);
    }

    zoomOut() {
        this.options.el.classList.remove(this.options.classes.contendZoomed);
    }
}