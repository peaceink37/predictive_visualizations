# Engineering Overview — Project Reality

## Purpose
This document defines the **engineering truth** of Project Reality: what is being built, what is explicitly not being built (yet), and the constraints that govern all technical decisions.

This file is the canonical reference for contributors, reviewers, and future maintainers.

---

## Guiding Principles
- **User-perceived simplicity beats internal elegance**
- **Canvas-first rendering for performance**
- **Schema before code**
- **Predictability over configurability**
- **No premature generalization**

---

## Current Scope (MVP)

### Domain Focus
- Electricity generation and load data
- Time-series normalization
- Scenario-based forward projection

### Functional Capabilities
- Ingest a single structured electricity dataset
- Normalize missing or irregular timestamps (server-side only)
- Render a single interactive visualization to HTML5 Canvas
- Apply one predictive control (“knob”) and re-render output

### Visualization
- D3-driven rendering targeting Canvas (not SVG)
- Mantine UI for controls and framing only
- Zero DOM node explosion tolerance

---

## Explicit Non-Goals (MVP)
- Multi-dataset joins
- Arbitrary user-defined schemas
- Cross-domain simulation
- LLM-driven transformations
- Multi-user collaboration
- Long-horizon forecasts beyond demonstrative value

If it lives here, it is **out of scope**.

---

## Architecture (High Level)

### Frontend
- Next.js + Mantine
- d3
- Canvas-based visualization layer
- TanStack Query for data access
- Minimal UI surface

### Backend
- Python API (FastAPI-style)
- Deterministic sanitation and normalization pipeline
- Explicit versioned schemas (OpenAPI)

### Data
- MongoDB (with chunking strategies for large matrices)
- Time-series centric storage
- Forward-compatible but not generalized

---

## Development Discipline
- MVP code must trace directly to documented scope
- Vision artifacts do not imply implementation
- All expansions require an ADR

---

## Success Criteria
- A credible, performant demo
- Clear causal relationship between input and output
- Confidence that the system can scale conceptually

This document evolves only when scope is **intentionally promoted**.
