# Installation

## Native package

agg may be available in your operating system's packager manager repository.
Search for `agg` or `asciinema-agg`.

If it's not there then you can [download prebuilt agg
binary](#prebuilt-binaries), [use the container
image](#oci-container-image), or [build from source](#building-from-source).

## Prebuilt binaries

agg is written in Rust, and Rust compiler produces standalone binaries that can
run without extra dependencies. There's [Github Actions Release
workflow](https://github.com/asciinema/agg/blob/main/.github/workflows/release.yml)
for agg which builds binaries for multiple OSes and CPU architectures, attaching
the binaries to every new release on Github.

Visit [latest release](https://github.com/asciinema/agg/releases/latest) page,
and download a binary appropriate for your system.

For 64-bit x86 system choose a file with `x86_64` in the name. For ARMv8
(64-bit, e.g. Apple Silicon) choose a file with `aarch64`. For ARMv7 (32-bit,
e.g. Raspberry Pi) choose a file with `arm`.

Make it executable and put it somewhere in `$PATH`:

```bash
chmod a+x agg
sudo mv agg /usr/local/bin
```

## OCI container image

Official container images are published to the GitHub Container Registry at
[`ghcr.io/asciinema/agg`](https://github.com/asciinema/agg/pkgs/container/agg).
The image bundles agg with a broad set of monospace fonts, so recordings render
out of the box.

With Docker:

```sh
docker run --rm -u $(id -u):$(id -g) -v $PWD:/data ghcr.io/asciinema/agg demo.cast demo.gif
```

With Podman in root-less mode:

```sh
podman run --rm -v $PWD:/data ghcr.io/asciinema/agg demo.cast demo.gif
```

Under Docker, `-u $(id -u):$(id -g)` makes the output files owned by you instead
of root; rootless Podman maps the container user to your account automatically,
so it's not needed there.

Besides `latest`, each release is tagged with its version, e.g.
`ghcr.io/asciinema/agg:1.9.0`.

## Building from source

Building from source requires [Rust](https://www.rust-lang.org/) compiler
(1.85.0 or later) and [Cargo package manager](https://doc.rust-lang.org/cargo/).
You can install both with [rustup](https://rustup.rs/).

To download source code, build agg binary and install it in `$HOME/.cargo/bin`
run:

```bash
cargo install --git https://github.com/asciinema/agg
```

You need to ensure `$HOME/.cargo/bin` is in your shell's `$PATH`.

Alternatively, you can manually download source code and build agg binary with:

```bash
git clone https://github.com/asciinema/agg
cd agg
cargo build --release
```

This produces an executable file in _release mode_ (`--release`) at
`target/release/agg`. There are no other build artifacts so you can copy the
binary to a directory in your `$PATH`.

### Building with Docker

If you'd rather build the container image yourself from the latest source —
instead of using the [official image](#oci-container-image) — you can do so with
Docker, Podman, or another Docker-compatible tool. This doesn't require a Rust
toolchain on your machine.

Build the image with the following command:

```sh
docker build -t agg .
```

Then run agg like this:

```sh
docker run --rm -u $(id -u):$(id -g) -v $PWD:/data agg demo.cast demo.gif
```

If you use Podman in root-less mode:

```sh
podman run --rm -v $PWD:/data agg demo.cast demo.gif
```
