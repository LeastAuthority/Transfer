#!/usr/bin/env bash

set -xe

secret=$(cat ./secrets/github_webhooks.key)
release_ref=$1
signature=$2
payload=$3

dc() {
  docker-compose -p myfiletransfer $@
}

cold_restart() {
  dc down && dc up
}

# TODO: can save time if we know the docker composition and services haven't changed.
#restart() {
#  dc restart
#}

calculated_signature() {
  echo $payload | openssl sha256 -hex -mac HMAC -macopt hexkey:$secret | cut -d ' ' -f 2
}

check_signature() {
  echo "signature: $signature"
  echo "calculated_signature: $(calculated_signature)"

  if [[ $signature == calculated_signature ]]; then
    git fetch origin
#    git clean -df
    git checkout -f $release_ref
    git submodule update
    cold_restart
  fi
}

if [[ $release_ref != "" ]]; then
  check_signature $@
fi
