# Loading a recording

While the easiest way of loading a recording into the player is by using
asciicast file URL, it's also easy to customize the loading procedure or even
replace it completely.

## Preloading

By default the player doesn't fetch a recording upon initialization, postponing
the loading until user starts the playback. Given how small (in terms of
filesize) terminal recordings are this usually is perfectly fine. However, if
you wish so you can force the player to preload the recording upon its
initialization using the [preload option](options.md#preload):

```javascript
AsciinemaPlayer.create(src, containerElement, { preload: true });
```

## Custom `fetch` options

If you'd like to fetch a recording from a URL, but you need to tweak how HTTP
request is performed (e.g. configure credentials, change HTTP method), you can
do so by using `{ url: "...", fetchOpts: { ... } }` object as the source
argument.  `fetchOpts` object is then passed to
[fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) (as its 2nd
argument).

For example:

```javascript
AsciinemaPlayer.create(
  { url: url, fetchOpts: { method: 'POST' } },
  containerElement
);
```

## Inlining with Data URL

If a recording file is small and you'd rather avoid additional HTTP request, you
can inline the recording by using [Data
URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs):

```javascript
AsciinemaPlayer.create(
  'data:text/plain;base64,' + base64encodedAsciicast,
  containerElement
);
```

For example:

```javascript
AsciinemaPlayer.create(
  'data:text/plain;base64,eyJ2ZXJzaW9uIjogMiwgIndpZHRoIjogODAsICJoZWlnaHQiOiAyNH0KWzAuMSwgIm8iLCAiaGVsbCJdClswLjUsICJvIiwgIm8gIl0KWzIuNSwgIm8iLCAid29ybGQhXG5cciJdCg==',
  document.getElementById('demo')
);
```

This approach is useful e.g. when you're dynamically generating HTML on the
server-side, embedding player initialization code in HTML of the page.

## Dynamic loading

If you prefer to provide a recording to the player manually at runtime you can
use the following variant of the `src` argument with the `create` function:

```javascript
AsciinemaPlayer.create({ data: data }, containerElement);
```

The value of `data` can be:

- a string containing asciicast in [v3](../asciicast/v3.md), [v2](../asciicast/v2.md) or [v1](../asciicast/v1.md) format
- an array representing asciicast in [v3](../asciicast/v3.md) or [v2](../asciicast/v2.md) format
- an object representing asciicast in [v1](../asciicast/v1.md) format
- a function which returns one of the above (may be async)

Provided `data` is parsed with built-in asciicast format parser by default (also
see [Playing other recording formats](#playing-other-recording-formats) below).

Examples of supported `data` specifications:

```javascript
// string representing asciicast in v2 format (ndjson)
'{"version": 2, "width": 80, "height": 24}\n[1.0, "o", "hello "]\n[2.0, "o", "world!"]';
```

```javascript
// string representing asciicast in v1 format (json)
'{"version": 1, "width": 80, "height": 24, "stdout": [[1.0, "hello "], [1.0, "world!"]]}';
```

```javascript
// array representing asciicast in v2 format
[
  {version: 2, width: 80, height: 24},
  [1.0, "o", "hello "],
  [2.0, "o", "world!"]
]
```

```javascript
// object representing asciicast in v1 format
{version: 1, width: 80, height: 24, stdout: [[1.0, "hello "], [1.0, "world!"]]};
```

```javascript
// function returning a string representing asciicast in v2 format (ndjson)
() => '{"version": 2, "width": 80, "height": 24}\n[1.0, "o", "hello "]\n[2.0, "o", "world!"]';
```

Passing asciicast v2 as a string looks like this:

```javascript
AsciinemaPlayer.create(
  { data: '{"version": 2, "width": 80, "height": 24}\n[1.0, "o", "hello "]\n[2.0, "o", "world!"]' },
  document.getElementById('demo')
);
```

Similarly to [inlining with Data URL](#inlining-with-data-url) this is useful
for server-side generation use-cases.

If `data` is a function, then the player invokes it when playback is started by
a user. If [preload](options.md#preload) option is used, the function is invoked
during player initialization (mounting in DOM).

Say you'd like to embed asciicast contents in a (hidden) HTML tag on your page,
following data source can be used to extract it and pass it to the player:

```javascript
AsciinemaPlayer.create(
  { data: () => document.getElementById('asciicast').textContent.trim() },
  document.getElementById('demo')
);
```

Finally, you can call `fetch` yourself and transform the result:

```javascript
AsciinemaPlayer.create(
  { data: () => fetch(url, { method: 'POST' }).then(...) },
  containerElement
);
```

This is handy e.g. when you need to extract an asciicast from a nested JSON
structure produced by HTTP API.

!!! note

    You can fetch the recording first and only then initialize the player with
    `{ data: '...' }`, like this:

    ```javascript
    fetch('/demo.cast').then(resp => {
      AsciinemaPlayer.create({ data: resp }, document.getElementById('demo'));
    });
    ```

    However this has a downside: the player is not added to the page until the
    data is loaded, resulting in the player poping up on the page out of nowhere
    a moment after the page load.

    By using `{ data: () => ... }` (function variant) you can mount the player
    on the page immediately.

## Playing other recording formats

By default, recordings are parsed with a built-in
[asciicast](../asciicast/v3.md) format parser.

If you have a recording produced by other terminal session recording tool (e.g.
script, termrec, ttyrec) you can use one of [built-in file format
parsers](parsers.md#built-in-parsers), or [implement a custom parser
function](parsers.md#custom-parsers).

Recording format parser can be specified in the source argument to
`AsciinemaPlayer.create` as a string (built-in) or a function (custom):

```javascript
AsciinemaPlayer.create({ url: url, parser: parser }, containerElement);
```

See [Parsers](parsers.md) for information on available built-in parsers and how
to implement a custom one.

## Playing live streams

In addition to loading static asciicast files, the asciinema player supports
connecting to live WebSocket streams for real-time terminal session viewing.
This enables viewers to watch terminal sessions as they happen, with minimal
latency (typically below 100ms).

To connect the player to a live WebSocket stream:

```javascript
AsciinemaPlayer.create(
  'ws://example.com/stream',
  document.getElementById('demo')
);
```

For example, asciinema server provides consumer endpoint for live streams at
`/ws/s/<public-token>`. This is how the player hosted at asciinema.org connects
to a stream:

```javascript
AsciinemaPlayer.create(
  'wss://asciinema.org/ws/s/<public-token>',
  document.getElementById('demo')
);
```

Player's WebSocket driver, activated by use of `ws://` or `wss://` scheme,
automatically handles stream protocol negotiation, uses adaptive buffering to
achieve lowest possible latency, and gracefully handles disconnections
(reconnect with backoff + jitter).

For detailed information about implementing WebSocket streaming servers,
including complete protocol specifications and message formats, see the [Live
streaming](../server/streaming.md) in the server manual.
