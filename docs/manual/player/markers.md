# Markers

Markers are specific points on a recording's timeline, which can be used for
navigation within the recording or to automate the player.

Each marker is defined by its time and can have an optional label.

The player displays markers as dots inside the progress bar in the bottom part
of the UI. When hovered, a marker shows the time and the label. Clicking on a
marker moves the playback to its corresponding time position.

<div class="player" id="player-manual-player-markers-intro"></div>

Markers are useful for defining chapters, or any points of interest, as well as
act as [breakpoints](#markers-as-breakpoints). They can be reacted on by
listening for [`marker` event](#marker-event), and they can also be used for
[programmatic seek](#seeking-to-a-marker).

There two ways of specifying markers for use in the player:

- using [`markers` option](options.md#markers),
- embedding markers in the recording - see [Markers](../cli/markers.md) in the
  CLI section for details.

## Setting markers

The easiest way of setting markers is by using [`markers`
option](options.md#markers).

Example of setting _unlabeled_ markers:

```javascript
AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
  markers: [5.0, 25.0, 66.6, 176.5]  // time in seconds
});
```

Example of setting _labeled_ markers:

```javascript
AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
  markers: [
    [5.0,   "Installation"],  // time in seconds + label
    [25.0,  "Configuration"],
    [66.6,  "Usage"],
    [176.5, "Tips & Tricks"]
  ]
});
```

If you keep your recordings on [asciinema.org](https://asciinema.org) or you
[self-host the server](../server/self-hosting/index.md) you can set markers on
recording settings page.

Another way of defining markers is by embedding them directly in a recording.
Note the lines with [`m` code](../asciicast/v3.md#m-marker) - those are marker
definitions:

``` json title="example.cast"
{"version": 2, "width": 80, "height": 24, "timestamp": 1700000000}
[0.248848, "o", "..."]
[1.001376, "o", "..."]
[1.500000, "m", "Intro"]
[2.143733, "o", "..."]
[5.758989, "o", "..."]
[6.000000, "m", "Installation"]
[7.543289, "o", "..."]
[8.625739, "o", "..."]
[15.000000, "m", "Usage"]
[16.643287, "o", "..."]
[17.389425, "o", "..."]
```

asciinema recorder can be [configured](../cli/configuration/index.md) to have a
keyboard shortcut for adding markers during the recording session. If you have
an existing recording you can edit the file with your favourite editor and
insert marker lines as shown in the above example.

## Markers as breakpoints

Markers can be configured to act as breakpoints, i.e. automatically pause the
playback when reached.

Start the playback below and observe the player pausing as it reaches each
marker.

<div class="player" id="player-manual-player-markers-breakpoints"></div>

This behaviour can be enabled with [pauseOnMarkers](options.md#pauseonmarkers)
option.

## `marker` event

When the player encounters a marker during the playback it dispatches a
[`marker` event](api.md#marker-event).

You can use it to react to a marker any way you want. Here we manually implement
breakpoints by pausing the player using its [API](api.md):

```javascript
player.addEventListener('marker', _marker => {
  player.pause();
})
```

## Seeking to a marker

Markers can also be used as a [seek](api.md#seeklocation) target.

You can seek to next, previous or a specific marker:

```javascript
// seek to next marker
player.seek({ marker: 'next' });

// seek to previous marker
player.seek({ marker: 'prev' });

// seek to a marker with index 2
player.seek({ marker: 2 });
```

The following example shows how to implement looping over a section of a
recording by combining [`marker` event](api.md#marker-event) with [`seek`
method](api.md#seeklocation):

```javascript
player.addEventListener('marker', ({ index, time, label }) => {
  console.log(`marker! ${index} - ${time} - ${label}`);

  if (index == 1) {
    player.seek({ marker: 0 });
  }
})
```

Here's the result:

<div class="player" id="player-manual-player-markers-seeking"></div>

## Keyboard navigation

The following keyboard shortcuts can be used to navigate between markers when
the player element has input focus:

* <kbd>[</kbd> (left square bracket) - rewind to the previous marker
* <kbd>]</kbd> (right square bracket) - fast-forward to the next marker
