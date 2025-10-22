/**
 * @typedef {import('./ContentZoom.js').Mode} Mode
 */

/**
 * @type {Mode}
 */
export class Dialog {
    /**
     * @type {HTMLDialogElement}
     */
    #dialog = document.createElement('dialog');

    /**
     * @param {object} contentZoom
     */
    constructor(contentZoom) {
        this.contentZoom = contentZoom;

        this.#createDialog();
    }

    zoomIn() {
        this.#dialog.showModal();
    }

    zoomOut() {
        this.#dialog.close();
    }

    #createDialog() {
        const closeButton = document.createElement('button');

        Object.assign(closeButton, {
            textContent: this.contentZoom.options.labels.zoomOut,
            type: 'button'
        });

        closeButton.classList.add(this.contentZoom.options.classes.button);
        closeButton.classList.add(this.contentZoom.options.classes.buttonActive);
        closeButton.addEventListener('click', this.contentZoom.zoomOut);

        this.#dialog.innerHTML = this.contentZoom.options.el.innerHTML;
        this.#dialog.classList.add(this.contentZoom.options.classes.dialog);
        this.#dialog.addEventListener('close', this.#cleanUpAfterClose);
        this.#dialog.prepend(closeButton);

        document.body.append(this.#dialog);
    }

    #cleanUpAfterClose = () => {
        if (this.contentZoom.zoomed === false) {
            return;
        }

        this.contentZoom.zoomed = false;
        this.contentZoom.zoomButton.textContent = this.contentZoom.options.labels.zoomIn;
    };
}