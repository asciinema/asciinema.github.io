# Options

Look and feel of the asciinema player can be configured extensively by passing
additional options when mounting the player on the page.

For example, setting double speed while limiting idle time to 2 seconds can be
configure like this:

```javascript
AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
  speed: 2,
  idleTimeLimit: 2,
});
```

Below you can find all available options.

### `cols`

Type: number

Width of player's terminal in columns.

When not set it defaults to 80 (until asciicast gets loaded) and to terminal
width saved in the asciicast file (after it gets loaded).

It's recommended to set it to the same value as in asciicast file to avoid
player resizing itself from 80x24 to actual dimensions of the recording when it
gets loaded.

### `rows`

Type: number

Height of player's terminal in rows (lines).

When not set it defaults to 24 (until asciicast gets loaded) and to terminal
height saved in the asciicast file (after it gets loaded).

Same recommendation as for `cols` applies here.

### `autoPlay`

Type: boolean

Set this option to `true` if the playback should start automatically.

Defaults to `false` - no auto play.

### `preload`

Type: boolean

Set this option to `true` if the recording should be preloaded on player's
initialization.

Defaults to `false` - no preload.

!!! tip

    Check [Loading a recording](loading.md) for available options of getting a
    recording into the player in the most suitable way.

### `loop`

Type: boolean or number

Set this option to either `true` or a number if playback should be looped. When
set to a number (e.g. `3`) then the recording will be re-played given number of
times and stopped after that.

Defaults to `false` - no looping.

### `startAt`

Type: number or string

Start the playback at a given time.

Supported formats:

* `123` (number of seconds)
* `"2:03"` ("mm:ss")
* `"1:02:03"` ("hh:mm:ss")

Defaults to `0`.

### `speed`

Type: number

Playback speed. The value of `2` means 2x faster.

Defaults to `1` - normal speed.

### `idleTimeLimit`

Type: number

Limit terminal inactivity to a given number of seconds.

For example, when set to `2` any inactivity (pauses) longer than 2 seconds will
be "compressed" to 2 seconds.

Defaults to:

- `idle_time_limit` from asciicast header (saved when passing `-i <sec>` to
  `asciinema rec`),
- no limit, when it was not specified at the time of recording.

!!! tip

    This option makes the playback more pleasant for viewers, therefore it's
    recommended to use it in most cases. It's often better to use
    `idleTimeLimit` than `speed`. You can use both together too!

### `theme`

Type: string

Terminal color theme.

[asciinema CLI](../cli/index.md) 3.0 (and later) captures original terminal
theme and [embeds it in a recording
file](https://docs.asciinema.org/manual/asciicast/v2/#theme). This lets the
player replicate the exact colors by default.

This option can be used to override the terminal theme. See [Terminal
themes](themes.md) for a list of available built-in themes (also how to use a
custom theme).

If you'd like to configure the player to use the original theme when available,
falling back to a specific theme, e.g. `dracula`, then prefix the theme name
with `auto/`. For example: `{ theme: "auto/dracula" }`.

Defaults to `"auto/asciinema"` since player v3.8, and to `"asciinema"` in
earlier versions.

### `poster`

Type: string

Poster (a preview frame) to display until the playback is started.

The following poster specifications are supported:

* `npt:1:23` - display recording "frame" at given time using [NPT ("Normal Play Time") notation](https://www.ietf.org/rfc/rfc2326.txt)
* `data:text/plain,Poster text` - print given text

The easiest way of specifying a poster is to use NPT format. For example,
`npt:1:23` will preload the recording and display terminal contents at 1 min 23
sec.

Example:

```javascript
AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
  poster: 'npt:1:23'
});
```

!!! note

    Using NPT-based poster preloads the recording on player's initialization
    regardless of [preload](#preload) option value.

Alternatively, a `poster` value of `data:text/plain,This will be printed as
poster\n\rThis in second line` will display arbitrary text. All [ANSI escape
codes](https://en.wikipedia.org/wiki/ANSI_escape_code) can be used to add color
and move the cursor around to produce good looking poster.

Example of using custom text poster with control sequences (aka escape codes):

```javascript
AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
  poster: "data:text/plain,I'm regular \x1b[1;32mI'm bold green\x1b[3BI'm 3 lines down"
});
```

Defaults to blank terminal or, when `startAt` is specified, to screen contents
at time specified by `startAt`.

### `fit`

Type: string

Selects fitting (sizing) behaviour with regards to player's container element.

Possible values:

* `"width"` - scale to full width of the container
* `"height"` - scale to full height of the container (requires the container element to have fixed height)
* `"both"` - scale to either full width or height, maximizing usage of available space (requires the container element to have fixed height)
* `false` / `"none"` - don't scale, use fixed size font (also see `terminalFontSize` option below)

Defaults to `"width"`.

!!! note

    Version 2.x of the player supported only the behaviour of the `false` value.
    If you're [upgrading from v2 to v3](upgrading.md and want to preserve the
    old sizing behaviour then include `fit: false` option.

### `controls`

Type: boolean or "auto"

Hide or show user controls, i.e. bottom control bar.

Valid values:

* `true` - always show controls
* `false` - never show controls
* `"auto"` - show controls on mouse movement, hide on lack of mouse movement

Defaults to `"auto"`.

### `markers`

Type: array

Defines a list of timeline markers.

Example of unlabeled markers:

```javascript
AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
  markers: [5.0, 25.0, 66.6, 176.5]  // time in seconds
});
```

Example of labeled markers:

```javascript
AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
  markers: [
    [5.0,   "Installation"],  // time in seconds + label
    [25.0,  "Configuration"],
    [66.6,  "Usage"],
    [176.5, "Tips & Tricks"]
  ]
});
```

Markers set with this option override all [markers embedded in asciicast
files](../asciicast/v2.md#m-marker). If this option is not set the player
defaults to markers found in the recording file (if any).

[Markers overview](markers.md) provides more information on using markers.

### `pauseOnMarkers`

Type: boolean

If `pauseOnMarkers` is set to `true`, the playback automatically pauses on every
marker encountered and it can be resumed by either pressing the space bar key or
clicking on the play button. The resumed playback continues until the next
marker is encountered.

This option can be useful in e.g. live demos: you can add markers to a
recording, then play it back during presentation, and have the player stop
wherever you want to explain terminal contents in more detail.

Defaults to `false`.

### `terminalFontSize`

Type: string

Size of the terminal font.

Possible values:

* any valid CSS `font-size` value, e.g. `"15px"`
* `"small"`
* `"medium"`
* `"big"`

Defaults to `"small"`.

!!! warning

    This option is effective only when `fit: false` option is specified as well
    (see above).

### `terminalFontFamily`

Type: string

Terminal font-family override.

Use any valid CSS `font-family` value, e.g `"'JetBrains Mono', Consolas, Menlo, 'Bitstream Vera Sans Mono', monospace"`.

!!! note

    If you want to use [web
    fonts](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts),
    see the [Fonts](fonts.md) section for information on the best way to load
    them to ensure the player initializes properly.

### `terminalLineHeight`

Type: number

Terminal line height override.

The value is relative to the font size (like `em` unit in CSS). For example a
value of `1` makes the line height equal to the font size, leaving no space
between lines. A value of `2` makes it double the font size, etc.

Defaults to `1.33333333`.

### `logger`

Type: console-like object

Set this option to `console`, i.e. `{ logger: console }`, or any object
implementing console API (`.log()`, `.debug()`, `.info()`, `.warn()`, `.error()`
methods) to enable logging. Useful during development or when debugging player
issues.
