# 🌠🏞 \<ig-gallery\>

v0.0.1 - 30-01-2023

Instagram image / video gallery as WebComponent ready to use. The *ig-gallery* element show the last *items* eg. 11 of target profile instagram media (images or videos), mix mode ( images & videos) is on working track (next version). Dispose the images triggering the *items* attribute for the number of elements and the CSS custom variables to choose the right layout ( columns x rows) to arrange the items. Note that the landscape images take a double space in the *ig-gallery* layout!

```css
/* CSS */
ig-gallery {
    --n-columns: 5;
    --n-rows: 2;

    --caption-bk-color: rgba(255, 255, 255, 0.15);
    --caption-color: whitesmoke;
    --caption-font-family: 'sans-serif';
    --caption-font-size: 1.7rem;
}
```

```html
<!-- HTML -->
<ig-gallery
    items="9"
    token="">
</ig-gallery>
```

```javascript
<script type="module" src="../ig-gallery.js"></script>

<script type="module">

    import { igToken } from '../config/meta.js'

    window.addEventListener('DOMContentLoaded', (e) => {

        // DOM ready
        console.log('@DOM >> Ready')

        // instagram token igToken - imported from not versioned file
        const igGallery = document.querySelector('ig-gallery')
        igGallery.setAttribute('token', igToken)

    })

</script>
```

You can set the LONG_LIFE_TOKEN directly in the *toke* attribute or (my fav) load the token from an un-versioned configuration file as show in the previous example.

## LONG_LIFE_TOKEN
Meta LONG_LIFE_TOKEN is needed to runs this component. The Meta LONG_LIFE_TOKEN is passed to the component through the attribute *token*.

## 🐝 API

### 📒 Properties/Attributes

| Name | Type | Default | Description
| ------------- | ------------- | ---------- | ----------------------------------------
| token         | String | `''` | Meta LONG_LIVE_TOKEN
| items         | Number | `11` | Number of instagram items (images of videos) to insert
| media         | String | `'images'` | Type of instagram media to show images | videos

### Methods

No Methods

### Events

No Events

### 🧁 CSS Custom Properties

| Name | Default | Description
| --------------- | ------- | ----------------------------------------------
| `--n-columns`   | `5`     | Number of columns to insert in the ig-gallery
| `--n-rows`      | `1`     | Number of rows to insert in the ig-gallery
| `--caption-bk-color`      | `rgba(255, 255, 255, 0.5)` | Caption background color
| `--caption-color`         | `whitesmoke` | Caption text color
| `--caption-font-family`   | `Caveat` | Caption font-family
| `--caption-font-size`     | `2.3rem` | Caption font-size


## Contributing

Got **something interesting** you'd like to **share**? Learn about [contributing](https://github.com/CICCIOSGAMINO/init/blob/master/CONTRIBUTING.md).

# Accessibility

# 🔧 TODO
- [ ] Implement the mix mode, insert into the ig-gallery images + videos
- [ ] Basic Unit testing
- [ ] A11y compatible ?

# License
[GNU General Public License v3.0](https://github.com/CICCIOSGAMINO/init/blob/master/LICENSE)

Made 🧑‍💻 by [@cicciosgamino](https://cicciosgamino.web.app)