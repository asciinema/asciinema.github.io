# Quick start

This guide shows how to add asciinema player to your own website.

It assumes you have obtained terminal session recording file by either recording
a terminal with [asciinema CLI](../cli/index.md) (`asciinema rec demo.cast`), or
downloading a `.cast ` file from [asciinema.org](https://asciinema.org) or a
[self-hosted asciinema server](../server/self-hosting/index.md).

For a broader overview of what's possible with asciinema check out the [intro
guide](../../getting-started.md).

## Installation

There are two ways of installing asciinema player on your website.

You can just copy standalone ("bundle") version of player's JS and CSS files
into your site assets directory and reference those in HTML via `<script
src="...">` and `<link rel="stylesheet" href="...">` tags.

If you use a JavaScript bundler you can use [asciinema-player npm
package](https://www.npmjs.com/package/asciinema-player).

### Standalone player bundle

Download latest version of the player bundle from
[releases page](https://github.com/asciinema/asciinema-player/releases/latest). You
only need `asciinema-player.min.js` and `asciinema-player.css` files.

First, add `asciinema-player.min.js`, `asciinema-player.css` and the `.cast` file of
your recording to your site's assets. The HTML snippet below assumes they're in
the web server's root directory.

Then add necessary includes to your HTML document and initialize the player
inside an empty container `<div>` element:

```html
<!DOCTYPE html>
<html>
<head>
  ...
  <link rel="stylesheet" type="text/css" href="/asciinema-player.css" />
  ...
</head>
<body>
  ...
  <div id="demo"></div>
  ...
  <script src="/asciinema-player.min.js"></script>
  <script>
    AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'));
  </script>
</body>
</html>
```

### npm package

Add [`asciinema-player`](https://www.npmjs.com/package/asciinema-player) to your
`devDependencies`:

```bash
npm install --save-dev asciinema-player@3.6.3
```

Add empty `<div id="demo"></div>` element to your page to contain the player.

Import `AsciinemaPlayer` from `asciinema-player` module and initialize the
player inside an empty container `<div>` element:

```javascript
import * as AsciinemaPlayer from 'asciinema-player';
AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'));
```

Finally, include player's CSS file in your site CSS bundle. It's at `dist/bundle/asciinema-player.css` in the npm package.

## Basic usage

In the code snippets above we initialized the player by calling `create` with 2
arguments. This function can in fact be called with 3 arguments:

```javascript
AsciinemaPlayer.create(src, containerElement, opts);
```

The arguments are:

- `src` - recording source, typically a recording URL,
- `containerElement` - container DOM element, to mount the player in,
- `opts` - configuration options (optional).

In the most common case, `src` is a URL pointing to an
[asciicast](../asciicast/v2.md) file. You can pass it as a full URL, e.g.
`"https://example.com/demo.cast"`, an absolute path, e.g. `"/demo.cast"`, or a
relative path, e.g. `"../casts/demo.cast"`.

!!! note

    A recording can be loaded from other sources, e.g. by inlining it in HTML or
    providing it through a function. See [Loading a recording](loading.md) for
    available ways of getting a recording into the player.

The third argument, `opts`, can be used to configure player's look and feel.
For example, to enable looping and select Solarized Dark theme we pass `loop`
and `theme` options like this:

```javascript
AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
  loop: true,
  theme: 'dracula'
});
```

See [Options](options.md) for a complete list of available options.

Finally, if you'd like to control the player programmatically, you can use the
methods of the player object, which is returned from the `create` function:

```javascript
const player = AsciinemaPlayer.create(src, containerElement);

document.getElementById('my-play-button').addEventListener('click', e => {
  e.preventDefault();
  player.play();
});
```

See [API](api.md) for full overview of programmatic control.

Before we conclude this guide here's an example of a player with a
[poster](options.md#poster) and a couple of [markers](markers.md), additionally
controlled with external buttons.

```javascript
const player = AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
  poster: 'npt:1:17',
  markers: [
    [3, 'Intro'],
    [5, 'Foo'],
    [9, 'Bar'],
    [15, 'Baz'],
    [30, 'Qux'],
  ]
});

document.getElementById('play-button').addEventListener('click', e => {
  e.preventDefault();
  player.play();
});

document.getElementById('prev-marker-button').addEventListener('click', e => {
  e.preventDefault();
  player.seek({ marker: 'prev' });
});
```

Below is the result. Go ahead and use the big buttons below the player.

<div class="player" id="player-manual-player-quickstart-1"></div>

[Play](#){ .md-button #play-button } &nbsp; [Pause](#){ .md-button #pause-button } &nbsp; [Prev marker](#){ .md-button #prev-marker-button } &nbsp; [Next marker](#){ .md-button #next-marker-button }

That wraps up our quick start guide. There's way more to the player than we
covered here though. Check out the rest of the documentation for further
configuration and customization options.
