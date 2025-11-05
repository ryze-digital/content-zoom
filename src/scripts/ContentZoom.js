import { Base, ReduceFunctionCalls, Tracker } from '@ryze-digital/js-utilities';
import { FullBleed } from './FullBleed.js';
import { Dialog } from './Dialog.js';

/**
 * @typedef {object} Mode
 * @property {Function} init
 * @property {Function} zoomIn
 * @property {Function} zoomOut
 */
const Modes = { FullBleed, Dialog };

export class ContentZoom extends Base {
    /**
     * @type {Mode}
     */
    #mode;

    /**
     * @type {HTMLButtonElement}
     */
    zoomButton = document.createElement('button');

    /**
     * @type {boolean}
     */
    #zoomed = false;

    /**
     * @type {Tracker}
     */
    #tracker;

    /**
     * @param {object} options
     * @param {HTMLElement} [options.el]
     * @param {'FullBleed'|'Dialog'} [options.mode]
     * @param {boolean} [options.autoDetectOverflow]
     * @param {boolean} [options.autoDetectZoomability]
     * @param {string} [options.buttonLabel]
     * @param {object} [options.elements]
     * @param {object} [options.classes]
     */
    constructor(options) {
        super({
            el: document.querySelector('.content-zoom'),
            mode: 'FullBleed',
            autoDetectOverflow: false,
            autoDetectZoomability: true,
            tracking: false,
            labels: {
                zoomIn: 'Expand content',
                zoomOut: 'Collapse content'
            },
            elements: {
                overflowingChild: null,
                limitingAncestor: document.body,
                buttonTarget: null
            },
            classes: {
                zoomed: 'zoom',
                button: 'content-zoom-trigger',
                dialog: 'content-zoom-dialog'
            }
        }, options);

        if (this.options.elements.overflowingChild === null) {
            this.options.elements.overflowingChild = this.options.el;
        }

        if (this.options.tracking === true) {
            this.#tracker = new Tracker();
        }

        this.#mode = new Modes[this.options.mode](this);
    }

    init() {
        this.#mode.init();
        this.#appendZoomButton();
        window.addEventListener('resize', ReduceFunctionCalls.throttle(this.#updateZoomButtonVisibility));

        /**
         * @event ContentZoom#afterInit
         */
        this.emitEvent('afterInit');
    }

    /**
     * @returns {boolean}
     */
    get zoomed() {
        return this.#zoomed;
    }

    /**
     * @param {boolean} state
     */
    set zoomed(state) {
        if (typeof state !== 'boolean') {
            throw new Error('The zoomed state must be a boolean.');
        }

        this.#zoomed = state;
    }

    /**
     * @returns {boolean}
     */
    #isContentOverflowing() {
        if (this.options.autoDetectOverflow === false) {
            return true;
        }

        return this.options.elements.overflowingChild.scrollWidth > this.options.elements.overflowingChild.clientWidth;
    }

    /**
     * @returns {boolean}
     */
    #isViewportBiggerThanEl() {
        if (this.options.autoDetectZoomability === false) {
            return true;
        }

        return this.options.elements.limitingAncestor.clientWidth > this.options.el.clientWidth;
    }

    #appendZoomButton() {
        Object.assign(this.zoomButton, {
            textContent: this.options.labels.zoomIn,
            ariaExpanded: 'false',
            type: 'button'
        });

        this.#updateZoomButtonVisibility();
        this.zoomButton.classList.add(this.options.classes.button);
        this.zoomButton.addEventListener('click', this.toggleZoom);

        if (this.options.el.id !== '') {
            this.zoomButton.setAttribute('aria-controls', this.options.el.id);
        }

        if (this.options.elements.buttonTarget === null) {
            this.options.el.prepend(this.zoomButton);
        } else {
            this.options.elements.buttonTarget.append(this.zoomButton);
        }
    }

    #updateZoomButtonVisibility = () => {
        this.zoomButton.hidden = !((this.#isContentOverflowing() && this.#isViewportBiggerThanEl()) || this.#zoomed === true);
    };

    toggleZoom = () => {
        this.#zoomed ? this.zoomOut() : this.zoomIn();
    };

    zoomOut = () => {
        /**
         * @event ContentZoom#beforeZoomOut
         */
        this.emitEvent('beforeZoomOut');

        this.#mode.zoomOut();
        this.zoomed = false;

        Object.assign(this.zoomButton, {
            textContent: this.options.labels.zoomIn,
            ariaExpanded: 'false'
        });

        this.#track('zoomOut');
    };

    zoomIn = () => {
        /**
         * @event ContentZoom#beforeZoomIn
         */
        this.emitEvent('beforeZoomIn');

        this.#mode.zoomIn();
        this.zoomed = true;

        Object.assign(this.zoomButton, {
            textContent: this.options.labels.zoomOut,
            ariaExpanded: 'true'
        });

        this.#track('zoomIn');
    };

    /**
     * @param {string} action
     * @param {number} value
     */
    #track = (action, value = undefined) => {
        if (this.options.tracking === false) {
            return;
        }

        this.#tracker.track('Content Zoom', action, this.options.el.id, value);
    };
}