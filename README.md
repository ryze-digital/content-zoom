# RYZE Digital Content Zoom

![Run linter(s) workflow status](https://github.com/ryze-digital/content-zoom/actions/workflows/run-lint.yml/badge.svg)

## Install

```sh
npm i @ryze-digital/content-zoom --save
```

## Usage

### HTML

You have to wrap the content that should be zoomable into a shared container. By default we are looking for a class
called `content-zoom`. To give us the ability to generate `aria-controls` accordingly, it also makes sense to specify an
`id` attribute.

```html
<div class="content-zoom" id="your-unique-identifier">
    // Your zoomable content goes here
</div>
```

### Scss

```scss
@use "@ryze-digital/content-zoom";
```

To customize our defaults for your needs, you can use the provided `configure` mixin.

```scss
@include content-zoom.configure(...);
```

<details>
<summary>List of available configure options</summary>

| Option                                | Type              | Default       | Description                                       |
|---------------------------------------|-------------------|---------------|---------------------------------------------------|
| full-bleed                            | Map               |               | Config options for the full-bleed mode            |
| full-bleed.max-width                  | Number            | `42rem`       | The maximum width of your centered content column |
| full-bleed.transition                 | Map               |               |                                                   |
| full-bleed.transition.duration        | Number            | `300ms`       |                                                   |
| full-bleed.transition.timing-function | String (Unquoted) | `ease-in-out` |                                                   |
| full-bleed.grid-column                | Map               |               |                                                   |
| full-bleed.grid-column.start          | Number            | `1`           |                                                   |
| full-bleed.grid-column.end            | Number            | `-1`          |                                                   |
| full-bleed.classes                    | Map               |               | Selectors that are used inside our mixins         |
| full-bleed.classes.zoomed             | String (Quoted)   | `"zoom"`      |                                                   |
| dialog                                | Map               |               | Config options for the legacy mode                |
| dialog.transition                     | Map               |               |                                                   |
| dialog.transition.duration            | Number            | `400ms`       |                                                   |
| dialog.transition.timing-function     | String (Unquoted) | `ease`        |                                                   |

Check out [the actual configure mixin](src/styles/_config.scss) for better understanding.
</details>

There are two separate mixins each for your desired zoom behavior. Use the so called "Full-Bleed" mode, if your content
is centered via [this CSS Grid technique](https://www.joshwcomeau.com/css/full-bleed/) (that you definitely should be
using).

```scss
.content-zoom {
    @include content-zoom.full-bleed();
}
```

If you center your content the old school way using `margin: o auto;` combined with a `max-width`, you have to use our
fallback "Dialog" mode.

```scss
.content-zoom-dialog {
    @include content-zoom.dialog();
}
```

### JavaScript

```js
import { ContentZoom } from '@ryze-digital/content-zoom';

new ContentZoom({...}).init();
```

<details>
<summary>List of available parameters for ContentZoom class</summary>

| Option                    | Type        | Default                                                                                                                                      | Description                                                                                                                                                                                            |
|---------------------------|-------------|----------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| el                        | HTMLElement | <code>document.querySelector('.content-zoom')</code>                                                                                         | Container to which the library should be bound                                                                                                                                                         |
| mode                      | string      | <code>'FullBleed'</code>                                                                                                                     | Switch between default (`'FullBleed'`) and legacy (`'Dialog'`) mode                                                                                                                                    |
| autoDetectOverflow        | boolean     | <code>true</code>                                                                                                                            | If set to `true` the button gets hidden, if there is no overflowing content. If set to `false` the button stays always visible.                                                                        |
| autoDetectZoomability     | boolean     | <code>true</code>                                                                                                                            | If set to `true` the button gets hidden, if zooming wouldn't make the element bigger (for example if the content is the same size as the viewport). If set to `false` the button stays always visible. |
| labels                    | object      | <pre>{<br>&nbsp;&nbsp;zoomIn: 'Expand content',<br>&nbsp;&nbsp;zoomOut: 'Collapse content'<br>}</pre>                                        | Default (button) labels                                                                                                                                                                                |
| elements                  | object      |                                                                                                                                              | Elements used by the library                                                                                                                                                                           |
| elements.overflowingChild | HTMLElement | <code>null</code>                                                                                                                            | An optional child element that can be used to `autoDetectOverflow`. This is needed, if the child element itself already has a solution against overflow (e.g. a `<table>` with a scrollbar)            |
| elements.limitingAncestor | HTMLElement | <code>document.body</code>                                                                                                                   | The element being used to `autoDetectZoomability`                                                                                                                                                      |
| elements.buttonTarget     | HTMLElement | <code>null</code>                                                                                                                            | The element the button gets appended to. If `null` the button becomes the first child of `el`.                                                                                                         |
| classes                   | object      | <pre>{<br>&nbsp;&nbsp;zoomed: 'zoom',<br>&nbsp;&nbsp;button: 'content-zoom-trigger',<br>&nbsp;&nbsp;dialog: 'content-zoom-dialog'<br>}</pre> | Selectors that are used internally or states that will be added to elements                                                                                                                            |
</details>

### Special note for tables

This library works with any kind of content but was designed with tables in mind. If you want to use it for tables, you 
have to consider the following: Tables usually already have a solution for overflowing content — the scrollbar at the 
bottom. This makes it impossible for us to auto-detect overflow at the wrapper, because the table technically doesn't
overflow anymore. 

To fix that, we provide an optional `elements.overflowingChild` parameter. Pass the table (or any other element whose 
overflow has already been handled) to the library, and it will use that element (instead of the wrapper) to decide if
the button needs to be shown or not.

```js
import { ContentZoom } from '@ryze-digital/content-zoom';

document.querySelectorAll('.content-zoom').forEach((el) => {
    new ContentZoom({
        el,
        elements: {
            overflowingChild: el.querySelector('table')
        }   
    }).init();
});
```

## Demos

Check out this repository to run the demos in a browser.

- [Full-Bleed Mode (default)](/demos/full-bleed.html)
- [Dialog Mode (for legacy projects)](/demos/dialog.html)
- [Multiple Instances](/demos/multiple-instances.html)