---
hide:
  - toc
---

# Self-hosting

While [asciinema.org](https://asciinema.org) is the default [asciinema
server](../index.md) used by the CLI for uploading recordings, you can self-host
your own instance if you want full ownership and control over the recordings.

asciinema server is self-hosting friendly, and can be deployed both for public
or internal/private use in any containerized environment using the official OCI
image,
[ghcr.io/asciinema/asciinema-server](https://github.com/asciinema/asciinema-server/pkgs/container/asciinema-server).

Requirements:

- OCI runtime, e.g. [Docker](https://www.docker.com/),
  [Podman](https://podman.io/), [Kubernetes](https://kubernetes.io/)
- 512 MB of RAM minimum (for a personal instance), 1 GB recommended (for a
  community/company instance)
- [PostgreSQL](http://www.postgresql.org/download/) 14.0+ database server
- SMTP server, either a dedicated service or an SMTP endpoint of your email
  provider

To get started, follow the [quick start guide](quick-start.md), which provides a
template for a standard asciinema server configuration using
[docker-compose](https://docs.docker.com/compose/). This configuration includes
a PostgreSQL container and supports HTTPS, allowing you to set up a complete,
secure asciinema server easily.

Once your server is up and running, you'll be able to upload your recordings by
pointing [asciinema CLI](../../cli/index.md) to the server using the
`ASCIINEMA_SERVER_URL` environment variable:

=== "CLI 3.x"

    ```sh
    export ASCIINEMA_SERVER_URL=https://asciinema.example.com
    asciinema upload demo.cast
    ```

=== "CLI 2.x"

    ```sh
    export ASCIINEMA_API_URL=https://asciinema.example.com
    asciinema upload demo.cast
    ```


If you need help with installation or maintenance feel free to ask on [asciinema
forum](https://discourse.asciinema.org) or in [asciinema Matrix
room](https://matrix.to/#/#asciinema:matrix.org).

Last but not least, if your company is interested in having the installation,
maintenance or customization of the server performed by the people who created
asciinema, then check out [asciinema consulting
services](../../../consulting.md).
