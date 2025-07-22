# Customization

In cases where the regular [configuration](configuration.md) is not enough, you
can build a custom asciinema server image. The server is built with [Elixir
language](https://elixir-lang.org/) and [Phoenix
framework](https://www.phoenixframework.org/). While not mainstream, this stack
is easy to work with.

Let's take log level as an example. We'll change it from the default `:info` to
more quiet `:warning`.

## Clone the repository

```sh
git clone https://github.com/asciinema/asciinema-server.git
```

## Create a new branch

```sh
git checkout main
git switch -c custom
```

## Make the changes

Edit `config/prod.exs` file, applying this change:

```diff
- config :logger, level: :info
+ config :logger, level: :warning
```

Then, commit the changes.

## Rebuild the image

```sh
docker build -t ghcr.io/asciinema/asciinema-server:custom .
```

## Update the image tag

Update the `asciinema` container image tag to `custom`:

```diff title="docker-compose.yml"
services:
  asciinema:
-   image: ghcr.io/asciinema/asciinema-server:20250722
+   image: ghcr.io/asciinema/asciinema-server:custom
```

## Launch the new version

Finally, recreate the stack by running:

```sh
docker compose up -d
```
