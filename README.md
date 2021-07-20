# MyFileTransfer

File transfer app that uses the magic wormhole protocol and ionic/vue UI framework.

## Development Setup

Follow these steps to get the whole setup running on a local computer for easy development and debugging.

### Cloning

```
git clone git@github.com:LeastAuthority/MyFileTransfer.git
cd MyFileTransfer
git submodule init
git submodule update --recursive

or you can do it in one step:

```
git clone --recurse-submodules git@github.com:LeastAuthority/MyFileTransfer.git

```

### Building

First install all the dependencies:

```
yarn install
```

You also need `docker` installed on the system.

The code uses wormhole-william built as a Web Assembly (wasm) module. If you want
to rebuild the wasm code do:

```
yarn build:wasm
```

You need to run a local copy of mailbox server and a relay server. To do that run:
```
yarn compose:up -d
```

and then do:

```
yarn serve:worker
```

and now do

```
yarn run serve
```

After this, open a browser and point it to `https://localhost:8080`.

