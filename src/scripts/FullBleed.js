/**
 * @typedef {import('./ContentZoom.js').Mode} Mode
 */

/**
 * @type {Mode}
 */
export class FullBleed {
    /**
     * @type {string}
     */
    #pendingEvent = '';

    /**
     * @param {object} contentZoom
     */
    constructor(contentZoom) {
        this.contentZoom = contentZoom;
    }

    init() {}

    zoomIn() {
        const el = this.contentZoom.options.el;

        el.addEventListener('transitionend', this.#onTransitionEnd, { once: true });
        el.classList.add(this.contentZoom.options.classes.zoomed);

        this.#pendingEvent = 'afterZoomIn';
    }

    zoomOut() {
        const el = this.contentZoom.options.el;

        el.addEventListener('transitionend', this.#onTransitionEnd, { once: true });
        el.classList.remove(this.contentZoom.options.classes.zoomed);

        this.#pendingEvent = 'afterZoomOut';
    }

    #onTransitionEnd = () => {
        this.contentZoom.emitEvent(this.#pendingEvent);
        this.#pendingEvent = '';
    }
}