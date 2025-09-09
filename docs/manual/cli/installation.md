# Installation

asciinema CLI can be installed in the following ways:

- using operating system's package manager on Linux, macOS, and FreeBSD -
  search for a package named `asciinema`,
- download a pre-built, static binary of the latest version from the
  [releases](https://github.com/asciinema/asciinema/releases) page,
- use a [container image](#container-image),
- [build from source](#from-source).

Older versions of asciinema (2.x) can also be obtained as the [PyPI](#pypi)
package.

## Linux

### Arch Linux

```sh
sudo pacman -S asciinema
```

### Debian

```sh
sudo apt install asciinema
```

### Fedora

```sh
sudo dnf install asciinema
```

### Gentoo

```sh
sudo emerge -av asciinema
```

### NixOS / Nix

=== "nix-env"

    ```sh
    nix-env -i asciinema
    ```

=== "nix-shell"

    ```sh
    nix-shell -p asciinema
    ```

=== "NixOS configuration"

    ```nix title="/etc/nixos/configuration.nix"
    environment.systemPackages = [
      pkgs.asciinema
    ]
    ```

=== "home-manager"

    ```nix title="~/.config/home-manager/home.nix"
    home.packages = [
      pkgs.asciinema
    ]
    ```

### openSUSE

    sudo zypper install asciinema

### Ubuntu

=== "22.04 or newer"

    ```sh
    sudo apt install asciinema
    ```

=== "PPA"

    [David Adam (zanchey)](https://launchpad.net/~zanchey) maintains asciinema PPA.

    ```sh
    sudo apt-add-repository ppa:zanchey/asciinema
    sudo apt update
    sudo apt install asciinema
    ```

## macOS

=== "Homebrew"

    ```sh
    brew install asciinema
    ```

=== "MacPorts"

    ```sh
    sudo port selfupdate && sudo port install asciinema
    ```

=== "Nix"

    ```sh
    nix-env -i asciinema
    ```

## FreeBSD

=== "Ports"

    ```sh
    cd /usr/ports/textproc/py-asciinema && make install
    ```

=== "Packages"

    ```sh
    pkg install py39-asciinema
    ```

## OpenBSD

```sh
pkg_add asciinema
```

## PyPI

asciinema CLI 2.x is available on
[PyPI](https://pypi.python.org/pypi/asciinema) and can be installed with
`pipx`.

=== "pipx"

    If you have [pipx](https://pypa.github.io/pipx/) installed:

    ```sh
    pipx install asciinema
    ```

=== "pip"

      Alternatively use `pip` (Python 3 with `setuptools` required):

      ```sh
      python3 -m pip install asciinema
      ```

## Container image

asciinema OCI container image is based on [Ubuntu
22.04](https://releases.ubuntu.com/22.04/) and has the latest version of
asciinema recorder pre-installed.

Pull the container:

=== "podman"

    ```sh
    podman pull ghcr.io/asciinema/asciinema
    ```

=== "docker"

    ```sh
    docker pull ghcr.io/asciinema/asciinema
    ```

Container's entrypoint is set to `asciinema` binary therefore you can run the
container with arguments you would normally pass to `asciinema` command (see
[Usage](usage.md) for commands and options).

When running the container it's essential to allocate a pseudo-TTY (`-t`) and
keep STDIN open (`-i`).

=== "podman"

    ```sh
    podman run --rm -it ghcr.io/asciinema/asciinema
    ```

=== "docker"

    ```sh
    docker run --rm -it ghcr.io/asciinema/asciinema
    ```

You can optionally bind-mount config directory (`-v`):

=== "podman"

    ```sh
    podman run --rm -it -v "$HOME/.config/asciinema:/root/.config/asciinema" ghcr.io/asciinema/asciinema
    ```

=== "docker"

    ```sh
    docker run --rm -it -v "$HOME/.config/asciinema:/root/.config/asciinema" ghcr.io/asciinema/asciinema
    ```

!!! note

    If you plan to upload your recordings to
    [asciinema.org](https://asciinema.org) then it's recommended to preserve
    asciinema config directory between runs, e.g. by bind-mounting it as shown
    above. This directory stores install ID, which links all recordings uploaded
    from a given system to your asciinema.org user account.

To be able to save the recordings locally bind-mount your working directory like this:

=== "podman"

    ```sh
    podman run --rm -it -v "$PWD:/root" --workdir=/data ghcr.io/asciinema/asciinema rec demo.cast
    ```

=== "docker"

    ```sh
    docker run --rm -it -v "$PWD:/root" --workdir=/data ghcr.io/asciinema/asciinema rec demo.cast
    ```

There's not much software installed in this image. In most cases you may want to
install extra programs before recording. One option is to derive a new image
from this one (start your custom Dockerfile with `FROM
ghcr.io/asciinema/asciinema`). Another option is to start the container with
`/bin/bash` as the entrypoint, install extra packages and then start recording
with `asciinema rec`:

=== "podman"

    ```console
    podman run --rm -it --entrypoint=/bin/bash ghcr.io/asciinema/asciinema
    root@6689517d99a1:~# apt install foobar
    root@6689517d99a1:~# asciinema rec demo.cast
    ```

=== "docker"

    ```console
    docker run --rm -it --entrypoint=/bin/bash ghcr.io/asciinema/asciinema
    root@6689517d99a1:~# apt install foobar
    root@6689517d99a1:~# asciinema rec demo.cast
    ```

With Docker, it's also possible to run the container as a non-root user, which
has security benefits. You can specify user and group id at runtime to give the
application permission similar to the calling user on your host.

```sh
docker run --rm -it \
    --env=ASCIINEMA_CONFIG_HOME="/run/user/$(id -u)/.config/asciinema" \
    --user="$(id -u):$(id -g)" \
    --volume="${HOME}/.config/asciinema:/run/user/$(id -u)/.config/asciinema:rw" \
    --volume="${PWD}:/data:rw" \
    --workdir=/data \
    ghcr.io/asciinema/asciinema rec
```

!!! note

    Podman has [first class support for rootless
    operation](https://github.com/containers/podman/blob/main/docs/tutorials/rootless_tutorial.md).

## From source

If none of the above works for you (or you want to modify the code) then clone
the [git repository](https://github.com/asciinema/asciinema.git) and run
asciinema CLI straight from the checkout:

```sh
git clone https://github.com/asciinema/asciinema.git
cd asciinema
git checkout main
python3 -m asciinema --version
```
