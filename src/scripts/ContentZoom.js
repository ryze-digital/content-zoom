export class ContentZoom {
    /**
     * @param {HTMLElement} container
     * @param {HTMLElement} overflowElement
     * @param {string} buttonLabel
     */
    constructor(
        container = document.querySelector('.content-zoom'),
        overflowElement,
        buttonLabel = 'Zoom'
    ) {
        if (typeof overflowElement === 'undefined') {
            overflowElement = container;
        }

        this.container = container;
        this.overflowElement = overflowElement;
        this.buttonLabel = buttonLabel;

        if (this.#isContentOverflowing) {
            this.#appendZoomButton();
        }
    }

    /**
     * @returns {boolean}
     */
    #isContentOverflowing() {
        return this.overflowElement.scrollWidth > this.overflowElement.clientWidth;
    }

    #appendZoomButton() {
        const zoomButton = document.createElement('button');

        Object.assign(zoomButton, {
            textContent: this.buttonLabel,
            ariaHidden: 'true',
        });

        zoomButton.classList.add('content-zoom-trigger');
        zoomButton.addEventListener('click', this.toggleZoom);

        this.container.prepend(zoomButton);
    }

    toggleZoom = () => {
        this.container.classList.toggle('zoom');
    };
}