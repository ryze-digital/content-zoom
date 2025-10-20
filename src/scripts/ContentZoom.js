import { Base, ReduceFunctionCalls } from '@ryze-digital/js-utilities';
import { FullBleed } from './FullBleed.js';

/**
 * @typedef {object} Mode
 * @property {Function} zoomIn
 * @property {Function} zoomOut
 */
const Modes = { FullBleed };

export class ContentZoom extends Base {
    /**
     * @type {Mode}
     */
    #mode;

    /**
     * @type {HTMLButtonElement}
     */
    #zoomButton = document.createElement('button');

    /**
     * @type {boolean}
     */
    #contentZoomed = false;

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
            buttonLabel: 'Zoom',
            elements: {
                overflowingChild: null,
                limitingAncestor: document.body,
                buttonTarget: null
            },
            classes: {
                contendZoomed: 'zoom',
                triggerButton: 'content-zoom-trigger'
            }
        }, options);

        if (this.options.elements.overflowingChild === null) {
            this.options.elements.overflowingChild = this.options.el;
        }

        this.#mode = new Modes[this.options.mode](this.options);

        this.#appendZoomButton();
        window.addEventListener('resize', ReduceFunctionCalls.throttle(this.#updateZoomButtonVisibility));
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
        Object.assign(this.#zoomButton, {
            textContent: this.options.buttonLabel,
            ariaHidden: 'true'
        });

        this.#updateZoomButtonVisibility();
        this.#zoomButton.classList.add(this.options.classes.triggerButton);
        this.#zoomButton.addEventListener('click', this.toggleZoom);

        if (this.options.elements.buttonTarget === null) {
            this.options.el.prepend(this.#zoomButton);
        } else {
            this.options.elements.buttonTarget.append(this.#zoomButton);
        }
    }

    #updateZoomButtonVisibility = () => {
        this.#zoomButton.hidden = !((this.#isContentOverflowing() && this.#isViewportIsBiggerThanEl()) || this.#contentZoomed === true);
    };

    toggleZoom = () => {
        if (this.#contentZoomed) {
            this.#mode.zoomOut();
            this.#contentZoomed = false;
        } else {
            this.#mode.zoomIn();
            this.#contentZoomed = true;
        }
    };
}