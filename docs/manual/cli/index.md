---
hide:
  - toc
---

# asciinema CLI

__asciinema CLI__ (also known as asciinema "client" or "recorder") is a
command-line tool for recording and live streaming terminal sessions.

Unlike typical _screen_ recording software, which records visual output of a
screen into a heavyweight video files (`.mp4`, `.mov`), asciinema CLI runs
_inside a terminal_, capturing terminal session output into lightweight
recording files in the [asciicast](../asciicast/v3.md) format (`.cast`), or
streaming it live to viewers in real-time.

Recordings can be replayed in a terminal, embedded on a web page with the
[asciinema player](../player/index.md), or published to an [asciinema
server](../server/index.md), such as [asciinema.org](https://asciinema.org), for further
sharing. Live streams allow viewers to watch terminal sessions as they happen.

<div class="player" id="player-manual-cli-intro"></div>

Recording a terminal with asciicast is just:

```sh
asciinema rec demo.cast
```

Similarly, live terminal streaming is as simple as:

```sh
asciinema stream -r
```

Check out the [quick start guide](quick-start.md) for installation and usage
overview.

---

Notable features:

- recording and replaying of sessions inside a terminal,
- local and remote [live streaming](quick-start.md#stream-a-terminal-session)
  of terminal sessions to multiple viewers in real-time,
- [lightweight recording format](../asciicast/v3.md), which is highly
  compressible (down to 15% of the original size e.g. with `zstd` or `gzip`),
- integration with [asciinema server](../server/index.md), e.g.
  [asciinema.org](https://asciinema.org), for easy recording hosting and live
  streaming.

---

asciinema CLI is free and open-source software (FOSS). Source code and license
available at
[github.com/asciinema/asciinema](https://github.com/asciinema/asciinema).
