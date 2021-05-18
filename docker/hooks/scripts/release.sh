#!/usr/bin/env ash

set -e
release_ref="$1"
bucket_name="$2"
cloudfront_dist_id="$3"

restore_docker_compose_override() {
  cp ./override.yml ./repo/docker/docker-compose.override.yml
}

if [[ $release_ref != "" ]]; then
  git clone --shallow-submodules --recurse-submodules --single-branch --depth 1 --branch "$release_ref" https://github.com/leastauthority/myfiletransfer /tmp/myfiletransfer
  rm -rf /etc/webhook/repo/*
  cp -r /tmp/myfiletransfer/* ./repo/
  restore_docker_compose_overrides

  # TODO: do this somewhere else.
  if [[ $bucket_name != "" ]]; then
    (cd ./repo && yarn install && yarn build && \
      aws s3 sync ./repo/dist "$bucket_name")
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
