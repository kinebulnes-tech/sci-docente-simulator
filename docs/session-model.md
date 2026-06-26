# Session Data Model — SCI Docente Simulator (Fase 8)

## Firestore structure

```
sessions/{sessionId}
  ├── joinCode: string          6-char alphanumeric code
  ├── scenarioId: string        Matches local scenario IDs (unchanged)
  ├── scenarioName: string
  ├── mode: SessionMode         "full"|"teaching"|"evaluation"|"projector"
  ├── status: SessionStatus     "waiting"|"active"|"completed"|"closed"
  ├── createdAt: number         Unix ms
  ├── updatedAt: number
  ├── instructorUid: string     Firebase anonymous UID
  ├── instructorName: string
  ├── activeStudentUid?: string
  ├── activeStudentName?: string
  │
  ├── participants/{uid}
  │     ├── uid: string
  │     ├── role: "instructor"|"student"
  │     ├── displayName: string
  │     ├── joinedAt: number
  │     └── lastSeenAt: number
  │
  ├── studentDecisions/{id}     Immutable once written
  │     ├── id: string
  │     ├── timestamp: number
  │     ├── source: "student"   Hardcoded — rules enforce this
  │     ├── evaluable: true     Hardcoded — rules enforce this
  │     ├── visibility: "all"   Always visible
  │     ├── decisionId: string
  │     ├── label: string
  │     ├── category: string
  │     ├── result: "applied"|"blocked"|"repeated"
  │     └── minute: number
  │
  └── instructorEvents/{id}
        ├── id: string
        ├── timestamp: number
        ├── source: "instructor"   Hardcoded — rules enforce this
        ├── evaluable: false       Hardcoded — rules enforce this
        ├── visibility: "instructor_only"|"student_visible"|"projector_visible"
        ├── type: InstructorEventType
        ├── content: string
        └── minute?: number
```

## Evaluation protection invariants

1. `studentDecisions.evaluable` is always `true` — set by the student's app, validated by rules.
2. `instructorEvents.evaluable` is always `false` — set by the instructor's app, validated by rules.
3. `filterEvaluableLogs()` in `sessionVisibility.ts` filters by `source === "student"` as a second guard.
4. `calculateEvaluation()` in `evaluation.ts` receives only the output of `filterEvaluableLogs()`.

These four layers ensure instructor annotations **cannot** affect the student's score, regardless of
network errors, bugs, or adversarial input.

## JSON export v1.2

```json
{
  "version": "1.2",
  "session": {
    "id": "...",
    "joinCode": "ABC123",
    "mode": "evaluation",
    "instructorName": "Prof. Soto",
    "activeStudentName": "Alumno García",
    "createdAt": 1719360000000
  },
  "participants": [...],
  "instructorEvents": [...],
  "evaluation": { "score": 75, "passed": true, ... },
  ...
}
```

The `session` field is `null` for local (offline) exports.
`instructorEvents` are never included when exported from a student role
(see `ExportPanel.tsx` — `instructorEvents` prop is gated to `isInstructor`).

## Adapter pattern

`SessionPersistenceAdapter` is the interface. Two implementations:

| Adapter | When active | Persistence |
|---|---|---|
| `localSessionAdapter` | No Firebase env vars | `localStorage` |
| `firebaseSessionAdapter` | Firebase configured | Firestore + onSnapshot |

The active adapter is created once in `App.tsx` via `getAdapter(firebaseDb)`.
All session UI components receive the adapter as a prop — no direct Firebase imports outside services.
