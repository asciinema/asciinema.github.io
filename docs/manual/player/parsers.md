# Parsers

Parser is a function, which transforms a recording encoded in an arbitrary file
format into a simple object representing a terminal recording. Once the player
fetches a file, it runs its contents through a parser, which turns it into a
recording object used by the player's [recording
driver](https://github.com/asciinema/asciinema-player/blob/develop/src/driver/recording.js).

Default parser used by the player is the [asciicast](../asciicast/v3.md) parser,
however another [built-in](#built-in-parsers) or [custom
parser](#custom-parsers) can be used by including `parser` option in the source
argument of `AsciinemaPlayer.create`:

```javascript
AsciinemaPlayer.create({ url: url, parser: parser }, containerElement);
```

!!! note

    `parser` is a _driver option_. Driver options are options specific to each
    [driver](https://github.com/asciinema/asciinema-player/tree/develop/src/driver),
    and they must be passed in `create`'s first argument, together with a URL.
    `parser` is an option of the [recording
    driver](https://github.com/asciinema/asciinema-player/tree/develop/src/driver).

    Concept of drivers is not fully finalized yet and is subject to change. Feel
    free to check the source code of currently available drivers for what
    options are available. Be warned though: drivers other than the default
    recording one are experimental and may change in the future.

## Data model of a recording

asciinema player uses very simple internal representation of a recording.

The object has the following fields:

- `cols` - number of terminal columns (terminal width in chars),
- `rows` - number of terminal rows (terminal height in lines),
- `events` - iterable (e.g. an array, a generator) of events, where each item is
  a 3 element array, containing event time (in seconds), event code and event
  data.

Example recording model:

```javascript
{
  cols: 80,
  rows: 24,
  events: [
    [1.0, 'o', 'hello '],
    [2.0, 'o', 'world!'],
    [4.0, 'i', '\u0004'],
    [4.1, 'o', 'exit']
  ]
}
```

Similarly to [asciicast event codes](../asciicast/v3.md#event-stream), the codes
are:

- `o` - output, i.e a write to a terminal
- `i` - input, typically a key press
- `m` - [marker](markers.md)

## Built-in parsers

A built-in parser can be used by setting the `parser` option to a string with
parser name:

```javascript
AsciinemaPlayer.create({ url: url, parser: 'parser-name' }, containerElement);
```

### asciicast

`asciicast` parser handles [asciicast v3](../asciicast/v3.md), [asciicast
v2](../asciicast/v2.md) and [asciicast v1](../asciicast/v1.md) file formats
produced by [asciinema recorder](../cli/index.md).

This parser is the default and does not have to be explicitly selected.

### typescript

`typescript` parser handles recordings in typescript format (not to be confused
with Typescript language) produced by venerable [script
command](https://www.man7.org/linux/man-pages/man1/script.1.html).

This parser supports both "classic" and "advanced" logging formats, including
input streams.

Usage:

```javascript
AsciinemaPlayer.create({
  url: ['/demo.timing', '/demo.data'],
  parser: 'typescript'
}, document.getElementById('demo'));
```

Note `url` above being an array of URLs pointing to typescript timing and data
files.

Usage for 3 file variant - timing file + output file + input file (created when
recording with `script --log-in <file>`):

```javascript
AsciinemaPlayer.create({
  url: ['/demo.timing', '/demo.output', '/demo.input'],
  parser: 'typescript'
}, document.getElementById('demo'));
```

If the recording was created in a terminal configured with character encoding
other than UTF-8 then `encoding` option should be included, specifying matching
encoding to be used for decoding bytes into text:

```javascript
AsciinemaPlayer.create({
  url: ['/demo.timing', '/demo.data'],
  parser: 'typescript',
  encoding: 'iso-8859-2'
}, document.getElementById('demo'));
```

See [TextDecoder's encodings
list](https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings)
for valid names.

### ttyrec

`ttyrec` parser handles recordings in [ttyrec
format](https://nethackwiki.com/wiki/Ttyrec) produced by
[ttyrec](http://0xcc.net/ttyrec/), [termrec](http://angband.pl/termrec.html) or
[ipbt](https://www.chiark.greenend.org.uk/~sgtatham/ipbt/) amongst others.

This parser understands `\e[8;Y;Xt` terminal size sequence injected into the
first frame by termrec.

Usage:

```javascript
AsciinemaPlayer.create({
  url: '/demo.ttyrec',
  parser: 'ttyrec'
}, document.getElementById('demo'));
```

If the recording was created in a terminal configured with character encoding
other than UTF-8 then `encoding` option should be included, specifying matching
encoding to be used for decoding bytes into text:

```javascript
AsciinemaPlayer.create({
  url: '/demo.ttyrec',
  parser: 'ttyrec',
  encoding: 'iso-8859-2'
}, document.getElementById('demo'));
```

See [TextDecoder's encodings
list](https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings)
for valid names.

## Custom parsers

Custom format parser can be used by setting the `parser` option to a _function_:

```javascript
AsciinemaPlayer.create({ url: url, parser: myParserFunction }, containerElement);
```

Custom parser function takes a [Response
object](https://developer.mozilla.org/en-US/docs/Web/API/Response) and returns
an object conforming to the [recording data model](#data-model-of-a-recording).

!!! note

    While the following example parsers return `events` _array_, it may be any
    iterable or iterator that is finite, which in practice means you can return
    an array or a finite generator, amongst others.

The following example illustrates implementation of a basic recording parser:

=== "app.js"

    ```javascript
    function parse(response) {
      return {
        cols: 80,
        rows: 6,
        events: [[1.0, 'o', 'hello'], [2.0, 'o', ' world!']]
      };
    };

    AsciinemaPlayer.create(
      { url: '/example.txt', parser: parse },
      document.getElementById('demo')
    );
    ```

=== "example.txt"

    ```txt
    foo
    bar
    baz
    qux
    ```

The above `parse` function returns a recording object, which makes the player
print "hello" (at time = 1.0 sec), followed by "world!" a second later.  The
parser is then passed to `create` together with a URL as source argument, which
makes the player fetch a file (`example.txt`) and pass it through the parser
function.

The result:

<div class="player" id="player-manual-player-parsers-1"></div>

This parser is not quite there though. It ignores the content of `example.txt`
file, always returning hardcoded output ("hello", followed by "world!"). Also,
`cols` and `rows` are made up as well - if possible they should be extracted
from the file and reflect the size of a terminal at the recording session time.
The example illustrates what kind of data the player expects though.

A more realistic example, where content of a file is actually used to construct
the output, could look like this:

=== "app.js"

    ```javascript
    async function parseLogs(response) {
      const text = await response.text();
      const pattern = /^\[([^\]]+)\] (.*)/;
      let baseTime;

      return {
        cols: 80,
        rows: 6,
        events: text.split('\n').map((line, i) => {
          const [_, timestamp, message] = pattern.exec(line);
          const time = (new Date(timestamp)).getTime() / 1000.0;
          baseTime = baseTime ?? time - 1;
          return [time - baseTime, 'o', message + '\r\n'];
        })
      };
    };

    AsciinemaPlayer.create(
      { url: '/example.log', parser: parseLogs },
      document.getElementById('demo')
    );
    ```

=== "example.log"

    ```txt
    [2023-11-13T12:00:00.000Z] "GET /index.html HTTP/1.1" 200
    [2023-11-13T12:00:01.000Z] "POST /login HTTP/1.1" 303
    [2023-11-13T12:00:01.250Z] "GET /images/logo.png HTTP/1.1" 200
    [2023-11-13T12:00:03.000Z] "GET /css/style.css HTTP/1.1" 304
    [2023-11-13T12:00:06.000Z] "GET /js/app.js HTTP/1.1" 200
    ```

`parseLogs` function parses a log file into a recording which prints one log
line every half a second.

The result:

<div class="player" id="player-manual-player-parsers-2"></div>

Here's slightly more advanced parser, for [Simon Jansen's Star Wars
Asciimation](https://www.asciimation.co.nz/):

```javascript
const LINES_PER_FRAME = 14;
const FRAME_DELAY = 67;
const COLUMNS = 67;
const ROWS = LINES_PER_FRAME - 1;

async function parseAsciimation(response) {
  const text = await response.text();
  const lines = text.split('\n');
  const events = [];
  let time = 0;
  let prevFrameDuration = 0;

  events.push([0, '\x9b?25l']); // hide cursor

  for (let i = 0; i + LINES_PER_FRAME - 1 < lines.length; i += LINES_PER_FRAME) {
    time += prevFrameDuration;
    prevFrameDuration = parseInt(lines[i], 10) * FRAME_DELAY;
    const frame = lines.slice(i + 1, i + LINES_PER_FRAME).join('\r\n');
    let text = '\x1b[H'; // move cursor home
    text += '\x1b[J'; // clear screen
    text += frame; // print current frame's lines
    events.push([time / 1000, 'o', text]);
  }

  return { cols: COLUMNS, rows: ROWS, events };
}

AsciinemaPlayer.create(
  { url: '/starwars.txt', parser: parseAsciimation },
  document.getElementById('demo')
);
```

It parses [Simon's Asciimation in its original
format](../../assets/starwars.txt) (please do not redistribute without giving
Simon credit for it), where each animation frame is defined by 14 lines. First
of every 14 lines defines duration a frame should be displayed for (multiplied
by a speed constant, by default `67` ms), while lines 2-14 define frame content
- text to display.

The result:

<div class="player" id="player-manual-player-parsers-3"></div>

All example parsers above parse text (`response.text()`) however any binary
format can be parsed easily by using [binary data
buffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
with [typed array
object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
like
[Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array):

```javascript
async function parseMyBinaryFormat(response) {
  const buffer = await response.arrayBuffer();
  const array = new Uint8Array(buffer);
  const events = [];
  const firstByte = array[0];
  const secondByte = array[1];
  // parse the bytes and populate the events array

  return { cols: 80, rows: 24, events };
}
```

See
[ttyrec.js](https://github.com/asciinema/asciinema-player/blob/develop/src/parser/ttyrec.js)
or
[typescript.js](https://github.com/asciinema/asciinema-player/blob/develop/src/parser/typescript.js)
for examples of binary parsers.
