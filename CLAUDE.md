# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A semester calendar (Feb-Jul 2026) for tracking events/shows for Kyle and Luka. Built as a single-page React application with Google Calendar-inspired design.

## Development Commands

```bash
# Start development server (opens on localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

**Single-component application**: All logic resides in `src/App.jsx`. The component uses inline styles throughout (no separate CSS files).

**State management**: Simple React `useState` hooks for:
- Current year/month navigation
- Selected date (for event detail popup)
- Hover state for event chips

**Data structure**:
- `EVENTS` array (lines 9-23): Hardcoded event data with date, title, venue, status, person, and time
- `PEOPLE` object (lines 3-7): Person metadata including colors for UI theming
- `eventMap` (lines 33-37): Date-indexed lookup created from EVENTS array

## Design System

**Person color coding**:
- Kyle: Baby blue (`#5BA4CF`)
- Luka: Maroon (`#8B1A2B`)
- Both: Diagonal gradient split between Kyle/Luka colors

**Status indicators**:
- Confirmed: Green dot (solid fill)
- Tentative: Orange dot (hollow outline) + question mark emoji in chip

**Visual patterns**:
- Event cells have subtle background tint + 3px left border accent in person color
- Event chips display time + title with person-specific background color
- Mini calendar in sidebar shows color-coded dots for event days
- Today indicator: Blue circular background

## Key Patterns

**Date formatting**: Uses `fmtKey(year, month, day)` helper to create `YYYY-MM-DD` strings for event lookup (line 31).

**Calendar grid**: Renders 42 cells (6 weeks × 7 days) to maintain consistent layout. Non-current month days have reduced opacity (line 202).

**Event rendering**: Multiple events on same day are stacked vertically as colored chips. Tentative events show dashed left border (line 231).

## Adding New Events

To add events, append to the `EVENTS` array following this structure:

```javascript
{
  date: "YYYY-MM-DD",
  title: "Event Name",
  venue: "Venue Name, Location",
  status: "confirmed" | "tentative",
  person: "kyle" | "luka" | "both",
  time: "HH:MM am/pm"
}
```

The `eventMap` is automatically rebuilt from the EVENTS array on mount.
