---
hide:
  - toc
---

# Fonts

By default the player uses a web safe, platform specific monospace font with
`font-family` value like this: `"Consolas, Menlo, 'Bitstream Vera Sans Mono',
monospace"`.

You can use any custom monospace font with the player by adding `@font-face`
definitions in CSS and calling `AsciinemaPlayer.create` with
[terminalFontFamily](options.md#terminalfontfamily) option. Regular font face is
necessary, bold (weight 700) is recommended, italic is optional (italics are
rarely used in terminal).

If you use [icons](https://fontawesome.com/) or
[other](https://github.com/powerline/powerline)
[symbols](https://github.com/romkatv/powerlevel10k) in your shell you may want
to use one of the [Nerd Fonts](https://www.nerdfonts.com/) variants.

Here's an example of using [Fira Code](https://github.com/tonsky/FiraCode) Nerd
Font:

```css title="app.css"
@font-face {
    font-family: "FiraCode Nerd Font";
    src:    local(Fira Code Bold Nerd Font Complete Mono),
            url("/fonts/Fira Code Bold Nerd Font Complete Mono.ttf") format("truetype");
    font-stretch: normal;
    font-style: normal;
    font-weight: 700;
}

@font-face {
    font-family: "FiraCode Nerd Font";
    src:    local(Fira Code Regular Nerd Font Complete Mono),
            url("/fonts/Fira Code Regular Nerd Font Complete Mono.ttf") format("truetype");
    font-stretch: normal;
}
```

```javascript title="app.js"
document.fonts.load("1em FiraCode Nerd Font").then(() => {
  AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
    terminalFontFamily: "'FiraCode Nerd Font', monospace"
  });
}
```

!!! note

    The player performs measurement of font metrics (width/height) when it
    mounts in the page, therefore it's __highly recommended__ to ensure chosen
    font is already loaded before calling `create`. This can be achieved by
    using [CSS Font Loading
    API](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/load) as
    seen in the above example.

    If you know that your audience has the desired font already installed on
    their systems, e.g. when you choose a font that comes preinstalled with an
    OS, then you may try without using `document.fonts.load()`.
