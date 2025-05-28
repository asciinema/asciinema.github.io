# Terminal themes

asciinema player can use one of the built-in terminal themes, as well as any
custom terminal theme.

To set a theme use the [`theme` option](options.md#theme). For example:

```javascript
AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
  theme: 'dracula'
});
```

## Built-in themes

name | added in version | based on
-----|------------------|-------
`asciinema` | 2.0 |
`dracula` | 3.6 | [draculatheme.com](https://draculatheme.com)
`gruvbox-dark` | 3.10 | [github.com/morhetz/gruvbox](https://github.com/morhetz/gruvbox)
`monokai` | 2.0 | [github.com/chriskempson/base16](https://github.com/chriskempson/base16)
`nord` | 3.3 | [github.com/arcticicestudio/nord](https://github.com/arcticicestudio/nord)
`solarized-dark` | 2.0 | [ethanschoonover.com/solarized/](https://ethanschoonover.com/solarized/)
`solarized-light` | 2.0 | [ethanschoonover.com/solarized/](https://ethanschoonover.com/solarized/)
`tango` | 2.0 | [en.wikipedia.org/wiki/Tango_Desktop_Project](https://en.wikipedia.org/wiki/Tango_Desktop_Project)

## Custom themes

To use a custom theme, first define a CSS class named
`asciinema-player-theme-<name>`, e.g. `asciinema-player-theme-foobar`. Then, set
the [`theme` option](options.md#theme) to the name of the theme, e.g.  `theme:
'foobar'`.

asciinema player themes use [custom CSS
properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*), aka CSS
variables, for specifying the colors.

The palette may include either 8 or 16 colors. When 8 colors are defined the
player automatically maps colors 8-15 to colors 0-7. In other words, if the high
colors (8-15) should be the same as low colors (0-7) you can define just the
low colors.

The below definition of a built-in [Dracula theme](https://draculatheme.com/)
demonstrates how a theme is constructed:

```css title="dracula.css"
.asciinema-player-theme-dracula {
  /* Foreground (default text) color */
  --term-color-foreground: #f8f8f2;

  /* Background color */
  --term-color-background: #282a36;

  /* Palette of 16 standard ANSI colors */
  --term-color-0: #21222c;
  --term-color-1: #ff5555;
  --term-color-2: #50fa7b;
  --term-color-3: #f1fa8c;
  --term-color-4: #bd93f9;
  --term-color-5: #ff79c6;
  --term-color-6: #8be9fd;
  --term-color-7: #f8f8f2;
  --term-color-8: #6272a4;
  --term-color-9: #ff6e6e;
  --term-color-10: #69ff94;
  --term-color-11: #ffffa5;
  --term-color-12: #d6acff;
  --term-color-13: #ff92df;
  --term-color-14: #a4ffff;
  --term-color-15: #ffffff;
}
```

The built-in [Nord theme](https://www.nordtheme.com/) is an example of a theme
with 8-color palette:

```css title="nord.css"
.asciinema-player-theme-nord {
  --term-color-foreground: #eceff4;
  --term-color-background: #2e3440;

  --term-color-0: #3b4252;
  --term-color-1: #bf616a;
  --term-color-2: #a3be8c;
  --term-color-3: #ebcb8b;
  --term-color-4: #81a1c1;
  --term-color-5: #b48ead;
  --term-color-6: #88c0d0;
  --term-color-7: #eceff4;
}
```

### Automatic dark mode

Since a theme is defined with CSS, it can utilize media queries such as
[prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
to use a different set of colors when dark mode is reported by the operating
system/browser.

Below is an example of the `solarized-auto` theme, which defaults to colors from
the `solarized-light` palette and switches to colors from the `solarized-dark`
palette when dark mode is active in the operating system:

```css title="solarized-auto.css"
.asciinema-player-theme-solarized-auto {
  --term-color-foreground: #657b83;
  --term-color-background: #fdf6e3;

  --term-color-0: #073642;
  --term-color-1: #dc322f;
  --term-color-2: #859900;
  --term-color-3: #b58900;
  --term-color-4: #268bd2;
  --term-color-5: #d33682;
  --term-color-6: #2aa198;
  --term-color-7: #eee8d5;
  --term-color-8: #002b36;
  --term-color-9: #cb4b16;
  --term-color-10: #586e75;
  --term-color-11: #657c83;
  --term-color-12: #839496;
  --term-color-13: #6c71c4;
  --term-color-14: #93a1a1;
  --term-color-15: #fdf6e3;
}

@media (prefers-color-scheme: dark) {
  .asciinema-player-theme-solarized-auto {
    --term-color-foreground: #839496;
    --term-color-background: #002b36;

    --term-color-0: #073642;
    --term-color-1: #dc322f;
    --term-color-2: #859900;
    --term-color-3: #b58900;
    --term-color-4: #268bd2;
    --term-color-5: #d33682;
    --term-color-6: #2aa198;
    --term-color-7: #eee8d5;
    --term-color-8: #002b36;
    --term-color-9: #cb4b16;
    --term-color-10: #586e75;
    --term-color-11: #657b83;
    --term-color-12: #839496;
    --term-color-13: #6c71c4;
    --term-color-14: #93a1a1;
    --term-color-15: #fdf6e3;
  }
}
```

Use it by setting `theme: 'solarized-auto'` when initializing the player:

```javascript title="app.js"
AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
  theme: 'solarized-auto'
});
```
