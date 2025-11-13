# Live streaming

asciinema server provides real-time terminal session broadcasting with minimal
latency, enabling live streaming of terminal sessions to multiple viewers.

The streaming system supports several application-level protocols with protocol
negotiation. For simpler clients/use-cases it provides basic protocol
auto-detection. Streaming is subject to configurable limits including per-user
stream count restrictions and bandwidth rate limiting.

Live terminal streaming is supported by asciinema CLI since version 3.0.

## Architecture

The live streaming architecture follows a producer-consumer model with three
key parties:

```
                   ┌──────────────┐
                   │   producer   │
                   │    (CLI)     │
                   └──────────────┘
                          │
                         WS
                          │
                          ▼
                   ┌──────────────┐
                   │    relay     │
                   │   (server)   │
                   └──────────────┘
                    ▲      ▲      ▲
                   /       │       \ 
                  WS      WS       WS
                 /         │         \
                /          │          \
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   consumer   │   │   consumer   │   │   consumer   │
│  (player 1)  │   │  (player 2)  │   │  (player 3)  │
└──────────────┘   └──────────────┘   └──────────────┘
```

The producer, typically asciinema CLI, captures terminal events and streams
them to the producer endpoint (`/ws/S/<producer-token>`) on the server.

The server acts as a relay, receiving events from producers and distributing
them to consumers while maintaining the complete stream state.

Consumers, such as asciinema player, connect to the consumer endpoint
(`/ws/s/<public-token>`) on the server to receive real-time terminal events and
display the live session.

Both producer and consumer connections utilize WebSocket transport,
implementing application-level protocols (WebSocket sub-protocols) for event
transmission.

