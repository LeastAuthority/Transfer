#!/usr/bin/env ash

set -e
release_ref="$1"
bucket_name="$2"
cloudfront_dist_id="$3"

dc() {
  docker-compose -p myfiletransfer "$@"
}

cold_restart() {
  # TODO: something much more robust!
  dc down && dc up
}

# TODO: can save time if we know the docker composition and services haven't changed.
#restart() {
#  dc restart
#}

if [[ $release_ref != "" ]]; then
  git clone --shallow-submodules --single-branch --depth 1 --branch "$release_ref" https://github.com/leastauthority/myfiletransfer

  # Deploy frontend (should already be built)
  # yarn deploy:s3:test
  if [[ $bucket_name != "" ]]; then
    aws s3 sync ./dist "$bucket_name"
  fi

  # Invalidate cache
  if [[ $cloudfront_dist_id != "" ]]; then
    aws cloudfront create-invalidation \
      --distribution-id "$cloudfront_dist_id" \
      --paths /index.html /worker/index.umd.js /assets/wormhole.wasm
  fi

  # Restart backend
  cold_restart
fi
