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
    }

    toggleZoom = () => {
        this.options.el.classList.toggle(this.options.classes.contendZoomed);
    };
}