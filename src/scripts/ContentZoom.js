import { Base } from '@ryze-digital/js-utilities';

export class ContentZoom extends Base {
    /**
     * @param {object} options
     * @param {HTMLElement} [options.container]
     * @param {HTMLElement} [options.overflowElement]
     * @param {string} [options.buttonLabel]
     */
    constructor(options) {
        super({
            container: document.querySelector('.content-zoom'),
            overflowElement: null,
            buttonLabel: 'Zoom',
            classes: {
                contendZoomed: 'zoom',
                triggerButton: 'content-zoom-trigger'
            }
        }, options);

        if (this.options.overflowElement === null) {
            this.options.overflowElement = this.options.container;
        }

        if (this.#isContentOverflowing()) {
            this.#appendZoomButton();
        }
    }

    /**
     * @returns {boolean}
     */
    #isContentOverflowing() {
        return this.options.overflowElement.scrollWidth > this.options.overflowElement.clientWidth;
    }

    #appendZoomButton() {
        const zoomButton = document.createElement('button');

        Object.assign(zoomButton, {
            textContent: this.options.buttonLabel,
            ariaHidden: 'true',
        });

        zoomButton.classList.add(this.options.classes.triggerButton);
        zoomButton.addEventListener('click', this.toggleZoom);

        this.options.container.prepend(zoomButton);
    }

    toggleZoom = () => {
        this.options.container.classList.toggle(this.options.classes.contendZoomed);
    };
}