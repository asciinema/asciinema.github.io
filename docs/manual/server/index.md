---
hide:
  - toc
---

# asciinema server

__asciinema server__ is a server-side component of the asciinema ecosystem.

It implements a hosting platform for terminal session recordings and live
streaming. It offers a familiar web interface for viewing, browsing, sharing
and managing recordings and streams. This includes [HTTP API](api.md), which is
used by the [asciinema CLI](../cli/index.md).

The server is built with [Elixir language](https://elixir-lang.org/) and
[Phoenix framework](https://www.phoenixframework.org/). It embeds asciinema's
virtual terminal, [avt](https://github.com/asciinema/avt), which is utilized by
tasks such as preview generation, recording analysis and live stream state
bookkeeping.

[asciinema.org](https://asciinema.org) is a public asciinema server instance
managed by the asciinema project team, providing free hosting for terminal
recordings and streams, available to everyone. Check
[asciinema.org/about](https://asciinema.org/about) to learn more about this
instance.

You can easily [self-host asciinema server](self-hosting/index.md) and use the
[asciinema CLI](../cli/index.md) with your own instance. If you're not
comfortable with hosting your data at asciinema.org, if your company policy
prevents you from doing so, or if you simply prefer self-hosting everything,
then asciinema has you covered.

---

Notable features:

- hosting of terminal session recordings in [asciicast](../asciicast/v3.md)
  format,
- [live streaming](streaming.md) of terminal sessions,
- perfectly integrated [asciinema player](../player/index.md) for best viewing
  experience,
- full-text search using recording titles, descriptions, and _full terminal
  session content_,
- easy [sharing](sharing.md) of recordings via secret links,
- easy [embedding](embedding.md) of the player, or linking via preview images
  (SVG),
- privacy friendly - no tracking, no ads,
- visibility control for recordings: private, unlisted, public,
- editable recording metadata like title or long description (Markdown),
- configurable terminal themes and font families (including Nerd Font
  variants),
- download of plain text transcripts (`.txt`) of recordings.

---

asciinema server is free and open-source software (FOSS). Source code and
license available at
[github.com/asciinema/asciinema-server](https://github.com/asciinema/asciinema-server).
