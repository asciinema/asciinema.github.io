# Embedding

Recordings hosted on an [asciinema server](../server/index.md) instance, such as
[asciinema.org](https://asciinema.org), can be easily embedded on any website
either as an inline player or as a link containing a preview image of the
recording.

This allows you to enrich a blog post or project documentation with minimal
effort.

When embedding with the methods presented below, all the assets are served from
asciinema.org. This server has been operational since 2012 and hopefully isn't
going anywhere (you can help by [donating](../../donations.md)). However, if you
prefer not to depend on a third party, consider including the [standalone
player](../player/index.md) on your website, or [self-hosting the
server](../server/self-hosting/index.md).

## Inline player

You can embed a player for your recording in a page by inserting a
recording-specific `<script>` tag, which serves the player and the recording
from asciinema.org. Check the alternative [Preview image
link](#preview-image-link) option if a website doesn't permit inserting
`<script>` tags.

To get the inline player snippet for a recording click on the "Share" button on
the recording page. The snippet looks like this:

```html
<script src="https://asciinema.org/a/bJMOlPe5F4mFLY0Rl6fiJSOp3.js" id="asciicast-bJMOlPe5F4mFLY0Rl6fiJSOp3" async></script>
```

The script adds the player to a page at the location of the script itself,
allowing precise placement by simply copy-pasting the snippet.

The script injects an `<iframe>` element into the page, into which the
[asciinema player](../player/index.md) is loaded. The frame is automatically
resized, using the full width of the containing element and adjusting its height
to maintain the proportions of the recorded terminal.

Here's how it looks:

<script src="https://asciinema.org/a/bJMOlPe5F4mFLY0Rl6fiJSOp3.js" id="asciicast-bJMOlPe5F4mFLY0Rl6fiJSOp3" async></script>

The look and feel of the inline player defaults to the settings used by the
author on the recording settings page. Many of those can be overridden by using
[custom data
attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes)
with the `<script>` tag.

The following embed snippet makes the player start playback from the 25-second
mark (`data-start-at="25"`), play at 2x speed (`data-speed="2"`), and use the
Solarized Dark terminal theme (`data-theme="solarized-dark"`):

```html
<script src="https://asciinema.org/a/bJMOlPe5F4mFLY0Rl6fiJSOp3.js" id="asciicast-bJMOlPe5F4mFLY0Rl6fiJSOp3" async data-start-at="25" data-speed="2" data-theme="solarized-dark"></script>
```

Here's how it looks with those additional options applied:

<script src="https://asciinema.org/a/bJMOlPe5F4mFLY0Rl6fiJSOp3.js" id="asciicast-bJMOlPe5F4mFLY0Rl6fiJSOp3" async data-loop="true" data-speed="2" data-theme="solarized-dark"></script>

The list of available options, along with their descriptions, is provided below.
Add them as `data-<option-name>="value"` attributes on the embed `<script>` tag,
as shown in the example above.

### start-at

Use `start-at` to start start the playback at a given time.

Supported formats:

* `123` (number of seconds)
* `2:03` (mm:ss)
* `1:02:03` (hh:mm:ss)

Defaults to `0`.

!!! note

    When `start-at` is specified then `autoplay=1` is implied. To prevent the
    player from starting automatically when `start-at` parameter is set you have
    to additionally use `autoplay=0`.

### autoplay

Use `autoplay` to control whether the playback should start automatically upon
a page load.

Accepted values:

* no value, i.e. `<script ... data-autoplay ...>` - start the playback automatically
* `1` / `true` - start the playback automatically
* `0` / `false` - don't start the playback automatically (default)

### loop

Use `loop` to enable looped playback.

Accepted values:

* no value, i.e. `<script ... data-loop ...>` - enable looped playback
* `1` / `true` - enable looped playback
* `0` / `false` - disable looped playback (default)

### speed

Use `speed` to alter the playback speed.

Accepts an integer or a float.

For example:

* `2` (2x faster)
* `0.5` (2x slower)

Defaults to `1` - original recording speed.

### idle-time-limit

Use `idle-time-limit` to optimize away idle moments in a recording.

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

### preload

Use `preload` to control whether the player should start fetching the recording
immediately upon a page load, before a viewer starts the playback.

* `0` / `false` - don't preload the recording (default)
* `1` / `true` - preload the recording

!!! note

    When `poster` is specified then `preload=1` is implied. That's because the
    player needs to load the recording in order to generate a preview frame.

## Preview image link

Embedding as an image link is useful in places where `<script>` tags are not
allowed, such as in a project's README file rendered by Github.

To get the preview link snippet for a recording click on the "Share" button on
the recording page. The snippet looks like this:

=== "HTML"

    ```html
    <a href="https://asciinema.org/a/bJMOlPe5F4mFLY0Rl6fiJSOp3" target="_blank"><img src="https://asciinema.org/a/bJMOlPe5F4mFLY0Rl6fiJSOp3.svg" /></a>
    ```

=== "Markdown"

    ```markdown
    [![asciicast](https://asciinema.org/a/bJMOlPe5F4mFLY0Rl6fiJSOp3.svg)](https://asciinema.org/a/bJMOlPe5F4mFLY0Rl6fiJSOp3)
    ```


Below is the result. It resembles a player with a large play button, but it
simply links to a recording. The preview image is an SVG file, which ensures it
looks great in all contexts and on all screen sizes.

<a href="https://asciinema.org/a/bJMOlPe5F4mFLY0Rl6fiJSOp3" target="_blank"><img src="https://asciinema.org/a/bJMOlPe5F4mFLY0Rl6fiJSOp3.svg" /></a>

## oEmbed

asciinema server provides [oEmbed](https://oembed.com/) endpoint at `/oembed`,
which uses standard query params: `url` (required), `maxwidth`, `maxheight` and
`format` (either `json` or `xml`, defaults to `json`).
