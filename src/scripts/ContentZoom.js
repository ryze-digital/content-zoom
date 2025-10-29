import { Base, ReduceFunctionCalls } from '@ryze-digital/js-utilities';
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
     * @type {string}
     */
    #lang = 'en';

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
            i18n: {
                languages: ['en', 'de'],
                zoomIn: {
                    en: 'Expand content',
                    de: 'Inhalt erweitern',
                },
                zoomOut: {
                    en: 'Collapse content',
                    de: 'Inhalt reduzieren',
                }
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

        this.#setLanguage();
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

    #setLanguage() {
        if (this.options.i18n.languages.includes(document.documentElement.lang) === false) {
            return;
        }

        this.#lang = document.documentElement.lang;
    }

    /**
     * @param {string} keyword
     * @returns {string}
     */
    getTranslation(keyword) {
        const translation = this.options.i18n[keyword];

        if (typeof translation === 'string') {
            return translation;
        }

        if (typeof translation === 'object') {
            return translation[this.#lang];
        }
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
            textContent: this.getTranslation('zoomIn'),
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
            textContent: this.getTranslation('zoomIn'),
            ariaExpanded: 'false'
        });
    };

    zoomIn = () => {
        /**
         * @event ContentZoom#beforeZoomIn
         */
        this.emitEvent('beforeZoomIn');

        this.#mode.zoomIn();
        this.zoomed = true;

        Object.assign(this.zoomButton, {
            textContent: this.getTranslation('zoomOut'),
            ariaExpanded: 'true'
        });
    };
}