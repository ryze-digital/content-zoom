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
        this.#dialog.show();
    }

    zoomOut() {
        this.#dialog.close();
    }

    #createDialog() {
        const closeButton = document.createElement('button');

        this.#dialog.innerHTML = this.contentZoom.options.el.innerHTML;
        this.#dialog.classList.add(this.contentZoom.options.classes.dialog);

        closeButton.innerText = 'Close';
        closeButton.addEventListener('click', this.contentZoom.zoomOut);

        this.#dialog.prepend(closeButton);
        document.body.append(this.#dialog);
    }
}