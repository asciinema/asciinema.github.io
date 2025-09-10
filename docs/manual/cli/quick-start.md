# Quick start

This guide shows how to use asciinema CLI for recording, replaying, publishing,
and live streaming terminal sessions.

For a broader overview of what's possible with asciinema check out the [intro
guide](../../getting-started.md).

## Install asciinema CLI

asciinema CLI is available in most package repositories on Linux, macOS, and
FreeBSD. Search for a package named `asciinema`.

=== "apt (Debian, Ubuntu)"

    ``` bash
    sudo apt install asciinema
    ```

=== "pacman (Arch, Manjaro)"

    ``` bash
    sudo pacman -S asciinema
    ```

=== "homebrew (macOS)"

    ``` bash
    brew install asciinema
    ```

=== "Other"

    Check the [Installation](installation.md) section for all installation
    options.

You can also download a pre-built, static binary of the latest version from the
[releases](https://github.com/asciinema/asciinema/releases) page.

## Record a terminal session

To start a recording session use the `rec` command:

```sh
asciinema rec demo.cast
```

When done, press <kbd>ctrl+d</kbd> or enter `exit` to end the recording.

Instead of recording a shell you can record any command with `--command` / `-c`
option:

```sh
asciinema rec -c htop demo.cast
```

The recording ends when you exit `htop` by pressing its `q` shortcut.

Run `asciinema rec --help` for all recording options.

## Replay directly in a terminal

To replay a recording in your terminal use the `play` command:

```sh
asciinema play demo.cast
```

To replay it with double speed use `--speed` / `-s` option:

```sh
asciinema play -s 2 demo.cast
```

A unique feature of asciinema is the ability to optimize away idle moments in a
recording using the `--idle-time-limit` / `-i` option:

```sh
asciinema play -i 2 demo.cast
```

You can pass `-i 2` to `asciinema rec` as well, to set it permanently on a
recording. Idle time limiting makes the recordings much more interesting to
watch. Try it!

Run `asciinema play --help` for all playback options.

!!! tip

    For the best playback experience it is recommended to run `asciinema play`
    in a terminal of size equal or bigger than the one used at the recording
    time, as there's no "transcoding" of control sequences for the current
    terminal size.

## Share via asciinema.org

If you want to watch and share it on the web, upload it:

```sh
asciinema upload demo.cast
```

The above command uploads it to [asciinema.org](https://asciinema.org), which is
a default [asciinema server](../server/index.md) instance, and prints a secret
link you can use to watch your recording in a web browser.

Run `asciinema upload --help` for all upload options.

!!! note

    This step is completely optional. You can embed your recordings on a web
    page with [asciinema player](../player/index.md), or publish them to a
    self-hosted [asciinema server](../server/index.md) instance.

## Stream a terminal session

To stream your terminal live to asciinema.org:

```sh
asciinema stream -r
```

Similarly to the `upload` command, this one also lets you stream to a
self-hosted [asciinema server](../server/index.md) instance.

To stream locally:

```sh
asciinema stream -l
```

This starts a local web server which lets you watch the stream from a local
machine or over LAN.

Run `asciinema stream --help` for more streaming options.

!!! note

    Live streaming requires asciinema CLI 3.0 or newer.

Finally, you can stream and record to a file at the same time:

```sh
asciinema session -o demo.cast -r -l
```

The session command is a more generic variant of `rec` and `stream`, that can
do everything those two commands can.

Run `asciinema session --help` for more details.

## Next

These are the basics, but there's much more. We highly encourage checking out
`--help` information for each command - it contains way more information than
was covered in this guide.

Last but not least! Consider creating shell aliases for frequently used
commands:

```sh
alias rec='asciinema rec'
alias play='asciinema play'
alias stream='asciinema stream -r'
```

Happy recording!
