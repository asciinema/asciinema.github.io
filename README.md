# docs

asciinema documentation site, published at
[docs.asciinema.org](https://docs.asciinema.org/).

## Development

To work on the docs, first download the source code:

```sh
git clone https://github.com/asciinema/asciinema.github.io
cd asciinema.github.io
```

The recommended way to get the toolchain is the Nix dev shell, which provides
MkDocs with all required extensions and just works:

```sh
nix develop
```

If you don't use Nix, you need Python 3 and the MkDocs Material theme (pinned
in `requirements.txt`).

Then run `mkdocs serve` (or the `serve` alias available in the dev shell) for a
live-reloading preview, and `mkdocs build --strict` to validate the site before
submitting.

If you'd like to propose or submit any changes, please read the
[contribution guidelines](CONTRIBUTING.md) first.
