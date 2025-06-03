# Desktop notifications

During a recording session there are several situations where asciinema CLI
needs to display a user notification. Typical scenarios include:

- recording is suspended/resumed with <kbd>ctrl+\</kbd>
  [shortcut](shortcuts.md),
- [marker](markers.md) is added, with a user-defined shortcut,
- file write error happens,
- live stream gets disconnected from the server.

The notification must happen without printing anything to a terminal, therefore
asciinema uses native desktop notifications for this, which don't interfere with
the state of the terminal. This works out of the box on Linux (via
`notify-send`) and macOS (`osascript`).

!!! note

    Technically the recorder could show a notification inside a terminal by just
    printing a message but this can potentially mess up the output/expectations
    of a program currently running in the foreground, e.g. a shell, vim etc.

You can disable desktop notifications with the `notifications.enabled` option in
the [config file](configuration.md):

```ini title="~/.config/asciinema/config"
[notifications]
enabled = no
```

## Custom notification command

A custom notification command can be configured with the `notifications.command`.

The command is executed with the following environment variables:

- `TEXT` - set to the notification text,
- `ICON_PATH` - set to the path of the asciinema logo icon.

Below is an example of [tmux](https://github.com/tmux/tmux/wiki) status bar
integration:

```ini title="~/.config/asciinema/config"
[notifications]
command = tmux display-message "$TEXT"
```

The command is executed in a shell (`/bin/sh`), therefore it's possible to use
shell constructs like pipes.
