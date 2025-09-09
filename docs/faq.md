---
hide:
  - navigation
---

# Frequently Asked Questions (FAQ)

Here you can find answers to most frequently asked questions about asciinema.

If you don't find an answer to your question join our Matrix room
`#asciinema:matrix.org` ([web
client](https://matrix.to/#/#asciinema:matrix.org)) or `#asciinema` IRC channel
on [Libera.Chat](https://libera.chat/) ([web
client](https://web.libera.chat/#asciinema)).

## How is "asciinema" pronounced?

_[as-kee-nuh-muh]_.

The word "asciinema" is a combination of English "ASCII" and Ancient Greek
"κίνημα" (kínēma, "movement").

## What kind of sorcery is this?

It's not a sorcery. Read about it on the [How it works](how-it-works.md) page.

## Do I have to upload my recordings to asciinema.org?

No.

When you recording with `asciinema rec <filename>` then the recording is
saved locally, nothing is uploaded anywhere.

You can replay it directly in your terminal with:

```
asciinema play <filename>
```

At this point you have several options if you want to share it.

First, if you want to host it on asciinema.org in the end then run:

```
asciinema upload <filename>
```

You can view the recording there and share it via secret (default) or public URL.

If you'd rather host it yourself you have following options:

- [use standalone asciinema player](manual/player/index.md) on your website, or
- [set up your own asciinema server instance](manual/server/index.md) instance,
  and [set API URL
  accordingly](https://github.com/asciinema/asciinema-server/blob/master/docs/INSTALL.md#using-asciinema-recorder-with-your-instance).

With older versions of asciinema CLI (2.x), when you run `asciinema rec`
without specifying the filename argument then after completing the recording
you get a prompt which lets you decide what to do.

asciinema 2.4+ lets you decide whether to save, upload or discard the
recording:

```
asciinema: recording finished
(s)ave locally, (u)pload to asciinema.org, (d)iscard
[s,u,d]? _
```

Versions prior to 2.4 let you confirm or cancel the upload:

```
asciinema: recording finished
asciinema: press <enter> to upload to asciinema.org, <ctrl-c> to save locally
_
```

## How can I delete a recording from asciinema.org?

In order to be able to delete a recording you first need to associate it with an
asciinema.org user account. You can do that by using [asciinema
auth](manual/cli/usage.md#asciinema-auth) command. Once you complete this step
look for a dropdown with a gear icon on recording page (it's below the player,
on the right side).

If you don't want to create an asciinema.org account only to delete a recording,
you don't need to do anything. All recordings not associated with a user account
are automatically deleted 7 days after they were uploaded.

!!! note

    A new install ID is generated on each system you use asciinema on, so in
    order to keep all recordings under a single asciinema.org account you need
    to run `asciinema auth` on all of those systems.

    If you followed the above steps and you still can't see the gear dropdown
    then most likely you have used different local user accounts for recording
    and for auth (e.g. you recorded in a VM or Docker container but you ran
    `asciinema auth` on your host machine).

## Can I edit/post-process the recording?

Yes, but not yet in the way you would expect :)

[asciicasts](manual/asciicast/v2.md) are quite simple newline-delimited JSON
files. You can edit them easily with any text editor which supports UTF-8. The
recorded data is more or less a series of print statements, with [ansi escape
sequences](https://en.wikipedia.org/wiki/ANSI_escape_code) (also known as
control sequences or control codes). You can add, delete or modify text there.
There's no tool for visual editing of the screen contents though (due to
incremental, state-machine based nature of terminal emulators).

## Does asciinema record the passwords I type during recording sessions?

By default asciinema records only terminal output - what you actually see in a
terminal window. It doesn't record input, i.e. key presses.

Some applications turn off so called "echo mode" when asking for a password,
hiding the password.  Because the typed in password characters are not printed
they're not recorded. Other applications display star characters instead of real
characters and asciinema records only "\*\*\*" (a bunch of stars). However,
there are applications which don't have any precautions and the actual password
is echoed to a terminal. In such case the password would be recorded by
asciinema. Make sure you know how an application is handling password input
before you record it.

asciinema CLI 2.0 introduced ability to record key presses with `asciinema rec
--stdin` option. When this option is used then all typed in characters are
captured as [stdin (i)
events](manual/asciicast/v2.md#i-input-data-read-from-a-terminal) in the
resulting asciicast file. This _includes all passwords typed in from a
keyboard_, even if "echo mode" is turned off. When replaying, these chars are
not displayed as output, but they could be used with [asciinema
player](manual/player/index.md) to implement [custom event handler for input
events](manual/player/api.md#input-event).

`--stdin` basically does keylogging that is scoped to a _single_ shell instance
/ terminal tab. Given its sensitive nature it's disabled by default and has to
be explicitly enabled (opted-in). However, even if enabled, captured key presses
are saved in the local recording file only. Unless you publish your recording on
the internet, e.g. on [asciinema.org](https://asciinema.org), it all stays with
you.

## Why am I getting `command not found` at the beginning of the recording session?

When you record your terminal asciinema starts a new shell instance (as
indicated by `$SHELL` environment variable) by default. It invokes `exec
$SHELL`, which in most cases translates to `exec /bin/bash` or `exec /bin/zsh`.
This means the shell runs as an "interactive shell", but **not as a "login
shell"**.

If you have functions and/or other shell configuration defined in either
`.bash_profile`, `.zprofile` or `.profile` file they are not loaded unless the
shell is started as a login shell.

Some terminal emulators do that (passing "-l" option to the shell command-line),
some don't. asciinema doesn't.

Worry not, you have several options. You can:

* move this part of configuration to `.bashrc/.zshrc`,
* record with `asciinema rec -c "/bin/bash -l"` or,
* add the following setting to your `$HOME/.config/asciinema/config` file:

```
[record]
command = /bin/bash -l
```

## How can I change my asciinema.org profile avatar?

asciinema.org (any [asciinema server](manual/server/index.md) in general) uses
gravatar.com for profile avatars. The avatars are based on account email
address.

If you want to change yours then you can do it at [gravatar.com](https://gravatar.com).

At the moment this is the only option.

## Why my shell prompt/theme isn't working during recording?

See [this answer](#why-am-i-getting-command-not-found-at-the-beginning-of-the-recording-session).

## Why `upload failed: Invalid or revoked install ID`?

If you get this error when uploading a recording then it means your local
install ID has been revoked (you most likely clicked "Revoke" on your account
settings page). No further uploads with this install ID will be possible.

To re-enable uploads from this machine do this:

1. remove the install ID file `~/.config/asciinema/install-id` (also check `~/.asciinema/install-id`)
2. [login](https://asciinema.org/login/new) to your asciinema.org account
3. run `asciinema auth` - this will generate new local install ID
4. open the printed URL - this will re-authenticate your system with you asciinema.org account

## Why some of my custom shell functions are not available during recording?

See [this answer](#why-am-i-getting-command-not-found-at-the-beginning-of-the-recording-session).
