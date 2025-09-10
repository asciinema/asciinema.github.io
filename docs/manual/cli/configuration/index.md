# Configuration

You can configure asciinema CLI with a config file.

The most common use-case is setting the URL of a [self-hosted asciinema
server](../../server/self-hosting/index.md):

=== "CLI 3.0+"

    ```toml title="~/.config/asciinema/config.toml"
    [server]
    url = "https://asciinema.example.com"
    ```

=== "CLI 2.0+"

    ```ini title="~/.config/asciinema/config"
    [api]
    url = https://asciinema.example.com
    ```

Alternatively you can set it with environment variable in your shell config
file:

=== "CLI 3.0+"

    ```sh title="~/.bashrc"
    export ASCIINEMA_SERVER_URL=https://asciinema.example.com
    ```

=== "CLI 2.0+"

    ```sh title="~/.bashrc"
    export ASCIINEMA_API_URL=https://asciinema.example.com
    ```

There's more things you can configure. For the full list of options check out
the documentation for asciinema CLI version you use:

- [CLI 3.0+ configuration](v3.md)
- [CLI 2.0+ configuration](v2.md)

!!! tip

    During recording sessions, asciinema sets the `ASCIINEMA_SESSION` environment
    variable to a unique session ID. This can be used to detect active recording
    sessions in your shell config file (`.bashrc`, `.zshrc`) in order to e.g. alter
    the prompt, play a sound, or change the background color of a terminal emulator
    window.

    For example:

    ```sh title=".bashrc"
    if [ -n "$ASCIINEMA_SESSION" ]; then
      play "ding.wav"
    fi
    ```
