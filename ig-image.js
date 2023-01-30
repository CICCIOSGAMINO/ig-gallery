import { LitElement, html, css } from "lit"

export class IgImage extends LitElement {

    static get styles () {
        return css`
            :host {
                display: block;
            }

            figure {
                padding: 0;
                margin: 0;

                display: grid;
                grid-template-rows: 1fr auto;
                break-inside: avoid;

                height: 100%;
                object-fit: contain;
            }

            figure:hover figcaption {
                visibility: visible;
            }

            img {
                /* never render at a size wider than container */
                max-inline-size: 100%;
                /* aspect-ration of image will remain constant */
                /* block-size: auto; */
                block-size: 100%;
                
                object-fit: cover;

                grid-row: 1 / -1;
                grid-column: 1;
            }

            figcaption {
                padding: 1rem;
                margin: 0;
                
                grid-row: 2;
                grid-column: 1;

                visibility: hidden;

                font-family: var(--caption-font-family, inherit);
                font-size: var(--caption-font-size);
                color: var(--caption-color, #333);
                background-color: var(--caption-bk-color, rgba(255, 255, 255, 0.5));
                /* justify-self: start; */
            }
        `
    }

    static get properties () {
        return {
            igData: {
                type: Object,
                state: true,
                attribute: false
            }
        }
    }

    shortCaption (caption) {
        if (!caption) return

        return caption.slice(0, 47)
    }

    handleImageLoaded (event) {

        const figure =
            this.renderRoot.querySelector('figure')
        const aspect =
            event.target.naturalWidth / event.target.naturalHeight

        // if landscape span 2 columns
        if (aspect > 1.4) {
            this.classList.add('landscape')
        }

        // if square center image
        // if (aspect === 1) {
        //     this.classList.add('square')
        // }

        // if portrait use class portrait
        // if (aspect < 0.85) {
        //     this.classList.add('portrait')
        // }

        // @DEBUG
        // console.log(`@${event.target} >> ${event.target} ${aspect} `)
    }

    renderImage () {

        // https://developers.facebook.com/docs/instagram-basic-display-api/reference/media/
        if (this.igData.media_type === 'IMAGE') {
            return html`
                <figure>
                    <img
                        src=${this.igData.media_url}
                        @load=${this.handleImageLoaded}
                        alt=${this.igData.caption}>
                    <figcaption>${this.shortCaption(this.igData.caption)}</figcaption>
                </figure>
            `
        }

    }

    renderCarousel () {

        // https://developers.facebook.com/docs/instagram-basic-display-api/reference/media/
        if (this.igData.media_type === 'CAROUSEL_ALBUM') {

            return html`
                <figure>
                    <img
                        src=${this.igData.media_url}
                        @load=${this.handleImageLoaded}
                        alt=${this.igData.caption}>
                    <figcaption>${this.shortCaption(this.igData.caption)}</figcaption>
                </figure>
            `
        }

    }

    render () {

        // {
        //     id: '1821....',
        //     caption: '#orangeboom',
        //     media_type: 'IMAGE',
        //     media_url: 'https://scontent.cdninstagram.com/...',
        //     timestamp: '2022-10-124....',
        //     username: 'cicciosgamino'
        // }

        return html`

            ${this.renderImage()}
            ${this.renderCarousel()}
        `

    }
}

customElements.define('ig-image', IgImage)
