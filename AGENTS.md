<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Prisma Engine Fix

Next.js output file tracing breaks Prisma engine resolution (maps `process.cwd()` to `/ROOT`). Fix:

1. Set `PRISMA_QUERY_ENGINE_LIBRARY` env var to the absolute path of the engine `.so.node` file
2. Use `./start.sh` instead of `npm start` (the script sets the env var automatically)
3. The engine is at `src/lib/generated/libquery_engine-debian-openssl-1.1.x.so.node`
