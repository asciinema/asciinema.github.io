---
hide:
  - toc
---

# Quick start

This guide shows how to setup your own instance of asciinema server for hosting
terminal session recordings.

For a broader overview of what's possible with asciinema check out the [intro
guide](../../../getting-started.md).

To keep this guide simple we'll use the official asciinema server container
image,
[ghcr.io/asciinema/asciinema-server](https://github.com/asciinema/asciinema-server/pkgs/container/asciinema-server),
in a [docker-compose](https://docs.docker.com/compose/) based setup. If you
prefer to use a different deployment solution it should be straightforward to
adapt the configuration presented below to specifics of your environment.

Here's a basic docker-compose configuration for asciinema server you can use as
a template.

=== "HTTPS"

    ```yaml title="docker-compose.yml"
    services:
      asciinema:
        image: ghcr.io/asciinema/asciinema-server:20240428
        environment:
          - SECRET_KEY_BASE=  # <- see below
          - URL_HOST=asciinema.example.com
          - URL_SCHEME=https
          - SMTP_HOST=smtp.example.com
          - SMTP_USERNAME=foobar
          - SMTP_PASSWORD=hunter2
        volumes:
          - asciinema_data:/var/opt/asciinema
        depends_on:
          postgres:
            condition: service_healthy
        restart: unless-stopped

      postgres:
        image: docker.io/library/postgres:14
        environment:
          - POSTGRES_HOST_AUTH_METHOD=trust
        volumes:
          - postgres_data:/var/lib/postgresql/data
        healthcheck:
          test: ['CMD-SHELL', 'pg_isready -U postgres']
          interval: 2s
          timeout: 5s
          retries: 10
        restart: unless-stopped

      caddy:
        image: caddy:2
        command: caddy reverse-proxy --from https://asciinema.example.com --to http://asciinema:4000
        ports:
          - '80:80'
          - '443:443'
          - '443:443/udp'
        volumes:
          - caddy_data:/data
          - caddy_config:/config
        restart: unless-stopped

    volumes:
      asciinema_data:
      postgres_data:
      caddy_data:
      caddy_config:
    ```

=== "HTTP"

    ```yaml title="docker-compose.yml"
    services:
      asciinema:
        image: ghcr.io/asciinema/asciinema-server:20240428
        ports:
          - '80:4000'
        environment:
          - SECRET_KEY_BASE=  # <- see below
          - URL_HOST=asciinema.example.com
          - URL_PORT=80
          - SMTP_HOST=smtp.example.com
          - SMTP_USERNAME=foobar
          - SMTP_PASSWORD=hunter2
        volumes:
          - asciinema_data:/var/opt/asciinema
        depends_on:
          postgres:
            condition: service_healthy
        restart: unless-stopped

      postgres:
        image: docker.io/library/postgres:14
        environment:
          - POSTGRES_HOST_AUTH_METHOD=trust
        volumes:
          - postgres_data:/var/lib/postgresql/data
        healthcheck:
          test: ['CMD-SHELL', 'pg_isready -U postgres']
          interval: 2s
          timeout: 5s
          retries: 10
        restart: unless-stopped

    volumes:
      asciinema_data:
      postgres_data:
    ```

Let's break it down.

The `asciinema` container uses a server image version tagged `20240428`. This is
merely an example; please check the
[releases](https://github.com/asciinema/asciinema-server/releases) page for the
latest stable version number and use that instead.

The `SECRET_KEY_BASE` environment variable is used for encryption/signing of
user sessions (amongst other things). You can generate one with the following
command:

```sh
tr -dc A-Za-z0-9 </dev/urandom | head -c 64; echo
```

The `URL_SCHEME`, `URL_HOST` and `URL_PORT` variables configure the root URL
used for link generation. The `URL_HOST` should match the DNS name by which the
server is accessible.

Check [general configuration](configuration.md#general) for more information on
`SECRET_KEY_BASE` and `URL_*` variables.

The `SMTP_*` variables configure SMTP server used for sending short-lived login
links. If you don't set those no mail will be sent. However, you can still
obtain a login link from the server logs after entering your email address on
the login page. Check [email configuration](configuration.md#email) for more
details, including configuration examples for popular SMTP providers.

The server stores the uploaded recordings and other data at
`/var/opt/asciinema`. We used volume mapping for this directory, but you can
also bind-mount it to a directory on the host system, e.g.
`/path/to/asciinema/data:/var/opt/asciinema`, or use S3-compatible object store
instead. Check [file store configuration](configuration.md#file-store) for
details.

The server utilizes PostgreSQL as its database; therefore we have included a
dedicated `postgres` service, mapping its data directory,
`/var/lib/postgresql/data`, to a volume. For convenience, asciinema server
container image sets `DATABASE_URL` to
`postgresql://postgres@postgres/postgres`, enabling it to connect to the
`postgres` container automatically. Check the [database
configuration](configuration.md#database) for more information on
`DATABASE_URL`, including the use of a separate/external PostgreSQL server.

Finally, the `caddy` service runs [Caddy web server](https://caddyserver.com/)
in reverse proxy mode, with automatic HTTPS enabled for the domain specified
with the `--from` argument (which should be the same as the `URL_HOST` on
`asciinema` service). See [HTTPS configuration](configuration.md#https) for
additional information.

Assuming you have set `SECRET_KEY_BASE` and `URL_*` variables, and opened ports
80 and 443 in the host system's firewall, you can now launch the stack with:

```sh
docker compose up
```

You will see PostgreSQL perform its initial setup, asciinema server create its
database tables, and Caddy attempt to obtain a TLS certificate for your domain.
Visit the configured URL in your web browser to verify it's up and running.

Congratulations! You have your own asciinema server instance 🎉

Now, point asciinema CLI to your server by setting `ASCIINEMA_API_URL`, and
upload a recording:

```sh
export ASCIINEMA_API_URL=https://asciinema.example.com
asciinema upload demo.cast
```

Check the [CLI configuration](../../cli/configuration.md) section for
information on how to set the server URL permanently via the configuration file.
