# Upgrading

To upgrade your instance of asciinema server to the latest version:

- check the [releases](https://github.com/asciinema/asciinema-server/releases)
  for the latest version number,
- check the release notes of _all_ versions between the one you're running and
  the one you're upgrading to, and look for manual upgrade steps and breaking
  changes for each version - if there are manual steps you omit you may end up
  with a broken installation,
- apply the new version using the steps for your deployment method below.

Release notes for each version include detailed information on the steps needed
for a successful upgrade. Backward compatibility is always a high priority when
cutting a new release, thus, breaking changes are more the exception than the
rule.

## Docker

Update the `asciinema` container image tag to the latest number:

```diff title="docker-compose.yml"
 services:
   asciinema:
-    image: ghcr.io/asciinema/asciinema-server:20260616
+    image: ghcr.io/asciinema/asciinema-server:20260626
     # ...
```

Then recreate the stack with `docker compose up -d`.

## NixOS

Bump the pinned `asciinema-server` flake input to the new release:

```diff title="flake.nix"
   inputs = {
     nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
-    asciinema-server.url = "github:asciinema/asciinema-server/20260616";
+    asciinema-server.url = "github:asciinema/asciinema-server/20260626";
   };
```

Then run `nixos-rebuild switch`. If you track the `main` branch instead of a
pinned tag, run `nix flake update asciinema-server` first. Database migrations
run automatically on start.
