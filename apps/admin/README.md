# Admin App

Static admin frontend for `ART_SITE`.

## Purpose

- login via backend API
- artwork table and artwork editor
- text version editor per variant + page
- password change and lightweight settings

## Runtime

- exported as static site
- intended to live in Object Storage
- talks to `apps/web` backend via `NEXT_PUBLIC_API_BASE_URL`
