# Quick start

This guide shows how to use asciinema CLI for recording, replaying and
publishing terminal sessions.

For a broader overview of what's possible with asciinema check out the [intro
guide](../../getting-started.md).

## Install asciinema CLI

asciinema CLI is available in most package repositories on Linux, macOS, and
FreeBSD. Search for a package named `asciinema`.

=== "pipx"

    ``` bash
    pipx install asciinema
    ```

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

## Record a terminal session

To start a recording session use the [rec
command](usage.md#asciinema-rec-filename):

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

## Replay directly in a terminal

To replay a recording in your terminal use [play
command](usage.md#asciinema-play-filename):

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

## Share via asciinema.org

If you want to watch and share it on the web, upload it:

```sh
asciinema upload demo.cast
```

The above command uploads it to [asciinema.org](https://asciinema.org), which is
a default [asciinema server](../server/index.md) instance, and prints a secret
link you can use to watch your recording in a web browser.

!!! note

    This step is completely optional. You can embed your recordings on a web
    page with [asciinema player](../player/index.md), or publish them to a
    self-hosted [asciinema server](../server/index.md) instance.

## Record and publish in one command

If you omit the filename the recording is saved to a temporary file. When the
recording session ends asciinema enters interactive mode, which lets you decide
what to do:

```console
$ asciinema rec
asciinema: recording asciicast to /tmp/tmpo8_612f8-ascii.cast
asciinema: press <ctrl-d> or type "exit" when you're done
$ echo hello
hello
$ exit
asciinema: recording finished
(s)ave locally, (u)pload to asciinema.org, (d)iscard
[s,u,d]? _
```

!!! note

    This behaviour is likely to change in
    [v3.0](https://github.com/asciinema/asciinema/milestone/8) of the CLI.
    Recording without filename will either be prohibited or will default to
    saving a file in a current directory.

## Next

These are the basics, but there's much more. See the [Usage](usage.md) section
for detailed information on each command of the CLI.

If you're interested in sharing your recordings via asciinema.org please
familiarize yourself with docs on [asciinema
upload](usage.md#asciinema-upload-filename) and [asciinema
auth](usage.md#asciinema-auth) commands.

Happy recording!
