---
hide:
  - toc
---

# asciinema server

__asciinema server__ is a server-side component of the asciinema ecosystem.

It implements a hosting platform for terminal session recordings. This includes
an API endpoint for uploading recordings, which is used by the [asciinema
CLI](../cli/index.md), and offers a familiar web interface for viewing,
browsing, sharing and managing recordings.

The server is built with [Elixir language](https://elixir-lang.org/) and
[Phoenix framework](https://www.phoenixframework.org/), and embeds asciinema's
virtual terminal, [avt](https://github.com/asciinema/avt), to perform tasks such
as preview generation and recording analysis.

[asciinema.org](https://asciinema.org) is a public asciinema server instance
managed by the asciinema project team, offering free hosting for terminal
recordings, available to everyone. Check
[asciinema.org/about](https://asciinema.org/about) to learn more about this
instance.

You can easily [self-host asciinema server](self-hosting/index.md) and use the
[asciinema CLI](../cli/index.md) with your own instance. If you're not
comfortable with uploading your terminal sessions to asciinema.org, if your
company policy prevents you from doing so, or if you simply prefer self-hosting
everything, then asciinema has you covered.

---

Notable features:

- hosting of terminal session recordings in [asciicast](../asciicast/v2.md)
  format,
- perfectly integrated [asciinema player](../player/index.md) for best viewing
  experience,
- easy [sharing](sharing.md) of recordings via secret links,
- easy [embedding](embedding.md) of the player, or linking via preview images
  (SVG),
- privacy friendly - no tracking, no ads,
- visibility control for recordings: unlisted (secret) or public,
- editable recording metadata like title or long description (Markdown),
- configurable terminal themes and font families,
- ability to download plain text version (`.txt`) of a recording.

---

asciinema server is free and open-source software (FOSS). Source code and
license available at
[github.com/asciinema/asciinema-server](https://github.com/asciinema/asciinema-server).
