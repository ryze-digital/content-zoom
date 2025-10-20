import { Base, ReduceFunctionCalls } from '@ryze-digital/js-utilities';

export class ContentZoom extends Base {
    /**
     * @type {HTMLButtonElement}
     * */
    #zoomButton = document.createElement('button');

    /**
     * @type {boolean}
     */
    #contentZoomed = false;

    /**
     * @param {object} options
     * @param {HTMLElement} [options.el]
     * @param {boolean} [options.autoDetectOverflow]
     * @param {HTMLElement} [options.overflowElement]
     * @param {string} [options.buttonLabel]
     */
    constructor(options) {
        super({
            el: document.querySelector('.content-zoom'),
            autoDetectOverflow: true,
            autoDetectZoomability: true,
            overflowElement: null,
            zoomabilityElement: document.body,
            buttonLabel: 'Zoom',
            classes: {
                contendZoomed: 'zoom',
                triggerButton: 'content-zoom-trigger'
            }
        }, options);

        if (this.options.overflowElement === null) {
            this.options.overflowElement = this.options.el;
        }

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

        return this.options.overflowElement.scrollWidth > this.options.overflowElement.clientWidth;
    }

    /**
     * @returns {boolean}
     */
    #isViewportIsBiggerThanEl() {
        if (this.options.autoDetectZoomability === false) {
            return true;
        }

        return this.options.zoomabilityElement.clientWidth > this.options.el.clientWidth;
    }

    #appendZoomButton() {
        Object.assign(this.#zoomButton, {
            textContent: this.options.buttonLabel,
            ariaHidden: 'true'
        });

        this.#updateZoomButtonVisibility();
        this.#zoomButton.classList.add(this.options.classes.triggerButton);
        this.#zoomButton.addEventListener('click', this.toggleZoom);

        this.options.el.prepend(this.#zoomButton);
    }

    #updateZoomButtonVisibility = () => {
        this.#zoomButton.hidden = !((this.#isContentOverflowing() && this.#isViewportIsBiggerThanEl()) || this.#contentZoomed === true);
    }

    toggleZoom = () => {
        this.options.el.classList.toggle(this.options.classes.contendZoomed);
    };
}