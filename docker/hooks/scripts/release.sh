#!/usr/bin/env ash

set -e
release_ref="$1"
bucket_name="$2"
cloudfront_dist_id="$3"

if [[ $release_ref != "" ]]; then
  git clone --shallow-submodules --single-branch --depth 1 --branch "$release_ref" https://github.com/leastauthority/myfiletransfer
  rm -rf /etc/webhook/repo/*
  cp -r ./myfiletransfer/* ./repo/

  # TODO: do this somewhere else.
  # Deploy frontend (should already be built)
  # yarn deploy:s3:test
  if [[ $bucket_name != "" ]]; then
    aws s3 sync ./dist "$bucket_name"
  fi

  # TODO: do this somewhere else.
  # Invalidate cache
  if [[ $cloudfront_dist_id != "" ]]; then
    aws cloudfront create-invalidation \
      --distribution-id "$cloudfront_dist_id" \
      --paths /index.html /worker/index.umd.js /assets/wormhole.wasm
  fi

  # Restart backend
  date > /run/restart
fi
