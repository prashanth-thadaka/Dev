#!/usr/bin/env bash
set -euo pipefail
cd /workspace/Dev
node -e "if (Number(process.versions.node.split('.')[0]) < 24) { throw new Error('Veehoster requires Node.js 24 or newer'); }"
export npm_config_cache=/workspace/.npm-cache
export NEXT_TELEMETRY_DISABLED=1
npm ci --no-fund
npm run build
