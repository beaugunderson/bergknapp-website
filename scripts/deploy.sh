#!/usr/bin/env bash
# Draft deploy by default. Pass --prod only when ready to publish.
set -euo pipefail
cd "$(dirname "$0")/.."
stage=$(mktemp -d /tmp/bergknapp-deploy.XXXXXX)
trap 'rm -rf "$stage"' EXIT
cp index.html favicon.svg favicon.png apple-touch-icon.png icon-256.png icon-512.png og.png "$stage/"
cp -R assets "$stage/"
netlify deploy --no-build --dir "$stage" "$@"
