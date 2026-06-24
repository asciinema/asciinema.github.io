# NixOS

The asciinema server flake ships a NixOS module that runs the server as a systemd
service and can provision a local PostgreSQL database for you.

The server's [configuration](configuration.md) variables are set through the
module's options.

## Setup

A complete single-host setup, with automatic HTTPS via
[Caddy](https://caddyserver.com/), looks like this.

Add the asciinema server flake as an input and import its NixOS module:

```nix title="flake.nix"
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    asciinema-server.url = "github:asciinema/asciinema-server/main";
  };

  outputs = { nixpkgs, asciinema-server, ... }: {
    nixosConfigurations.asciinema = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        asciinema-server.nixosModules.default
        ./configuration.nix
      ];
    };
  };
}
```

Then configure the service in your host configuration:

```nix title="configuration.nix"
{ ... }:

{
  services.asciinema = {
    enable = true;

    # Non-secret configuration; see Configuration for the available variables.
    environment = {
      URL_HOST = "asciinema.example.com";
      URL_SCHEME = "https";
      SMTP_HOST = "smtp.example.com";
      SMTP_USERNAME = "noreply@example.com";
    };

    # Secrets, kept out of the Nix store. SECRET_KEY_BASE is generated and
    # persisted automatically, so this only needs SMTP_PASSWORD here.
    environmentFile = "/run/secrets/asciinema.env";
  };

  # Reverse proxy with automatic HTTPS.
  services.caddy = {
    enable = true;

    virtualHosts."asciinema.example.com".extraConfig = ''
      reverse_proxy localhost:4000
    '';
  };

  networking.firewall.allowedTCPPorts = [ 80 443 ];
}
```

The referenced secrets file holds the sensitive variables as `KEY=value` lines:

```sh title="/run/secrets/asciinema.env"
SMTP_PASSWORD=hunter2
```

Apply it with `nixos-rebuild switch`. The module creates a local PostgreSQL
database, generates a `SECRET_KEY_BASE`, runs database migrations and starts the
server; Caddy obtains a TLS certificate for your domain on first request. Visit
the configured URL to verify it's up and running.

!!! note

    The example tracks the `main` branch, which always points at the latest
    released version. For reproducible deployments pin a specific release
    instead, e.g.
    `asciinema-server.url = "github:asciinema/asciinema-server/<tag>";`. See the
    [releases](https://github.com/asciinema/asciinema-server/releases) page for
    available tags. Don't use the bare `github:asciinema/asciinema-server` URL:
    it resolves to the default (`develop`) branch, which isn't always
    release-ready.

## Configuration

Set non-secret variables under `environment` and secrets in `environmentFile`.
Together they cover everything in [Configuration](configuration.md) (`URL_*`,
`SMTP_*`, `S3_*`, uploads, streaming, and so on).

`environment` values may be strings, integers or booleans:

```nix
services.asciinema.environment = {
  PORT = 4000; # integers are accepted
  SIGN_UP_DISABLED = true; # and booleans
};
```

## Secrets

The server needs a few sensitive values. Put them in the file referenced by
`environmentFile` so they stay out of the world-readable Nix store:

- `SECRET_KEY_BASE` - generated and persisted automatically in the
  [data directory](#data-directory) on first start, so you don't need to set it.
  Provide your own only if you want to manage it explicitly, e.g. to share it
  across hosts.
- `SMTP_PASSWORD` - if you configured an SMTP server for
  [login emails](configuration.md#email).
- `DATABASE_URL` - only when using an [external database](#database).
- `S3_*` keys - if you use an
  [S3-compatible object store](configuration.md#aws-s3) for the file store.

`environmentFile` is a plain `KEY=value` file passed to systemd's
`EnvironmentFile=`. It's typically managed with
[sops-nix](https://github.com/Mic92/sops-nix) or
[agenix](https://github.com/ryantm/agenix), which decrypt secrets to a path like
`/run/secrets/...` at activation time; a hand-managed root-owned `0400` file
works too.

## Database

By default the module provisions a local PostgreSQL server
(`database.createLocally = true`), creating the role and database and connecting
to it over a Unix socket, so no `DATABASE_URL` is needed. If PostgreSQL is
already enabled on the host, asciinema server's database is simply added to it.

To use an [external or existing database](configuration.md#external-postgresql-server)
instead, turn the local one off and provide `DATABASE_URL` via `environmentFile`:

```nix
services.asciinema.database.createLocally = false;
```

```sh title="/run/secrets/asciinema.env"
DATABASE_URL=ecto://user:pass@db.example.com/asciinema
```

## Data directory

The server keeps its local state in `dataDir`, which defaults to
`/var/lib/asciinema`: uploaded recordings (under `uploads/`), the generated
`SECRET_KEY_BASE`, and the Erlang release cookie.

Change the location with:

```nix
services.asciinema.dataDir = "/srv/asciinema";
```

You can store recordings in an
[S3-compatible object store](configuration.md#file-store) instead by setting the
`S3_*` variables; the generated `SECRET_KEY_BASE` and release cookie are still
kept locally under `dataDir`.

## Options

| Option | Default | Description |
| --- | --- | --- |
| `enable` | `false` | Run the asciinema server service. |
| `environment` | `{}` | Non-secret environment variables (strings, integers or booleans). |
| `environmentFile` | `null` | Path to a `KEY=value` file with secrets, passed to `EnvironmentFile=`. |
| `dataDir` | `/var/lib/asciinema` | Directory for local state and uploads. |
| `database.createLocally` | `true` | Provision and use a local PostgreSQL database. |

## Upgrading

The server version is pinned by your flake's lock file. To move to a new
release, bump the `asciinema-server` input (or `nix flake update
asciinema-server` if you track `main`) and run `nixos-rebuild switch`. Migrations
run automatically on start.

See [Upgrading](upgrading.md#nixos) for the full steps and the release-notes
policy.
