FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

COPY standalone ./
COPY static ./apps/web/.next/static
COPY public ./apps/web/public

RUN chown -R nextjs:nextjs /app
USER nextjs

EXPOSE 8080

CMD ["node", "apps/web/server.js"]
