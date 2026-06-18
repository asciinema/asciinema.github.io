# Upgrading

asciinema player follows [semantic versioning](https://semver.org/) model
therefore it should always be safe to upgrade to a higher minor or patch
version, e.g. from v3.0.0 to v3.6.3, without the risk of breaking functionality.

Upgrading to a higher major version, e.g. from v2.x to v3.x, may involve changes
to player configuration and/or usage. This page includes upgrade guides for such
cases.

## Upgrading from v2 to v3

v2.x used, now deprecated, `document.registerElement(...)` API for registering
`<asciinema-player>` custom HTML element. This way of initializing the player
has been removed in v3.x, replaced with standard JavaScript API.

Instead of:

```html title="2.x"
<!DOCTYPE html>
<html>
<head>
  ...
  <link rel="stylesheet" type="text/css" href="/asciinema-player.css" />
  ...
</head>
<body>
  ...
  <asciinema-player src="/demo.cast" speed="2" loop></asciinema-player>
  ...
  <script src="/asciinema-player.js"></script>
</body>
</html>
```

Use:

```html title="3.x"
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
    AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
      speed: 2,
      loop: true
    });
  </script>
</body>
</html>
```

!!! info

    There's also [asciinema-player npm
    package](https://www.npmjs.com/package/asciinema-player), which can be
    used instead of the standalone bundle. Check the [quick start
    guide](quick-start.md#npm-package) for details.

`src` attribute becomes the first argument to `AsciinemaPlayer.create()`. The
second argument specifies the container element to mount the player under. All
other option attributes are now passed in options objects as the third argument.

The following table shows how 2.x attributes map to new 3.x options:

2.x attribute | 3.x option | example | notes
--------------|------------|---------|------
`cols` | `cols` | `{ cols: 80 }` |
`rows` | `rows` | `{ rows: 24 }` |
`autoplay` | `autoplay` | `{ autoplay: true }` |
`preload` | `preload` | `{ preload: true }` |
`loop` | `loop` | `{ loop: true }` or `{ loop: 3 }` |
`start-at` | `startAt` | `{ startAt: 33 }` |
`speed` | `speed` | `{ speed: 2 }` |
`idle-time-limit` | `idleTimeLimit` | `{ idleTimeLimit: 2 }` |
`poster` | `poster` | `{ poster: "npt:2:34" }` |
`font-size` | `terminalFontSize` | `{ terminalFontSize: "20px", fit: false }` | requires `fit: false` |
`theme` | `theme` | `{ theme: "dracula" }` |
`title` | - | - | removed
`author` | - | - | removed
`author-url` | - | - | removed
`author-img-url` | - | - | removed
