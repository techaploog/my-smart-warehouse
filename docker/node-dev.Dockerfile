FROM node:24-alpine

# pnpm via Corepack (ships with Node)
RUN corepack enable

WORKDIR /workspace

# Keep container installs/caches inside named volumes
ENV PNPM_STORE_DIR=/pnpm-store

# Default shell so we can use `sh -lc ...` in compose
CMD ["bash", "-lc", "node -v && pnpm -v && bash"]
