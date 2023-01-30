import { LitElement, html, css } from "lit"

export class IgVideo extends LitElement {

    static get styles () {
        return css`
            :host {
                display: block;
            }

            #video-container {
                /* use grid to set the caption */
                display: grid;
                grid-template-rows: 1fr auto;
                break-inside: avoid;

                gap: 0;
            }

            #video-container:hover #caption {
                visibility: visible;
            }

            video {
                max-inline-size: 100%;
                block-size: 100%;

                grid-row: 1 / -1;
                grid-column: 1;
            }

            #caption {
                inline-size: var(--w-size);
                padding: 1rem;
                grid-row: 2;
                grid-column: 1;

                visibility: hidden;

                background-color: rgba(255, 255, 255, 0.5);
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

    render () {

        // {
        //     id: '1821....',
        //     caption: '#orangeboom',
        //     media_type: 'VIDEO',
        //     media_url: 'https://scontent.cdninstagram.com/...',
        //     timestamp: '2022-10-124....',
        //     username: 'cicciosgamino'
        // }

        // https://developers.facebook.com/docs/instagram-basic-display-api/reference/media/

        // video - autoplay controls muted
        if (this.igData.media_type === 'VIDEO') {
            return html`
                <div  id="video-container">
                    <video src=${this.igData.media_url} autoplay>
                        <p>Your browser doesn't support HTML video.</p>
                    </video>
                    <p id="caption">${this.shortCaption(this.igData.caption)}</p>
                </div>
            `
        }

    }
}

customElements.define('ig-video', IgVideo)
