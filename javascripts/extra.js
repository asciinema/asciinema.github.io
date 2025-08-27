document$.subscribe(function() {
  // manual -> cli

  createPlayer('../../../assets/casts/intro.cast', 'player-manual-cli-intro', { poster: 'npt:1:17' });

  // manual -> player

  createPlayer('../../../assets/casts/misc.cast', 'player-manual-player-intro', { poster: 'npt:20' });

  // manual -> player -> quickstart

  createPlayer('../../../assets/casts/intro.cast', 'player-manual-player-quickstart-1', {
    poster: 'npt:1:17',
    loop: true,
    controls: true,
    markers: [
      [15.5, 'Recording'],
      [87, 'Replaying'],
      [156, 'Uploading to asciinema.org'],
      [188.5, 'Closing words'],
    ]
  }, player => {
    document.getElementById('play-button').addEventListener('click', e => {
      e.preventDefault();
      player.play();
    });

    document.getElementById('pause-button').addEventListener('click', e => {
      e.preventDefault();
      player.pause();
    });

    document.getElementById('prev-marker-button').addEventListener('click', e => {
      e.preventDefault();
      player.seek({ marker: 'prev' });
    });

    document.getElementById('next-marker-button').addEventListener('click', e => {
      e.preventDefault();
      player.seek({ marker: 'next' });
    });
  });

  // manual -> player -> api

  createPlayer(
    { url: '../../../assets/casts/typing.cast', inputOffset: -0.125 },
    'player-manual-player-api-input',
    { rows: 15, poster: 'npt:8.4' },
    player => {
      const url = '../../../assets/Cherry_MX_Brown.wav';
      const context = new AudioContext();
      let clickbuffer;

      fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => context.decodeAudioData(data))
        .then(buf => { clickBuffer = buf });

      function playKeypressSound(e) {
        const source = context.createBufferSource();  // create a sound source
        source.buffer = clickBuffer;                  // tell the source which sound to play
        source.connect(context.destination);          // connect the source to the context's destination (the speakers)
        const gainNode = context.createGain();        // create a gain node
        source.connect(gainNode);                     // connect the source to the gain node
        gainNode.connect(context.destination);        // connect the gain node to the destination
        gainNode.gain.value = 1;                      // set the volume
        source.start(0);
      }

      player.addEventListener('input', playKeypressSound);
    }
  );

  // manual -> player -> markers

  createPlayer('../../../assets/casts/intro.cast', 'player-manual-player-markers-intro', {
    poster: 'npt:51.5',
    controls: true,
    markers: [
      [15.5, 'Recording'],
      [87, 'Replaying'],
      [156, 'Uploading to asciinema.org'],
      [188.5, 'Closing words'],
    ]
  });

  createPlayer('../../../assets/casts/breakpoints.cast', 'player-manual-player-markers-breakpoints', {
    poster: 'npt:15',
    controls: true,
    markers: [4, 8, 13],
    pauseOnMarkers: true
  });

  createPlayer('../../../assets/casts/intro.cast', 'player-manual-player-markers-seeking', {
    preload: true,
    poster: 'npt:130',
    autoPlay: false,
    startAt: 130,
    controls: true,
    markers: [133, 142]
  }, player => {
    player.addEventListener('marker', ({ index, time, label }) => {
      if (index == 1) {
        player.seek({ marker: 0 });
      }
    })
  });

  // manual -> player -> shortcuts

  createPlayer('../../../assets/casts/intro.cast', 'player-manual-player-shortcuts-1', {
    poster: 'npt:1:17'
  });

  // manual -> player -> parsers

  const exampleTxt = "foo\nbar\nbaz\nqux";
  const exampleTxtDataUrl = `data:text/plain;base64,${btoa(exampleTxt)}`;

  function parseHelloWorld(_response) {
    return {
      cols: 80,
      rows: 6,
      output: [[1.0, "hello"], [2.0, " world!"]]
    };
  }


  const exampleLog = `[2023-11-13T12:00:00.000Z] "GET /index.html HTTP/1.1" 200\n[2023-11-13T12:00:01.000Z] "POST /login HTTP/1.1" 303\n[2023-11-13T12:00:01.250Z] "GET /images/logo.png HTTP/1.1" 200\n[2023-11-13T12:00:03.000Z] "GET /css/style.css HTTP/1.1" 304\n[2023-11-13T12:00:06.000Z] "GET /js/app.js HTTP/1.1" 200`;
  const exampleLogDataUrl = `data:text/plain;base64,${btoa(exampleLog)}`;

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
  }

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

    events.push([0, 'o', '\x9b?25l']); // hide cursor

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

  createPlayer({ url: exampleTxtDataUrl, parser: parseHelloWorld }, 'player-manual-player-parsers-1', {
    cols: 80,
    rows: 6
  });

  createPlayer({ url: exampleLogDataUrl, parser: parseLogs }, 'player-manual-player-parsers-2', {
    cols: 80,
    rows: 6
  });

  createPlayer({ url: '../../../assets/starwars.txt', parser: parseAsciimation }, 'player-manual-player-parsers-3', {
    cols: 67,
    rows: 13
  });
});

function createPlayer(src, containerId, opts, setup) {
  const container = document.getElementById(containerId);

  if (container !== null) {
    document.fonts.load("1em Fira Mono").then(() => {
      const player = AsciinemaPlayer.create(src, container, {
        theme: 'dracula',
        terminalFontFamily: "'Fira Mono', monospace",
        ...opts
      });

      if (typeof setup === 'function') {
        setup(player);
      }
    });
  }
}
