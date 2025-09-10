# Markers

Markers are specific time locations in a recording, useful for automation of
the playback. `asciinema play -m` command can use them as breakpoints, while
[asciinema web player](../player/index.md) can also use them for navigation and
advanced automation.

## Adding markers to a recording

Markers can be added to a recording in two ways.

During a recording session, you can add markers in real-time by pressing a
configured [keyboard shortcut](shortcuts.md). Set `rec.add_marker_key` [config
file option](configuration/index.md) first as there's no default binding at the
moment. When a marker is added a [desktop
notification](desktop-notifications.md) is displayed.

For existing recordings, you can edit the [asciicast](../asciicast/v3.md) file
with your favourite editor and insert marker events at desired time locations.
See [marker events in asciicasts](../asciicast/v3.md#m-marker) for more
information.

## Markers as breakpoints

When replaying a recording in a terminal you can use `-m`/`--pause-on-markers`
flag to enable auto-pause-on-marker behaviour:

```sh
asciinema play -m demo.cast
```

In this mode, when a marker is encountered, the playback automatically pauses
and can be resumed by pressing <kbd>space</kbd> key (or a [shortcut of your
choice](shortcuts.md#playback-shortcuts)). The playback continues until the next
marker is encountered. When paused, you can also jump to the next marker by
pressing <kbd>]</kbd> key (also configurable).

!!! tip

    Breakpoints can be useful in live demos: you can prepare a recording with
    markers, and have it stop automatically wherever you want to explain
    terminal contents in more detail.
