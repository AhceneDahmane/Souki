#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
export PRISMA_QUERY_ENGINE_LIBRARY="$SCRIPT_DIR/src/lib/generated/libquery_engine-debian-openssl-1.1.x.so.node"
exec npx next start "$@"
