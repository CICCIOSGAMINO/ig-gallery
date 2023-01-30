// ig-gallery - v0.2.0  30-01-2023
import { LitElement, html, css } from 'lit'
// import { LONG_LIVED_TOKEN } from './config.js'

import './ig-image.js'
import './ig-video.js'

const IG_KEY = 'ig-data-key'    // localStorage key
const CACHE_TTL = 86400 * 1000   // cache TLL in ms (24hours)

// this view is the instagram oauth callback
export class IgGallery extends LitElement {

    static get styles () {
        return css`
            :host {
                --n-columns: var(--n-columns: 5);
                --n-rows: var(--n-rows, 1);

                --caption-bk-color: var(--caption-bk-color, rgba(255, 255, 255, 0.5));
                --caption-color: var(--caption-color, whitesmoke);
                --caption-font-family: var(--caption-font-family, 'Caveat');
                --caption-font-size: var(--caption-font-size, 2.3rem);

                display: block;
                overflow: hidden;
            }

            #videos-container {
                display: grid;
                grid-template-columns: repeat(var(--n-columns, 3), 1fr);
                grid-template-rows: repeat(var(--n-rows, 1), 1fr);
                /* no empty space */
                grid-auto-flow: dense;

                gap: 0;
            }

            #images-container {
                display: grid;
                grid-template-columns: repeat(var(--n-columns,3), 1fr);
                grid-template-rows: repeat(var(--n-rows, 2), 1fr);
                /* no empty space */
                grid-auto-flow: dense;

                gap: 0;
            }

            .landscape {
                grid-column-end: span 2;
            }
        `
    }

    static get properties () {
        return {
            data: {
                type: Array,
                state: true,
                attribute: false
            },
            paging: {
                type: Object,
                state: true,
                attribute: false
            },
            error: {
                type: Object,
                state: true,
                attribute: false
            },
            items: {
                type: Number
            },
            token: {
                type: String
            },
            media: {
                type: String,
                hasChanged (newVal, oldVal) {
                    if (newVal !== oldVal && 
                        (newVal === 'images' || newVal === 'videos')) {
                        return true
                    } else {
                        return false
                    }
                }
            }
        }
    }

    constructor () {
        super()
        // init
        this.items = 11
        this.media = 'images'
        this.data = []
    }

    async willUpdate (changedProperties) {

        if (changedProperties.has('token')) {

            if (!this.token) return

            await this.getData()
        }
    }

    async getData () {

        // first retrieve the data from localStorage
        const cachedResult = window.localStorage.getItem(IG_KEY)
        
        if (cachedResult) {

            const result = JSON.parse(cachedResult)

            // @DEBUG
            // console.log('@CACHE >> ', result)

            const freshTimeWindow = Date.now() - CACHE_TTL
            
            if (result.timestamp > freshTimeWindow) {

                // data valid - get from cache
                this.data = result.data
                this.paging = result.paging

            } else {

                await this.fetchMediaEdge()

            }

        } else {

            await this.fetchMediaEdge()

        }
    }

    async fetchMediaEdge () {
        // needed to query graph.instagram.com
        if (!this.token) return

        const domain = 'https://graph.instagram.com'
        // query user media edge
        const mePathname = '/me/media'
        const searchParams = new URLSearchParams()
        // add the fields are you interesting in
        // https://developers.facebook.com/docs/instagram-basic-display-api/reference/media#fields
        searchParams.append(
            'fields','id,caption,media_type,media_url,username,timestamp')
        searchParams.append('access_token', this.token)

        const url = new URL(`${domain}${mePathname}?${searchParams}`)

        try {
            const response = await fetch(url)

            if (response.status === 200) {
                // good response with the data i need

                const result = await response.json()

                this.data = result.data
                this.paging = result.paging

                // @DEBUG
                // console.log('@DATA >> ', this.data)
                // console.log('@PAGING >> ', this.paging)

                this.cacheData(result)

            } else {
                // all 40* response are here, eg. Error validating access token
                this.error = result

                // @DEBUG
                // console.log(response)
                console.log(`${response.status} - ${response.statusText} `,this.error)

                await this.revitalizeCachedData()
            }

        } catch (exc) {

            // @DEBUG
            this.error = error
            console.error('@CATCH >> ', error)
        }

    }

    // if not possible get fresh data revitalize data in cache
    async revitalizeCachedData () {

        // first retrieve the data from localStorage
        const cachedResult = window.localStorage.getItem(IG_KEY)

        if (cachedResult) {

            const result = JSON.parse(cachedResult)
            this.cacheData(result)
            this.getData()
        }

    }

    cacheData (data) {

        // set the timestamp
        data.timestamp = Date.now()

        window.localStorage.setItem(
            IG_KEY,
            JSON.stringify(data))

        // @DEBUG
        // console.log('@DATA >> Cached')
    }

    renderVideos () {

        let itemCount = 0

        if (this.data) {
            return html`
                <!-- render the videos -->
                <div id="videos-container">
                    ${this.data.map((igItem) => {
                        if (igItem.media_type === 'VIDEO' && itemCount < this.items) {
                            itemCount++
                            return html`<ig-video .igData=${igItem}></ig-video>`
                        } else {
                            return html``
                        }
                    })}
                </div>
            `
        } else {
            return html``
        }
    }

    renderImages () {

        let itemCount = 0

        if (this.data) {
            return html`

                <!-- render the images -->
                <div id="images-container">
                    ${this.data.map((igItem) => {
                        if (igItem.media_type !== 'VIDEO' && itemCount < this.items) {
                            itemCount++
                            return html`<ig-image .igData=${igItem}></ig-image>`
                        } else {
                            return html``
                        }
                    })}
                </div>
            `
        } else {
            return html``
        }

    }

    render () {
        return html`
            ${this.media === 'images' ?
                this.renderImages()
                : this.renderVideos()
            }
        `
    }
}

customElements.define('ig-gallery', IgGallery)