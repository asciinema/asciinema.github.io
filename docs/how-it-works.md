---
hide:
  - toc
---

# How it works

Unlike traditional screen recording tools that capture video, asciinema records
the textual output, making the recording files lightweight and easy to share.

asciinema's recording process is deeply rooted in the Unix pseudo-terminal (PTY)
concept, a mechanism shared by commands like `ssh`, `screen`, and `script`. A
PTY is essentially a pair of pseudo-devices: the slave, which emulates a real
text terminal, and the master, which a terminal emulator process uses to control
the slave.

During a recording session, started with `asciinema rec <filename>`, asciinema
acts as the master, interfacing between the user and the shell. This setup
allows asciinema to transparently capture all terminal outputs, including text
and invisible escape/control sequences, in their raw, unfiltered form.
Additionally, the use of PTY lets asciinema capture terminal window resize
events, and when enabled, also keyboard input.

The recordings are saved in [asciicast](manual/asciicast/v2.md) format, designed
for simplicity and interoperability. Every detail of the terminal session is
encoded as a sequence of time-stamped events, preserving not only the content
but also the rhythm and flow of the session.

Replaying a recorded session involves more than just displaying text; it
requires interpreting a complex series of ANSI escape code sequences to
accurately render what was recorded. When you replay in a terminal, with
`asciinema play <filename>`, your terminal does the job of interpreting and
rendering the recorded content. asciinema simply leverages the terminal to do
the heavy lifting.

However, playback in a web browser is another story. To do that we need
something that can interpret ANSI sequences and produce visual representation of
a terminal window. Therefore, [asciinema player](manual/player/index.md) is
powered by a bespoke terminal emulator, [avt](https://github.com/asciinema/avt),
based on [Paul Williams' parser for ANSI-compatible video
terminals](https://vt100.net/emu/dec_ansi_parser). This emulator is specifically
tailored to replicate the display aspect of terminal emulation, handling color
changes, cursor movements, and accurate placement of text on the screen. It
ensures that all text attributes, including color, and styles like bold,
underline, inverse, are perfectly rendered, creating a faithful viewing
experience.

For implementation details check out [asciinema recorder source
code](https://github.com/asciinema/asciinema) and [asciinema player source
code](https://github.com/asciinema/asciinema-player).
