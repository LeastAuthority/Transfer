## **Note:** This repository is not maintained anymore. Be aware that the packages are outdated and may have security issues. The front-end application code was refactored and a new version is available as the [Winden repository](https://github.com/LeastAuthority/winden).

# Transfer (**depreciated**)

Transfer is a graphical interface, built with the ionic/vue UI framework, for doing file transfer via the Magic Wormhole protocol.
Transfer is cross-platform, primarily targeting web, but can be built for iOS and Android using [capacitor](https://capacitorjs.com/).
It is also easily ported to desktop via [electron](https://www.electronjs.org/).

## Status

This web app is in 'alpha' state, and **not ready for production use**.

## Development Setup

Follow these steps to get the whole setup running on a local computer for easy development and debugging.

### Cloning

```
git clone git@github.com:LeastAuthority/Transfer.git
cd Transfer
git submodule init
git submodule update --recursive

or you can do it in one step:

git clone --recurse-submodules git@github.com:LeastAuthority/Transfer.git

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

### Building the site

To build the website for a particular stage (playground vs
production), we should create a file in the root of the filesystem
called `.production.build.env` or `.playground.build.env` (according
to the stage for which we are building) and define three variables there:

```
VUE_APP_STAGE_HOSTNAME="https://foo.bar.org"
VUE_APP_STAGE_MAILBOX_URL="wss://mailbox.foo.bar.org/v1"
VUE_APP_STAGE_RELAY_URL="wss://relay.foo.bar.org:433"
```

Now, the site files can be generated with:

```
yarn build:playground
```

or

```
yarn build:production
```

A directory called `dist` would be created and it can be run with:

```
npx serve ./dist
```

to test whether the URLs are correct or whether the functionality or a
fix that was added is working fine.

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

| Name               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AWS_PROFILE`      | AWS credentials profile to use when authenticating with AWS.<br/>See [named profiles](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html).                                                                                                                                                                                                                                                                                                                                                                                      |
| `S3_BUCKET`        | AWS S3 bucket associated with this stage to upload build output directory to. For public buckets, this will likely be the fully-qualified domain name for this stage.                                                                                                                                                                                                                                                                                                                                                                                     |
| `CDF_DISTRIBUTION` | AWS Cloudfront distribution ID associated with this stage for which the cache should be invalidated.<br/><br/>The cloudfront distribution ID can be obtained given the FQDN. The [AWS CLI](https://aws.amazon.com/cli/) can be used to do list distributions: ` AWS_PROFILE=<profile name> aws cloudfront list-distributions`. Searching the results for the FQDN of the stage in question will yield a distribution ID. Alternatively, the [cloudfront web UI](https://console.aws.amazon.com/cloudfront/v3/home?#/distributions) can be used similarly. |
