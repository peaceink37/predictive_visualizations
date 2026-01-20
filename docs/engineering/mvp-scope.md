# MVP Scope — Project Reality

## Purpose
This document defines the **hard boundaries** of the MVP. It exists to prevent scope creep and to preserve velocity.

Anything not explicitly included here is **out of scope**.

---

## MVP Goal
Demonstrate that Project Reality can:
1. Ingest a real-world electricity dataset
2. Normalize it deterministically
3. Render it performantly to canvas
4. Respond predictably to a single scenario control

---

## Included (Must-Haves)

### Data
- One electricity generation or load dataset
- Fixed schema, versioned
- Server-side sanitation and normalization
- Deterministic preprocessing (no ML, no LLMs)

### Backend
- Python API (FastAPI-style)
- OpenAPI contract enforced
- One ingestion path
- One query path

### Frontend
- Single page application
- One canvas-based visualization
- One Mantine-based control surface
- One predictive parameter (“knob”)

### Interaction
- User adjusts control
- Visualization updates
- Clear causal relationship is visible

---

## Explicitly Excluded

- Multiple datasets
- Dataset uploads by users
- Cross-domain modeling
- Long-horizon forecasting
- User accounts or auth
- Collaboration or sharing
- Polished UI/branding
- Performance optimization beyond “smooth demo”

---

## Performance Bar
- No DOM explosion
- Canvas redraw < 100ms for target dataset
- Zero UI jank during interaction

---

## Exit Criteria
The MVP is complete when:
- A non-technical observer understands what changed and why
- The system feels responsive
- The demo reliably works without explanation

No further features are added after this point.
