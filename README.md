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
```

and then do:

```
yarn serve:worker
```

To build the wormhole-william into WASM, do:

```
yarn build:wasm
```

and now do

```
yarn install
yarn run serve
```

After this, open a browser and point it to `https://localhost:8080`.

