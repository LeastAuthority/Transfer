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

### Deployments / Cache Invalidation

Deployments can be done via `yarn deploy:<stage name>`.
This will sync the ./dist (build output) directory with the stage's S3 bucket.
Executing this script via `yarn` will also cause the "uncache" script to run which invalidates specific objects in the stage's cloudfront cache.
This invalidation can also be performed directly with `yarn uncache:<stage name>`.

#### Dotenv

Deployment and cache invalidation scripts rely on environment variables specified below.
When invoking these scripts, either directly or via yarn, environment variables may be provided as such, i.e.:
```bash
AWS_PROFILE=my-profile node ./scripts/deploy.js
# OR
AWS_PROFILE=my-profile yarn deploy:staging
```

Alternatively, a [dotenv](https://github.com/motdotla/dotenv#readme) file will be loaded, if present, and used to populate environment variables accordingly.
The deploy and cache invalidation scripts apply a stage-specific dotenv file following the convention `.<stage name>.env`, e.g.: `.staging.env`.

| Name               | Description                                                                                                                                                           |
|--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AWS_PROFILE`      | AWS credentials profile to use when authenticating with AWS.<br/>See [named profiles](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html).  |
| `S3_BUCKET`        | AWS S3 bucket associated with this stage to upload build output directory to. For public buckets, this will likely be the fully-qualified domain name for this stage. |
| `CDF_DISTRIBUTION` | AWS Cloudfront distribution ID associated with this stage for which the cache should be invalidated.                                                                  |
