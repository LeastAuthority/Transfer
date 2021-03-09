#!/usr/bin/env bash
repo_root="$(cd "$(dirname ${BASH_SOURCE[0]})/.." && pwd)"

echo "[DOCKER_COMPOSE]: docker-compose -p "$(basename "$repo_root")" $@"
(cd "$repo_root/docker" && docker-compose -p "$(basename "$repo_root")" "$@")
