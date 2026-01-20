Functions must be single responsibility. If more than one thing happens, split or delegate to helpers.

No duplication: DRY. If logic appears twice, extract.

Complex logic must have a docstring explaining intent, assumptions, and edge cases.

Prefer pure functions for transformations.

Use typed interfaces at module boundaries (TS interfaces/types; Python pydantic/dataclasses as appropriate).

No function > ~30–40 lines unless it is composed of clearly named helper calls.

No 100-line useEffect. Logic must be decomposed into helpers/hooks.

Anything crossing app boundaries must be represented in OpenAPI (schema-first).
