# Modular Feature Structure

This project follows a layered module layout for all features. The **Groups** module is the reference implementation.

## Standard path

```
src/features/<domain>/features/<feature>/
```

Example: [`src/features/admin/features/groups/`](../src/features/admin/features/groups/)

## Layering rules

1. **UI** — `pages/`, `components/`, UI-only `hooks/` — never import from `dto/`.
2. **Application** — `queries/`, `mutations/`, `commands/` — orchestration only.
3. **Infrastructure** — `api/`, `dto/` — raw backend contracts.
4. **Domain** — `types/`, `validation/`, `mappers/` — stable internal models.

## DTO boundary

Every module defines:

- `Api*Dto` (read)
- `*Model` (internal)
- `*CreateDto` / `*UpdateDto` (write)
- Mappers: `to*Model`, `toCreateDto`, `toCache` / `fromCache`

Inbound DTOs are validated with Zod in mappers; invalid list rows are dropped.

## Offline-first (planned)

Groups is structured for Dexie + sync queue integration. Command handlers include `TODO` markers where optimistic cache and queue jobs will plug in.

See the module README: [groups/README.md](../src/features/admin/features/groups/README.md).

## New module checklist

- [ ] Copy folder structure from Groups
- [ ] Add `dto/` + `mappers/` before UI
- [ ] Detail page uses ID + `useFeature(id)` only
- [ ] Business validation beyond field presence
- [ ] Mapper + mutation tests
- [ ] Module `README.md`
