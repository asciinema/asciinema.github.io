# API

asciinema player provides `AsciinemaPlayer` module, which exports `create`
function for adding the player to a page.

The player object, returned by `create` function, provides several methods that
can be used to control the player or obtain information about its state.

Check [Installation](quick-start.md#installation) section for instructions on
making the module available to your code.

## Mounting in DOM

Add the player to a page with:

```javascript
AsciinemaPlayer.create(src, containerElement, opts);
```

The arguments are:

- `src` - recording source, typically a recording URL,
- `containerElement` - container DOM element, to mount the player in,
- `opts` - configuration options (optional)

For example, to mount the player inside `demo` element and use
[idleTimeLimit](options.md#idletimelimit) option do this:

```javascript
AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
  idleTimeLimit: 2
});
```

See [Loading a recording](loading.md) learn about various ways of getting a
recording into the player.

See [Options](options.md) for a complete list of available options.

## Control & inspection

To control the player programmatically, assign the return value of
`AsciinemaPlayer.create` to a variable. Then use any of the control methods like
this:

```javascript
const player = AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'));

player.play().then(() => {
  console.log(`started! duration: ${player.getDuration()}`);
});
```

Here goes a complete list of available methods exposed by the player:

### `getCurrentTime()`

Returns the current playback time in seconds.

```javascript
player.getCurrentTime(); // => 1.23
```

### `getDuration()`

Returns the length of the recording in seconds, or `null` if the recording is
not loaded yet.

```javascript
player.getDuration(); // => 123.45
```

### `play()`

Initiates playback of the recording. If the recording hasn't been
[preloaded](options.md#preload) then it's loaded, and playback is started.

```javascript
player.play();
```

This function returns a promise which is fulfilled when the playback actually
starts.

```javascript
player.play().then(() => {
  console.log(`started! duration: ${player.getDuration()}`);
});
```

If you want to synchronize asciinema player with other elements on the page,
e.g.  [audio HTML
element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio), then
you can use this promise for coordination. Alternatively you can add event
listener for [play](#play-event) / [playing](#playing-event) events (see below).

### `pause()`

Pauses playback.

```javascript
player.pause();
```

The playback is paused immediately.

### `seek(location)`

Changes the playback location to specified time or marker.

`location` argument can be:

- time in seconds, as number, e.g. `15`
- position in percentage, as string, e.g `'50%'`
- specific [marker](markers.md) by its 0-based index, as `{ marker: i }` object, e.g. `{ marker: 3 }`
- previous marker, as `{ marker: 'prev' }` object,
- next marker, as `{ marker: 'next' }` object.

This function returns a promise which is fulfilled when the location actually
changes.

```javascript
player.seek(15).then(() => {
  console.log(`current time: ${player.getCurrentTime()}`);
});
```

### `addEventListener(eventName, handler)`

Adds event listener, binding handler's `this` to the player object.

See [Events](#events) below for the list of all supported events.

### `dispose()`

Use this function to dispose of the player, i.e. to shut it down, release all
resources and remove it from DOM.

## Events

The following events are dispatched by the player during the playback. You can
react to them by attaching event listeners with
[addEventListener](#addeventlistenereventname-handler).

### `play` event

`play` event is dispatched when playback is _initiated_, either by clicking play
button or calling `player.play()` method, but _not yet started_.

```javascript
player.addEventListener('play', () => {
  console.log('play!');
})
```

!!! info

    There's subtle difference between the `play` event and the `playing` event
    (below). If the recording is not [preloaded](options.md#preload) (default
    behaviour) then `play` is trigerred when the player _initiates_ the playback
    and starts fetching the recording. In other words, `play` signals the intent
    of playback. `playing` signals the actual start.

### `playing` event

`playing` event is dispatched when playback actually starts or resumes from
pause.

```javascript
player.addEventListener('playing', () => {
  console.log(`playing! we're at: ${this.getCurrentTime()}`);
})
```

### `pause` event

`pause` event is dispatched when playback is paused.

```javascript
player.addEventListener('pause', () => {
  console.log("paused!");
})
```

### `ended` event

`ended` event is dispatched when playback stops after reaching the end of
the recording.

```javascript
player.addEventListener('ended', () => {
  console.log("ended!");
})
```

### `input` event

`input` event is dispatched for every keyboard input that was recorded.

Callback's 1st argument is an object with `data` field, which contains
registered input value. Usually this is ASCII character representing a key, but
may be a control character, like `"\r"` (enter), `"\u0001"` (ctrl-a), `"\u0003"`
(ctrl-c), etc. See [input event in asciicast file
format](../asciicast/v3.md#supported-event-codes) for more information.

```javascript
player.addEventListener('input', ({ data }) => {
  console.log('input!', JSON.stringify(data));
})
```

This event can be used for example to play keyboard typing sound, or display key
presses on the screen.

!!! note

    `input` events are available only for asciicasts recorded with `--stdin`
    option, i.e. `asciinema rec --stdin <filename>`.

_Experimental_ `inputOffset` _driver option_ can be used to shift triggering of
input events in time, e.g. when you need them to fire earlier due to audio
sample latency.

Say, you want to play Cherry MX Brown (eeewww!) sound for each key press.

```javascript
const player = AsciinemaPlayer.create({
  url: '/demo.cast',
  inputOffset: -0.125
}, document.getElementById('demo'));

player.addEventListener('input', ({ data }) => {
  // this is fired 125 milliseconds ahead of the original key press time
  playSound(data);
})
```

Below is the result. Make sure your audio is not on mute.

<div class="player" id="player-manual-player-api-input"></div>

!!! note

    `inputOffset` is a _driver option_. Driver options are options specific to
    each
    [driver](https://github.com/asciinema/asciinema-player/tree/develop/src/driver),
    and they must be passed in `create`'s first argument, together with a URL.
    `inputOffset` is an option of the [recording
    driver](https://github.com/asciinema/asciinema-player/tree/develop/src/driver).

    Concept of drivers is not fully finalized yet and is subject to change. Feel
    free to check the source code of currently available drivers for what
    options are available. Be warned though: drivers other than the default
    recording one are experimental and may change in the future.

### `marker` event

`marker` event is dispatched for every [marker](markers.md) encountered during
playback.

Callback's 1st argument is an object with `index`, `time` and `label` fields,
which represent marker's index (0-based), time and label respectively.

```javascript
player.addEventListener('marker', ({ index, time, label }) => {
  console.log(`marker! ${index} - ${time} - ${label}`);
})
```

This event can be used for orchestrating arbitrary, timed actions on your page
outside of the player, as well as for fine-grained playback control, e.g.
[implementing looping over a section of a
recording](markers.md#seeking-to-a-marker).
