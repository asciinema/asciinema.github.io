# Configuration

You can configure asciinema CLI with a config file.

The most common use-case is setting the URL of a [self-hosted asciinema
server](../../server/self-hosting/index.md):

=== "CLI 3.x"

    ```toml title="~/.config/asciinema/config.toml"
    [server]
    url = "https://asciinema.example.com"
    ```

=== "CLI 2.x"

    ```ini title="~/.config/asciinema/config"
    [api]
    url = https://asciinema.example.com
    ```

Alternatively you can set it with environment variable in your shell config
file:

=== "CLI 3.x"

    ```sh title="~/.bashrc"
    export ASCIINEMA_SERVER_URL=https://asciinema.example.com
    ```

=== "CLI 2.x"

    ```sh title="~/.bashrc"
    export ASCIINEMA_API_URL=https://asciinema.example.com
    ```

There's more things you can configure. For the full list of options check out
the documentation for asciinema CLI version you use:

- [CLI 2.x configuration](v2.md)
- [CLI 3.x configuration](v3.md)
