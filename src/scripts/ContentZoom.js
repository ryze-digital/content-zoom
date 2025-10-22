import { Base, ReduceFunctionCalls } from '@ryze-digital/js-utilities';
import { FullBleed } from './FullBleed.js';
import { Dialog } from './Dialog.js';

/**
 * @typedef {object} Mode
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
            autoDetectOverflow: true,
            autoDetectZoomability: true,
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
                triggerButton: 'content-zoom-trigger',
                dialog: 'content-zoom-dialog'
            }
        }, options);

        if (this.options.elements.overflowingChild === null) {
            this.options.elements.overflowingChild = this.options.el;
        }

        this.#mode = new Modes[this.options.mode](this);

        this.#appendZoomButton();
        window.addEventListener('resize', ReduceFunctionCalls.throttle(this.#updateZoomButtonVisibility));
    }
    
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
    #isViewportIsBiggerThanEl() {
        if (this.options.autoDetectZoomability === false) {
            return true;
        }

        return this.options.elements.limitingAncestor.clientWidth > this.options.el.clientWidth;
    }

    #appendZoomButton() {
        Object.assign(this.zoomButton, {
            textContent: this.options.labels.zoomIn,
            ariaHidden: 'true'
        });

        this.#updateZoomButtonVisibility();
        this.zoomButton.classList.add(this.options.classes.triggerButton);
        this.zoomButton.addEventListener('click', this.toggleZoom);

        if (this.options.elements.buttonTarget === null) {
            this.options.el.prepend(this.zoomButton);
        } else {
            this.options.elements.buttonTarget.append(this.zoomButton);
        }
    }

    #updateZoomButtonVisibility = () => {
        this.zoomButton.hidden = !((this.#isContentOverflowing() && this.#isViewportIsBiggerThanEl()) || this.#zoomed === true);
    };

    toggleZoom = () => {
        this.#zoomed ? this.zoomOut() : this.zoomIn();
    };

    zoomOut = () => {
        this.#mode.zoomOut();
        this.zoomed = false;
        this.zoomButton.textContent = this.options.labels.zoomIn;
    };

    zoomIn = () => {
        this.#mode.zoomIn();
        this.zoomed = true;
        this.zoomButton.textContent = this.options.labels.zoomOut;
    };
}