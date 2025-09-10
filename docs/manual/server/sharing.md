# Sharing

Every [asciinema server](../server/index.md) instance, such as
[asciinema.org](https://asciinema.org), allows easy sharing of recordings via
unique, unguessable recording links.

## Getting a link

You can get a share link for a specific recording by clicking on the "Share"
button on the recording page. Anyone you give a link to can view the recording.

## Customizing a link

When a recording link is opened, the look and feel of the player defaults to the
settings used by the author on the recording settings page. Many of those can be
overridden on a per-link basis by appending additional query parameters (`?...`)
to the link.

For example, below link makes the player start at 25 second mark (`t=25`), play
at 2x speed (`speed=2`), and use Nord terminal theme (`theme=nord`):

```
https://asciinema.org/a/P1TkxghJg83gKt4rFV8wCKH4f?t=25&speed=2&theme=nord
```

The list of available parameters, along with their descriptions, is provided
below:

### startAt

Use `startAt`, or shorter `t`, to start start the playback at a given time.

Supported formats:

* `123` (number of seconds)
* `2:03` (mm:ss)
* `1:02:03` (hh:mm:ss)

Defaults to `0`.

!!! note

    When `startAt` is specified then `autoplay=1` is implied. To prevent the
    player from starting automatically when `startAt` parameter is set you have
    to additionally use `autoplay=0`.

### autoplay

Use `autoplay` to control whether the playback should start automatically upon
a page load.

Accepted values:

* `0` / `false` - don't start the playback automatically (default)
* `1` / `true` - start the playback automatically

### loop

Use `loop` to enable looped playback.

Accepted values:

* `0` / `false` - disable looped playback (default)
* `1` / `true` - enable looped playback

### speed

Use `speed` to alter the playback speed.

Accepts an integer or a float.

For example:

* `2` (2x faster)
* `0.5` (2x slower)

Defaults to `1` - original recording speed.

### idleTimeLimit

Use `idleTimeLimit` to optimize away idle moments in a recording.

Accepts an integer or a float, representing a maximum idle time between
animation frames.

For example, when set to `2` any inactivity longer than 2 seconds will be
"compressed" to 2 seconds.

Defaults to either:

- "Idle time limit" setting from the recording settings page,
- `idle_time_limit` from [asciicast header](../asciicast/v3.md#header) (saved
  when `--idle-time-limit <sec>` is used with `asciinema rec`),
- no limit if none of the above is present.

### theme

Use `theme` to override a theme used for the player's terminal.

The available themes are:

* asciinema
* dracula
* monokai
* nord
* solarized-dark
* solarized-light
* tango

Defaults to either:

- "Terminal theme" from the recording settings page,
- "asciinema" theme.

### poster

Use `poster` to specify an alternative poster (preview frame) to display in
player's terminal until the playback is started.

Currently only [NPT ("Normal Play Time")
notation](https://www.ietf.org/rfc/rfc2326.txt) is supported.

For example, `poster=npt:1:23` will display a preview frame at 1 min 23 sec.

Defaults to either:

- "Thumbnail frame" from the recording settings page,
- 50% of the recording duration.

### cols

Use `cols` to override player's terminal width, i.e number of columns.

Defaults to either:

- "Terminal columns" from the recording settings page,
- columns saved in the recording file.

!!! warning

    Setting `cols` to a value smaller than the one from the original recording
    may break the rendering of sessions containing "full screen" programs like
    `vim`, `htop` or `less`. It's usually safe to override `cols` for recordings
    of basic command execution in a shell.

### rows

Use `rows` to override player's terminal height, i.e number of rows.

Defaults to either:

- "Terminal rows" from the recording settings page,
- rows saved in the recording file.

!!! warning

    The same caveat applies as with the `cols` option above.

## Link previews

asciinema server implements support for [oEmbed](https://oembed.com/), [Open
Graph](https://ogp.me/), and [Twitter
Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started).
When a recording link is shared on a social network or via a chat application,
its preview is presented in a rich form. This includes a preview image, title
and author information. It usually links back to your recording page.