The server maintains comprehensive state for each active stream by running the
whole stream through [asciinema's own virtual terminal
emulator](https://github.com/asciinema/avt). This enables new consumers to
connect mid-stream and immediately receive the current terminal view, ensuring
a seamless viewing experience regardless of when viewers join the session.

## Live stream lifecycle

Before the producer can start sending stream events to the producer WebSocket
endpoint, streams must be created and configured through the [HTTP
API](api.md). This two-phase approach separates stream management from
real-time data transmission.

The flow is as follows:

1. [create](api.md/#create_1) or [update](api.md/#update_1) a stream with the
   HTTP API, setting `{ "live": true }`
2. extract `ws_producer_url` from the JSON response
3. open WebSocket connection to `ws_producer_url`
4. start sending terminal session events as WebSocket messages, encoded for the
   selected sub-protocol (see [Protocols](#protocols) section below)

__Marking a stream "live" is required for the producer endpoint to accept a
WebSocket connection.__

The creation/update of a live stream (`{ "live": true }`) in the API may
fail if given user's live stream limit has already been reached. See
[Limits](#limits) below.

When the WebSocket connection is closed gracefully, the server automatically
marks the stream "dead" (`{ "live": false }`).

When the connection is closed abruptly (e.g. a network issue), the server keeps
the stream "live" for 60 sec, giving the producer grace time to reconnect
before marking the stream "dead".

After stream ends, if [stream recording](#recording) is enabled, a new
recording is automatically created.

??? example "Example: creating a new stream and sending events"

    === "Python"

        ```python
        import requests
        import websocket
        import base64
        import json

        # Step 1: Create/update stream with HTTP API
        token = "your-cli-token"
        auth = base64.b64encode(f":{token}".encode()).decode()
        
        response = requests.post(
            "https://asciinema.org/api/v1/streams",
            headers={"Authorization": f"Basic {auth}"},
            json={"live": True, "title": "It's alive!"}
        )
        
        # Step 2: Extract ws_producer_url
        stream_data = response.json()
        ws_url = stream_data["ws_producer_url"]
        
        # Step 3: Open WebSocket connection
        ws = websocket.WebSocket()
        ws.connect(ws_url, subprotocols=["v3.asciicast"])
        
        # Step 4: Send terminal events (asciicast v3 format)
        # Header message
        header = {"version": 3, "term": {"cols": 80, "rows": 24}}
        ws.send(json.dumps(header))
        
        # Output event (1.0 second interval, output type, data)
        output_event = [1.0, "o", "Hello, World!\n"]
        ws.send(json.dumps(output_event))
        ```

    === "JavaScript"

        ```javascript
        import WebSocket from 'ws';

        // Step 1: Create/update stream with HTTP API
        const token = 'your-cli-token';
        const auth = Buffer.from(`:${token}`).toString('base64');
        
        const response = await fetch('https://asciinema.org/api/v1/streams', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ live: true, title: "It's alive!" })
        });
        
        // Step 2: Extract ws_producer_url
        const streamData = await response.json();
        const wsUrl = streamData.ws_producer_url;
        
        // Step 3: Open WebSocket connection
        const ws = new WebSocket(wsUrl, ['v3.asciicast']);
        
        // Step 4: Send terminal events (asciicast v3 format)
        ws.on('open', () => {
            // Header message
            const header = {"version": 3, "term": {"cols": 80, "rows": 24}};
            ws.send(JSON.stringify(header));
            
            // Output event (1.0 second interval, output type, data)
            const outputEvent = [1.0, "o", "Hello, World!\n"];
            ws.send(JSON.stringify(outputEvent));
        });
        ```

## Protocols

There are several WebSocket-based protocols for different client capabilities and use cases:

| Protocol | Transport | Sec-WebSocket-Protocol name | Summary |
|----------|-----------|----------|-----------|
| **ALiS v1** | binary WebSocket | `v1.alis` | Full-featured, lean, precise timing |
| **asciicast v2** | text WebSocket | `v2.asciicast` | Full-featured, heavy, precise timing, easy to implement |
| **asciicast v3** | text WebSocket | `v3.asciicast` | Full-featured, heavy, precise timing, easy to implement |
| **raw** | binary WebSocket | `raw` | Output-only, the leanest, no resize and other events, no accurate timing, easy to implement |

!!! note

    We call them "protocols" because they're negotiated using standard
    `Sec-WebSocket-Protocol` header, but in practice they're just serialization
    formats as they're uni-directional.

The producer endpoint supports all of the above. The consumer endpoint supports
`ALiS v1` only  given its primary client is asciinema player, which has full
support for this protocol.

Upon connection a protocol is negotiated using [Sec-WebSocket-Protocol
header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-WebSocket-Protocol).

If no `Sec-WebSocket-Protocol` header is provided by the client, the producer
endpoint tries to detect the protocol from the first received message, falling
back to `raw` if its heuristics fail.

!!! info

    Consumers always receive ALiS v1 encoded stream regardless of the protocol
    the producer uses. The server handles protocol translation transparently.

### ALiS v1

ALiS (Asciinema Live Stream) is the primary binary protocol supporting all
session event types, while being lightweight on the wire. It's supported by
asciinema CLI, server and player.

Conceptually it's based on asciicast v3, but it's leaner and optimized for low
latency live streaming.

#### Data encoding

ALiS uses [LEB128](https://en.wikipedia.org/wiki/LEB128) (Little Endian Base
128) encoding for all integers to minimize bandwidth. Currently only unsigned
integers are in use by the protocol, so in practice it uses Unsigned LEB128
only.

All text data uses UTF-8 encoding with length prefix:

```
String := [Length: LEB128][Data: UTF-8 bytes]
```

#### Stream structure

The very first binary message sent right after opening a connection must be the
5 byte magic string:

`[0x41, 0x4C, 0x69, 0x53, 0x01]` - `"ALiS\x01"` in ASCII.

The messages following it represent an event stream. Each binary WebSocket
message encodes a separate event:

```
Event  := [EventType: uint8][EventData]
```

Where:

- **EventType:** one of event types listed below
- **EventData:** event type specific payload

#### Event types

**Init (0x01)** - Initialize or reset stream state

```
[0x01][LastId: LEB128][Time: LEB128][Cols: LEB128][Rows: LEB128][Theme][InitData: String]
```

Where:

- **LastId:** event sequence number for synchronization
- **RelTime:** microseconds since the stream start (typically 0, may be positive when joining a stream as a consumer later)
- **Cols/Rows:** terminal size
- **Theme:** color theme (see Theme below)
- **InitData:** optional pre-existing terminal content, to bring the consumer up to speed with terminal state

This event type is conceptually similar to the header in asciicast file format.

??? example "Example: Init with 80x24 terminal, no theme, "Hello!" initial data"

    ```
    \x01   \x00   \x00   \x50   \x18   \x00   \x06  Hello!
    ^init  ^id    ^time  ^80    ^24    ^theme ^len  ^data
    ```

**Output (0x6F)** - Terminal output

```
[0x6F][Id: LEB128][RelTime: LEB128][Data: String]
```

Where:

- **Id:** event sequence number
- **RelTime:** microseconds since last event
- **Data:** terminal output text

??? example "Example: Output "ls -la\n" after 125ms"

    ```
    \x6F   \x01   \xC8\xD0\x07   \x07   ls -la\n
    ^out   ^id1   ^125000μs      ^len   ^data
    ```

**Input (0x69)** - User (keyboard) input

```
[0x69][Id: LEB128][RelTime: LEB128][Data: String]
```

Where:

- **Id:** event sequence number  
- **RelTime:** microseconds since last event
- **Data:** user input text

??? example "Example: Input "cd /tmp" after 50ms"

    ```
    \x69   \x02   \xD0\x86\x03   \x07  cd /tmp
    ^inp   ^id2   ^50000μs       ^len  ^data
    ```

**Resize (0x72)** - Terminal window resize

```
[0x72][Id: LEB128][RelTime: LEB128][Cols: LEB128][Rows: LEB128]
```

Where:

- **Id:** event sequence number
- **RelTime:** microseconds since last event
- **Cols/Rows:** new terminal size

??? example "Example: Resize to 100x30 after 10ms"

    ```
    \x72   \x03   \x90\x4E   \x64   \x1E
    ^res   ^id3   ^10000μs   ^100   ^30
    ```

**Marker (0x6D)** - Session annotations / bookmarking

```
[0x6D][Id: LEB128][RelTime: LEB128][Label: String]
```

Where:

- **Id:** event sequence number
- **RelTime:** microseconds since last event
- **Label:** human-readable marker description

??? example "Example: Marker with no label after 1s"

    ```
    \x6D   \x04   \xC0\x84\x3D   \x00
    ^mrk   ^id4   ^1000000μs     ^len
    ```

**Exit (0x78)** - Process termination

```
[0x78][Id: LEB128][RelTime: LEB128][Status: LEB128]
```

Where:

- **Id:** event sequence number
- **RelTime:** microseconds since last event  
- **Status:** exit status code (non-negative)

This event is typically sent as the last stream event, once the process that's
being streamed (e.g. shell) exits.

??? example "Example: Exit with status 0 after 500ms"

    ```
    \x78   \x05   \xA0\xC2\x1E   \x00
    ^exit  ^id5   ^500000μs      ^status
    ```

**EOT (0x04)** - End of Transmission

```
[0x04][RelTime: LEB128]
```

Where:

- **RelTime:** microseconds since last event

This event may be used to signal the stream end without closing the connection.
Once EOT is received, the connection state goes back to post-magic-string
pre-init state, expecting Init event to restart the stream from scratch.

It's sent from the consumer endpoint whenever a producer ends the stream. This
allows asciinema player (consumer) to keep the connection open and be ready for
instant stream restart. This approach eliminates the need for an additional
channel between the server and the consumer for checking stream liveness (such
as another WebSocket or polling).

??? example "Example: EOT after 1s"

    ```
    \x04   \xC0\x84\x3D
    ^eot   ^1000000μs
    ```

#### Theme

Terminal theme is encoded as follows:

```
Theme := [Format: uint8][ColorData?]
```

Where **Format** determines the presence and structure of **ColorData**:

- **`0x00`** (no theme): no ColorData follows, only the format byte
- **`0x08`** (8-color palette): ColorData with 8-color palette
- **`0x10`** (16-color palette): ColorData with 16-color palette

When ColorData is present (format `0x08` or `0x10`):

```
ColorData := [Fg: RGB][Bg: RGB][Palette: N×RGB]
RGB := [R: uint8][G: uint8][B: uint8]
```

Where **N** is 8 or 16 depending on format identifier.

??? example "Theme examples"

    **No theme (format 0x00):**

    ```
    \x00
    ^no theme
    ```
    
    **8-color palette (format 0x08):**

    ```
    \x08   \xD0\xD0\xD0   \x1C\x1C\x1C   \x00\x00\x00\xFF\x00\x00 ... (6 more colors)
    ^8col  ^fg(gray)      ^bg(dark)      ^palette                 ...
    ```
    
    **16-color palette (format 0x10):**

    ```
    \x10   \xD0\xD0\xD0   \x1C\x1C\x1C   \x00\x00\x00\xFF\x00\x00 ... (14 more colors)
    ^16col ^fg(gray)      ^bg(dark)      ^palette                  ...
    ```

### asciicast v2

This is just [asciicast v2 file format](../asciicast/v2.md) sent via
WebSocket, where each line is delivered as a separate text message.

It's simple, so creating a client is rather easy. However, it's much more
bandwidth heavy than ALiS, and it doesn't provide a mechanism to sync the
server with the client's recent state upon re-connections (like ALiS does).

??? example "Example: asciicast v2 streaming with asciinema 2.x and websocat"

    This is an example of streaming with asciinema CLI 2.x, which doesn't natively
    support streaming. Thankfully, it writes recordings in asciicast v2 format!

    The example also uses `curl`, `jq` and `websocat`.

    ```sh
    # obtain install ID
    INSTALL_ID=$(cat ~/.config/asciinema/install-id)

    # create stream and capture JSON response
    response=$(curl -s -X POST \
      -u ":${INSTALL_ID}" \
      -H "Content-Type: application/json" \
      -d '{"live": true}' \
      https://asciinema.org/api/v1/streams)

    # extract WebSocket producer URL
    url=$(echo "$response" | jq -r '.ws_producer_url')

    # create named pipe, for connecting the CLI with websocat
    mkfifo live.fifo

    # run websocat to stream from the pipe to the producer URL
    websocat --text $url < live.fifo

    # in another terminal start asciinema recording session
    asciinema rec live.fifo
    ```

### asciicast v3

This is just [asciicast v3 file format](../asciicast/v3.md) sent via
WebSocket, where each line is delivered as a separate text message.

Same pros/cons as mentioned for v2 apply here.

??? example "Example: asciicast v3 streaming with asciinema 3.x and websocat"

    This is an example of alternative way of streaming with asciinema CLI 3.x.
    CLI 3.0+ supports streaming natively using ALiS protocol (`asciinema stream` /
    `asciinema session`), which should be always preferred.

    Here is just an example of feeding asciicast v3 stream into the producer
    endpoint. The example also uses `curl`, `jq` and `websocat`.

    ```sh
    # obtain install ID
    INSTALL_ID=$(cat ~/.config/asciinema/install-id)

    # create stream and capture JSON response
    response=$(curl -s -X POST \
      -u ":${INSTALL_ID}" \
      -H "Content-Type: application/json" \
      -d '{"live": true}' \
      https://asciinema.org/api/v1/streams)

    # extract WebSocket producer URL
    url=$(echo "$response" | jq -r '.ws_producer_url')

    # create named pipe, for connecting the CLI with websocat
    mkfifo live.fifo

    # run websocat to stream from the pipe to the producer URL
    websocat --text $url < live.fifo

    # in another terminal start asciinema recording session
    asciinema rec -f asciicast-v3 live.fifo
    ```

### raw

This protocol is just raw binary messages representing direct terminal output,
without any additional encoding/metadata.

The whole binary stream is treated as session output to be fed into a terminal.
That includes both printable characters and control sequences.

There's no support for input, resize, marker and other event types. Terminal
theme reproduction is also not possible when using this protocol.

Given the messages don't include timing information, server-side time of
arrival is used for timing each output event. That means, the original
fine-grained timing of the session is lost, and playback smoothness is highly
susceptible to network conditions.

The terminal size is assumed to be 80x24. However, the __first__ received
message is inspected for size hints.

If the escape sequence `\e[8;Y;Xt` is found then `Y` is assumed to be terminal
height in rows, and `X` is assumed to be terminal width in columns. This
sequence is injected by [termrec](https://angband.pl/termrec.html) for example.

Another size hint that the server looks for is
[script](https://www.man7.org/linux/man-pages/man1/script.1.html) start
message, which typically includes `COLUMNS=".." LINES=".."`.

??? example "Example: raw streaming with script and websocat"

    This is an example of streaming with
    [script](https://www.man7.org/linux/man-pages/man1/script.1.html). `script`
    writes the captured terminal output as raw, binary data. The example also uses
    `curl`, `jq` and `websocat`.

    ```sh
    # obtain install ID
    INSTALL_ID=$(cat ~/.config/asciinema/install-id)

    # create stream and capture JSON response
    response=$(curl -s -X POST \
      -u ":${INSTALL_ID}" \
      -H "Content-Type: application/json" \
      -d '{"live": true}' \
      https://asciinema.org/api/v1/streams)

    # extract WebSocket producer URL
    url=$(echo "$response" | jq -r '.ws_producer_url')

    # create named pipe, for connecting the CLI with websocat
    mkfifo live.fifo

    # run websocat to stream from the pipe to the producer URL
    websocat --binary $url < live.fifo

    # in another terminal start recording with script
    script -f -O live.fifo
    ```


## Recording

asciinema server can automatically record every live stream, converting them
into regular recordings that can be replayed later. This allows streams to
serve dual purposes: real-time broadcasting and permanent archival.

Recording behavior is controlled by the `STREAM_RECORDING` environment
variable.

When recording is enabled, the complete terminal session is captured and stored
as a regular recording.

Recent recordings made from a stream are listed on a given stream page. All
stream recordings are accessible from user profile page (visibility subject to
related settings in user account).

For detailed configuration options, see the
[Configuration](self-hosting/configuration.md#stream-recording) documentation.

??? info "Stream recording on asciinema.org"

    Currently, stream recording is disabled on asciinema.org.

## Limits

The streaming system enforces two types of limits to manage server resources and prevent abuse:

### Per-user live stream count

By default, users can create unlimited number of streams. This can be
restricted system-wide through use `DEFAULT_STREAM_LIMIT` config option (see
the [Configuration](self-hosting/configuration.md#stream-limit) documentation),
and individually per-user in the admin panel.

??? info "Live streams limit on asciinema.org"

    Currently, per-user live stream limit on asciinema.org is __1__.

### Bandwidth limiting

Each producer connection is subject to bandwidth rate limiting using [token
bucket algorithm](https://en.wikipedia.org/wiki/Token_bucket) to prevent
individual connections from overwhelming the server while maintaining fair
resource allocation across all active streams.

The algorithm is configured such that:

- 1 token == 1 byte of each received WebSocket message
- bucket size (capacity per connection) is 60 000 000 (60 MB) - this is maximum and initial value
- every 100 milliseconds the bucket is refilled with 10 000 tokens

This gives headroom for short bursts, and allows sustained bandwidth of 100 KB/s.

When the token bucket is exhausted, the connection is closed with error code
4004 ("Bandwidth Exceeded").
