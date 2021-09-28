# Transfer

Transfer is a graphical interface, built with the ionic/vue UI framework, for doing file transfer via the Magic Wormhole protocol.
Transfer is cross-platform, primarily targeting web, but can be built for iOS and Android using [capacitor](https://capacitorjs.com/).
It is also easily ported to desktop via [electron](https://www.electronjs.org/).

## Status

This web app is in 'alpha' state, and **not ready for production use**.
## Development Setup

Follow these steps to get the whole setup running on a local computer for easy development and debugging.

### Cloning

```
git clone git@github.com:LeastAuthority/MyFileTransfer.git
cd MyFileTransfer
git submodule init
git submodule update --recursive

or you can do it in one step:

git clone --recurse-submodules git@github.com:LeastAuthority/MyFileTransfer.git

```

### Building / Running (Web)

#### System Dependencies
- `docker`
- `docker-compose`

_(See [docker documentation]() for installation instructions)_

Install yarn globally:

```bash
npm install -g yarn
```

#### App dependencies
Install using `yarn`:

```
yarn install
```


The code uses wormhole-william built as a Web Assembly (wasm) module. If you want
to rebuild the wasm code do:

```
yarn build:wasm
```

To run local mailbox and relay servers (using docker-compose):

```
yarn compose:up -d
```

Serve the web worker entrypoint:

```
yarn serve:worker
```

Serve the app:

```
yarn run serve
```

After this, open a browser and point it to `https://localhost:8080`.

