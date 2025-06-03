# Usage

Below is an overview of the most commonly used commands of asciinema CLI. Run
`asciinema -h` to get the full list of the available commands with their
options.

## `asciinema rec [filename]`

**Record a terminal session.**

By running `asciinema rec [filename]` you start a recording session. By default
a new instance of your shell (as indicated by `SHELL` environment variable) is
launched and recorded. You can specify alternative command to be launched and
recorded with `-c` option (see below).

You can temporarily pause the capture of your terminal by pressing
<kbd>ctrl+\</kbd>. This is useful when you want to execute a series of commands
that must not be captured (e.g. pasting secrets). It's an equivalent of the
"mute" functionality in an audio call. Resume the capture by pressing
<kbd>ctrl+\</kbd> again. This shortcut (and [other shortcuts](shortcuts.md)) can
be customized in the [config file](configuration/index.md). Capture state changes are
signaled via [desktop notifications](desktop-notifications.md).

Recording session ends when you exit the shell, which can be done either by
pressing <kbd>ctrl+d</kbd> or entering `exit`. If a custom command is recorded
(`-c`) then the recording session ends when the command finishes.

If the `filename` argument is given the recording is saved to a file in
[asciicast](../asciicast/v2.md) format. It can later be replayed with `asciinema
play <filename>`, and uploaded to [asciinema.org](https://asciinema.org) with
`asciinema upload <filename>`.

If the `filename` argument is omitted the complete recording is saved to a
temporary file. asciinema then shows a prompt, which lets you decide whether to
save the recording locally, upload it to asciinema.org, or discard it (v2.4+).

`ASCIINEMA_REC=1` is added to the environment of a recorded shell. This can be
used to detect active recording session in your shell config file (`.bashrc`,
`.zshrc`) in order to e.g. alter the prompt, play a sound, or change the
background color of a terminal emulator window.

Available options:

- `--stdin` - Enable input (keyboard) recording (see below)
- `--append` - Append to existing recording
- `--overwrite` - Overwrite the recording if it already exists
- `-c, --command=<command>` - Specify command to record, defaults to `$SHELL`
- `-i, --idle-time-limit=<sec>` - Limit recorded terminal inactivity to max `<sec>` seconds
- `--raw` - Save raw output, without timing information and other metadata
- `-e, --env=<var-names>` - List of environment variables to capture, defaults
  to `SHELL,TERM`
- `-t, --title=<title>` - Specify the title of the asciicast
- `--cols=<n>` - Override terminal columns for the recorded process
- `--rows=<n>` - Override terminal rows for the recorded process
- `-y, --yes` - Answer "yes" to all prompts (e.g. upload confirmation)
- `-q, --quiet` - Be quiet - suppress all notices/warnings (implies -y)

Input recording (`--stdin`) captures all characters typed in by a user. This can
be used with [asciinema player](../player/index.md) to implement [custom event
handler for input events](../player/api.md#input-event).

!!! warning

    Input recording may raise privacy/security concerns. While asciinema can't
    record anything outside a terminal window (or a tab) it was started in,
    given its sensitive nature input recording is disabled by default and needs
    to be explicitly enabled via `--stdin` option if desired.

    Also, check [this FAQ
    answer](../../faq.md#does-asciinema-record-the-passwords-i-type-during-recording-sessions)
    for more information on the topic.

!!! tip

    Consider creating a shell alias for frequent recording:

    ```sh
    alias rec='asciinema rec'
    ```

## `asciinema play <filename>`

**Replay a terminal session.**

This command replays a terminal session recorded with `rec` in the current
terminal.

Playing a local recording file:

```sh
asciinema play /path/to/demo.cast
```

Playing from HTTP(S) URL:

```sh
asciinema play https://asciinema.org/a/22124.cast
asciinema play http://example.com/casts/demo.cast
```

If an HTML page contains `<link rel="alternate" type="application/x-asciicast"
href="/casts/demo.cast">` tag then you can pass the page URL directly:

```sh
asciinema play https://asciinema.org/a/22124
asciinema play http://example.com/blog/post.html
```

[asciinema.org](https://asciinema.org) includes the tag on every recording page
automatically.

Playing from stdin:

```sh
cat /path/to/asciicast.cast | asciinema play -
ssh user@host cat asciicast.cast | asciinema play -
```

There are several [keyboard shortcuts](shortcuts.md#playback-shortcuts)
available during playback. The most important ones are:

- <kbd>ctrl+c</kbd> - end the playback early,
- <kbd>space</kbd> - toggle the playback (pause/resume).

Available options:

- `-i, --idle-time-limit=<sec>` - Limit replayed terminal inactivity to max `<sec>` seconds
- `-s, --speed=<factor>` - Playback speed (can be fractional)
- `-l, --loop` - Play in a loop
- `-m, --pause-on-markers` - Automatically pause on [markers](../player/markers.md)

!!! note

    For the best playback experience it is recommended to run `asciinema play`
    in a terminal of size equal or bigger than the one used at the recording
    time, as there's no "transcoding" of control sequences for the current
    terminal size.

!!! tip

    Consider creating a shell alias for frequent replays:

    ```sh
    alias play='asciinema play'
    ```

## `asciinema cat <filename>...`

**Print full output from a recording to a terminal.**

While `asciinema play <filename>` replays the recorded session using timing
information saved in the asciicast file, `asciinema cat <filename>` dumps the
full output to a terminal all at once. This includes all saved control
sequences, e.g. SGR for text attributes (color etc).

Both commands below produce an equivalent `output.txt` file:

```sh
asciinema cat existing.cast >output.txt
asciinema rec --raw output.txt
```

Output from multiple recordings can be dumped with a single command too:

```sh
asciinema cat one.cast two.cast three.cast
```

## `asciinema upload <filename>`

**Upload a recording to [asciinema.org](https://asciinema.org) or a [self-hosted
asciinema server](../server/self-hosting/index.md).**

This command uploads a terminal session recorded with `rec` to [asciinema
server](../server/index.md) instance, where it can be viewed and shared with a
wider audience. Default upload target is [asciinema.org](https://asciinema.org),
but it can be easily changed to [point to another server
instance](configuration/v3.md#asciinema_server_url).

It's likely that you would want to manage this and other uploaded recordings at
some point, e.g. set a title or change terminal color theme. See [asciinema
auth](#asciinema-auth) command below for more details on how to ensure secure
access to your recordings.

!!! tip

    `asciinema rec demo.cast` + `asciinema play demo.cast` + `asciinema upload
    demo.cast` is a good combo if you want to review a recording before
    publishing it on the internet.

## `asciinema auth`

**Authenticate local system with an asciinema.org user account.**

This command displays a URL, which, when opened in a web browser, authenticates
the CLI with your asciinema.org account. You may be asked to log in to your
account on the site first.

This operation is optional but recommended if you want to preserve and manage
all recordings uploaded from the current system on asciinema.org.  It ensures
all past and future uploads from this system are linked to your user account.
You can use `asciinema auth` either _before or after_ uploading any recordings,
and you need to do it only _once per system_.

If you don't create an account on asciinema.org and don't link your local system
with this command within 7 days then the recordings uploaded _from that system_
will be identified as unclaimed and as a result deleted. On the flipside, if you
want your recently uploaded recording to be deleted but you don't want to create
an asciinema.org account only to delete the recording, you don't need to do
anything. The recording will be garbage collected within 7 days. This mechanism
lets you create short-lived, "throw-away" recordings. All uploaded recordings
are hidden (unlisted) by default, therefore unless you share its secret link
with someone the recording will be completely inaccessible to anyone, and
eventually automatically deleted. If you prefer your recording to be deleted
sooner then either create an account and delete it yourself or contact
[asciinema.org admin](https://asciinema.org/about). Recordings uploaded from
other systems that were authenticated with your account are never automatically
deleted.

!!! info

    How does asciinema.org find my past recordings when I use `asciinema auth`?

    When you run either `asciinema upload` or `asciinema auth` for the first
    time asciinema CLI generates a unique identifier - install ID ([UUID
    v4](https://en.wikipedia.org/wiki/Universally_unique_identifier)) - storing
    it in the `$HOME/.config/asciinema/install-id` file.

    This ID is assigned to all uploads made with `asciinema upload` from a given
    system. By visiting the URL printed by `asciinema auth`, which includes your
    install ID, you assign it to your asciinema.org account. This lets the
    server find all existing recordings for this install ID and associate them
    with your account. This way install ID decouples upload from account
    creation, allowing those to happen in any order.
