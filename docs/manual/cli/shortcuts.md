---
hide:
  - toc
---

# Keyboard shortcuts

There are several key bindings used by the CLI during recording and playback.
Most of them can be customized in the [config file](configuration/index.md).

## Recording shortcuts

The following keyboard shortcuts are available when recording with `asciinema rec`:

shortcut | action | 3.x config file option | 2.x config file option | notes
---------|--------|---------------|------|---
<kbd>ctrl+\</kbd> | toggle the capture of a terminal | `recording.pause_key` | `rec.pause_key` | similar to "mute" on an audio call
<kbd>ctrl+d</kbd> | end the recording session | - | - |  this is handled by a shell
- | add a [marker](markers.md) | `recording.add_marker_key` | `rec.add_marker_key` | no default shortcut for this

## Playback shortcuts

The following keyboard shortcuts are available when replaying with `asciinema play`:

shortcut | action | 3.x config file option | 2.x config file option | notes
---------|--------|---------------|------|---
<kbd>space</kbd> | toggle the playback | `playback.pause_key` | `play.pause_key` | pauses / resumes
<kbd>]</kbd> | jump to next [marker](markers.md) | `playback.next_marker_key` | `play.next_marker_key` |
<kbd>.</kbd> | step (when paused) | `playback.step_key` | `play.step_key` | steps through a recording<br>a frame at a time
<kbd>ctrl+c</kbd> | stop | - | - | ends the playback

## Prefix key

You can define a "prefix key" for the recording shortcuts with `rec.prefix_key`
option in the config file:

=== "CLI 3.0+"

    ```toml title="~/.config/asciinema/config.toml"
    [recording]
    prefix_key = "C-a"
    ```

=== "CLI 2.0+"

    ```ini title="~/.config/asciinema/config"
    [rec]
    prefix_key = C-a
    ```

This works similarly to a prefix key in [GNU
screen](https://www.gnu.org/software/screen/) or
[tmux](https://github.com/tmux/tmux/wiki). By default there's no prefix key
enabled.

!!! note

    1. Prefix key doesn't affect the <kbd>ctrl+d</kbd> shortcut used for ending
    the recording session. That is because <kbd>ctrl+d</kbd> is a shortcut
    handled by a shell (making it exit), not by asciinema recorder.

    2. There's no prefix key concept for the `play` command because there's no
    interactive process to forward the key presses during the playback, and
    therefore no risk of shortcut conflicts.
