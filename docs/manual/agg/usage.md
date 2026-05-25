# Usage

## Basic usage

```bash
agg demo.cast demo.gif
```

The above command renders a GIF with the default theme (dracula), 16px font
size, and the swash renderer.

You can also provide an asciinema.org URL as the first argument:

```bash
agg https://asciinema.org/a/569727 starwars.gif
```

Or pipe an asciicast on standard input by using `-` as the input filename:

```bash
cat demo.cast | agg - demo.gif
```

Additional options are available for customization. For example, the following
command selects the Monokai theme, a larger font size, and 2× playback speed:

```bash
agg --theme monokai --font-size 20 --speed 2 demo.cast demo.gif
```

Run `agg -h` to see all available options.

## Color themes

There are several built-in color themes you can use with the `--theme` option:

- asciinema
- dracula (default)
- github-dark, github-light
- gruvbox-dark
- kanagawa, kanagawa-dragon, kanagawa-light
- monokai
- nord
- solarized-dark, solarized-light

If your asciicast file includes [theme definition](../asciicast/v3.md#theme)
then it's used automatically unless the `--theme` option is explicitly
specified.

A custom, ad-hoc theme can be used with the `--theme` option by passing a
series of comma-separated hex triplets defining terminal background color,
default text color and a color palette:

```text
--theme bbbbbb,ffffff,000000,111111,222222,333333,444444,555555,666666,777777
```

The above sets background to `bbbbbb`, default text to `ffffff`, and uses
the remaining 8 colors as [SGR color
palette](https://en.wikipedia.org/wiki/ANSI_escape_code#Colors).

Additional bright color variants can be specified by adding 8 more hex triplets
at the end. For example, the equivalent of the built-in Monokai theme is:

```text
--theme 272822,f8f8f2,272822,f92672,a6e22e,f4bf75,66d9ef,ae81ff,a1efe4,f8f8f2,75715e,f92672,a6e22e,f4bf75,66d9ef,ae81ff,a1efe4,f9f8f5
```

### Bold colors

Some terminals render bold text using the bright variant of the active ANSI
color (e.g. bold red shown as bright red). agg follows the more literal
behavior by default. Pass `--bold-is-bright` to map ANSI colors 0–7 to 8–15
when bold is set:

```bash
agg --bold-is-bright demo.cast demo.gif
```

## Fonts

By default agg composes a font family list from three groups:

1. **Text font** — `--text-font-family` (default:
   `JetBrains Mono,Fira Code,SF Mono,Menlo,Consolas,DejaVu Sans Mono,Liberation Mono`).
   The first family that resolves on your system is used as the primary
   monospace font and drives terminal cell metrics.
2. **Symbol fallback** — *Symbols Nerd Font* (bundled with agg) is appended
   automatically. This makes powerline glyphs, devicons, and other Nerd Font
   symbols render without installing a Nerd Font yourself. *DejaVu Sans* is
   also appended if installed, to cover assorted Unicode symbols like ⣽ or ✔.
3. **Emoji font** — `--emoji-font-family` (default:
   `Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,JoyPixels,Twemoji,Noto Emoji`).
   Every family in this list that resolves is appended to the chain. A
   monochrome **Noto Emoji** is bundled with agg, so basic emoji rendering
   works even without any system emoji font.

To pick a different text font, pass a comma-separated list:

```bash
agg --text-font-family "Source Code Pro,Fira Code" demo.cast demo.gif
```

To narrow or change the emoji list:

```bash
agg --emoji-font-family "Noto Color Emoji" demo.cast demo.gif
```

As long as the fonts are installed in standard system locations (e.g.
`/usr/share/fonts` or `~/.local/share/fonts` on Linux) agg will find them.
You can point agg at additional directories with `--font-dir`; the option
may be repeated. Fonts loaded this way take precedence over system fonts:

```bash
agg --font-dir ~/my-fonts demo.cast demo.gif
```

To verify which families agg picked, run with `-v`:

```bash
agg -v --text-font-family "Source Code Pro" demo.cast demo.gif
```

You should see lines such as:

```text
[INFO agg] usable font families: ["Source Code Pro", "Symbols Nerd Font", "DejaVu Sans", "Noto Color Emoji", "Noto Emoji"]
[INFO agg] primary text font family: Source Code Pro
```

### Bypassing automatic fallbacks

If you need full control over the family list — for example to opt out of
the bundled symbol/emoji fallbacks — use `--font-family`. It takes a
comma-separated list which is used verbatim, and must start with a
monospace text font:

```bash
agg --font-family "JetBrainsMono Nerd Font Mono" demo.cast demo.gif
```

`--font-family` cannot be combined with `--text-font-family` or
`--emoji-font-family`.

### Nerd Fonts

In most cases Nerd Font symbols render properly thanks to the bundled
Symbols Nerd Font fallback, so you typically don't need to install a patched
text font. If some glyphs are missing and you need a newer Nerd Fonts
release, you can either point agg at an updated Symbols Nerd Font with
`--font-dir`, or use a fully patched [Nerd Font](https://www.nerdfonts.com/)
as the text font:

1. Download a patched set from
   <https://github.com/ryanoasis/nerd-fonts/releases/latest>, e.g.
   `JetBrainsMono.zip`.
2. Unzip into `~/.local/share/fonts` (Linux) or install via the system
   font manager (macOS, Windows).
3. Use it as the text font:

```bash
agg --text-font-family "JetBrainsMono Nerd Font Mono" demo.cast demo.gif
```

### Font size and line height

Use `--font-size` to change the terminal font size, and `--line-height` to
adjust vertical spacing between rows:

```bash
agg --font-size 20 --line-height 1.6 demo.cast demo.gif
```

`--line-height` defaults to 1.4.

## Emoji

The default `--emoji-font-family` list covers the common color emoji fonts
on each platform — install any of them and color emoji will render:

- **Linux / Windows** — [Noto Color
  Emoji](https://fonts.google.com/noto/specimen/Noto+Color+Emoji), Segoe UI
  Emoji, JoyPixels, or Twemoji.
- **macOS** — Apple Color Emoji ships with the system. agg loads it from
  `/System/Library/Fonts/Apple Color Emoji.ttc` automatically, since it
  isn't exposed by the OS as a regular font file.

## Rendering backends

agg has two rendering backends, selectable with `--renderer` (swash is the
default since agg 1.8):

- `swash` (default) — fast, supports color (CBDT/sbix) emoji.
- `resvg` — slower, supports both CBDT/sbix and COLRv1 color emoji.

### COLRv1 emoji under swash

Recent Noto Color Emoji releases ship in the **COLRv1** format, which the
swash renderer doesn't support. When agg detects a COLRv1 family in the
selected chain it logs a warning at startup, and emoji glyphs fall back to
the bundled monochrome Noto Emoji. (CBDT/sbix builds of Noto Color Emoji,
Apple Color Emoji, Segoe UI Emoji, etc. render fine under swash.)

There are two ways around this:

1. **Switch renderer per recording** — pass `--renderer resvg`:

   ```bash
   agg --renderer resvg demo.cast demo.gif
   ```

   swash is otherwise preferable (faster and sharper), which is why it
   stays the default — treat this as a per-recording trade-off rather
   than a global switch.

2. **Supply a non-COLRv1 emoji font** — download a CBDT build of Noto
   Color Emoji (or another color emoji font), drop the `.ttf` into a
   directory, and point agg at it with `--font-dir`. Fonts loaded that
   way take precedence over system fonts, so swash will pick up the
   non-COLRv1 version:

   ```bash
   agg --font-dir ~/emoji-fonts demo.cast demo.gif
   ```

## Playback

### Speed

`--speed` (default 1) scales playback speed. Use values >1 to speed up, <1
to slow down:

```bash
agg --speed 2 demo.cast demo.gif
```

### Idle time limit

`--idle-time-limit` (default 5, in seconds) caps any single inactive period,
so long pauses don't bloat the GIF:

```bash
agg --idle-time-limit 1 demo.cast demo.gif
```

If the asciicast itself specifies an `idle_time_limit` it is used unless
overridden on the command line.

### Loop

`--no-loop` plays the GIF once (by default it loops forever):

```bash
agg --no-loop demo.cast demo.gif
```

### FPS cap

`--fps-cap` (default 30) limits the maximum frame rate of the generated GIF.
Lower values produce smaller files at the cost of motion smoothness.

### Last frame duration

`--last-frame-duration` (default 3, in seconds) holds the final frame for
extra time before the GIF loops or ends — handy when the recording finishes
on important output.

## Terminal size

By default agg renders at the terminal size recorded in the asciicast header.
Override with `--cols` and `--rows` to re-render at a different geometry:

```bash
agg --cols 100 --rows 30 demo.cast demo.gif
```

Note that reflow may differ from the original recording, so very long lines
or full-screen TUIs may not look identical.

## GIF optimization

The GIF encoder used by agg, [gifski](https://github.com/ImageOptim/gifski),
produces great-looking GIF files, although this often comes at a cost — file
size.

[gifsicle](https://www.lcdf.org/gifsicle/) can be used to shrink the produced GIF file:

```bash
gifsicle --lossy=80 -k 128 -O2 -Okeep-empty demo.gif -o demo-opt.gif
```

Every recording is different so you may need to tweak the lossiness level
(`--lossy`), number of colors (`-k`) and other options to suit your needs.
