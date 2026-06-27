import { useCallback, useEffect, useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { BriefingPanel } from "./components/BriefingPanel";
import { DebriefingPanel } from "./components/DebriefingPanel";
import { DecisionLogPanel } from "./components/DecisionLogPanel";
import { DecisionPanel } from "./components/DecisionPanel";
import { DoctrinePanel } from "./components/DoctrinePanel";
import { FeedbackToast } from "./components/FeedbackToast";
import { IcsFormViewer } from "./components/IcsFormViewer";
import { GuidedQuestionPanel } from "./components/instructor/GuidedQuestionPanel";
import { InstructorModePanel } from "./components/instructor/InstructorModePanel";
import { InstructorNotesPanel } from "./components/instructor/InstructorNotesPanel";
import { LivePerformancePanel } from "./components/instructor/LivePerformancePanel";
import { TeachingPausePanel } from "./components/instructor/TeachingPausePanel";
import { InstructorPanel } from "./components/InstructorPanel";
import { MetricGrid } from "./components/MetricGrid";
import { ObjectivePanel } from "./components/ObjectivePanel";
import { OrgChart } from "./components/OrgChart";
import { ResourcePanel } from "./components/ResourcePanel";
import { RubricPanel } from "./components/RubricPanel";
import { ScenarioBoard } from "./components/ScenarioBoard";
import { ScenarioSelector } from "./components/ScenarioSelector";
import { SimulationTimeline } from "./components/SimulationTimeline";
import { SessionLandingPanel } from "./components/session/SessionLandingPanel";
import { CreateSessionPanel } from "./components/session/CreateSessionPanel";
import { JoinSessionPanel } from "./components/session/JoinSessionPanel";
import { SessionStatusBar } from "./components/session/SessionStatusBar";
import { ParticipantsPanel } from "./components/session/ParticipantsPanel";
import { useSimulation } from "./hooks/useSimulation";
import { useInstructorEvents } from "./hooks/useInstructorEvents";
import { useFirebaseAuth } from "./hooks/useFirebaseAuth";
import { useRealtimeSession, useFirebaseDecisionSync } from "./hooks/useRealtimeSession";
import { scenarioMap, scenarios } from "./data/scenarios";
import type { InstructorMode } from "./components/instructor/InstructorModePanel";
import type { SessionConfig } from "./types/sci";
import type { FirebaseSession } from "./types/firebaseSession";
import type { SessionPersistenceAdapter } from "./services/sessionAdapter";
import { getAdapter } from "./services/sessionAdapter";
import { shouldShowLiveScore } from "./utils/sessionVisibility";
import { isFirebaseConfigured, firebaseAuth, firebaseDb } from "./lib/firebase";

// ─── Simulation screen ─────────────────────────────────────────────────────

interface SimulationScreenProps {
  config: SessionConfig;
  onExit: () => void;
  projector: boolean;
  onToggleProjector: () => void;
  onlineSession?: FirebaseSession;
  adapter?: SessionPersistenceAdapter;
  currentUid?: string;
}

function SimulationScreen({
  config, onExit, projector, onToggleProjector,
  onlineSession, adapter, currentUid,
}: SimulationScreenProps) {
  const {
    state, dispatch, evaluation, globalScore, rubric, role,
    feedback, clearFeedback, isCompleted, complete, clearSession,
    decisionLogs, evaluationSummary, debriefingData
  } = useSimulation(config);

  const [showDebriefing, setShowDebriefing] = useState(false);
  const [instructorMode, setInstructorMode] = useState<InstructorMode>("full");
  const [immersive, setImmersive] = useState(false);

  const { events: instructorEvents, notes, pauses, add: addInstructorEvent, remove: removeInstructorEvent, clear: clearInstructorEventsFn } = useInstructorEvents(config.scenarioId);

  // Online session sync — no-op when adapter is undefined or local
  const sessionId = onlineSession?.id ?? null;
  const realtimeState = useRealtimeSession(adapter ?? null, sessionId);
  useFirebaseDecisionSync(adapter ?? null, sessionId, decisionLogs);

  const isInstructor  = role === "instructor";
  const isTeaching    = isInstructor && instructorMode === "teaching";
  const isEvaluation  = isInstructor && instructorMode === "evaluation";

  useEffect(() => {
    if (isCompleted) setShowDebriefing(true);
  }, [isCompleted]);

  const handleRestart = useCallback(() => {
    setShowDebriefing(false);
    clearSession();
    clearInstructorEventsFn();
  }, [clearSession, clearInstructorEventsFn]);

  if (showDebriefing && isCompleted) {
    return (
      <DebriefingPanel
        state={state}
        evaluation={evaluationSummary}
        debriefing={debriefingData}
        logs={decisionLogs}
        role={role}
        instructorEvents={instructorEvents}
        onRestart={handleRestart}
        onExit={onExit}
      />
    );
  }

  const isOnlineInstructor =
    onlineSession && currentUid && onlineSession.instructorUid === currentUid;

  return (
    <main
      className={[
        "app-shell",
        projector   ? "projector-mode"   : "",
        isTeaching  ? "teaching-mode"    : "",
        isEvaluation? "evaluation-mode"  : "",
        immersive   ? "immersive"        : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <AppHeader
        title={state.scenario.title}
        minute={state.minute}
        status={state.status}
        globalScore={globalScore}
        role={role}
        isCompleted={isCompleted}
        dispatch={dispatch}
        onComplete={complete}
        onReset={clearSession}
        onExit={onExit}
        projector={projector}
        onToggleProjector={onToggleProjector}
        showScore={shouldShowLiveScore(role, isCompleted)}
        immersive={immersive}
        onToggleImmersive={() => setImmersive((v) => !v)}
      />

      <section className="briefing-band">
        <div>
          <p className="eyebrow">Briefing operacional</p>
          <h2>{state.scenario.summary}</h2>
          <p>{state.scenario.briefing}</p>
        </div>
      </section>

      <MetricGrid metrics={state.metrics} />

      <div className="main-grid">
        <div className="left-stack">
          <ScenarioBoard state={state} immersive={immersive} />
          <ObjectivePanel state={state} />
          <OrgChart
            activeRoles={state.activeRoles}
            spanOfControlWarning={state.spanOfControlWarning}
            role={role}
            dispatch={dispatch}
          />
        </div>

        <div className="center-stack">
          <DecisionPanel state={state} dispatch={dispatch} role={role} />
        </div>

        <div className="right-stack">
          {isInstructor && (
            <InstructorModePanel
              mode={instructorMode}
              onModeChange={setInstructorMode}
            />
          )}
          {isInstructor && (
            <LivePerformancePanel state={state} globalScore={globalScore} />
          )}
          {isInstructor && !isEvaluation && (
            <InstructorPanel state={state} dispatch={dispatch} />
          )}
          <ResourcePanel resources={state.resources} />

          {isInstructor || isCompleted ? (
            <RubricPanel rubric={rubric} evaluation={evaluation} />
          ) : (
            <section className="panel">
              <div className="panel-heading">
                <p className="eyebrow">Evaluación</p>
                <h2>Rúbrica del ejercicio</h2>
              </div>
              <p className="rubric-locked-msg">
                La rúbrica estará disponible al finalizar el ejercicio.
                <br />
                <small>Usa el botón "Finalizar" cuando hayas tomado todas tus decisiones.</small>
              </p>
            </section>
          )}
        </div>
      </div>

      <div className={`bottom-grid${!isInstructor ? " bottom-grid--single" : ""}`}>
        <SimulationTimeline entries={state.timeline} role={role} />
        {isInstructor && <DoctrinePanel />}
      </div>

      {isInstructor && <DecisionLogPanel logs={decisionLogs} />}
      {isInstructor && <IcsFormViewer state={state} />}

      {/* ── Online session panels ────────────────────────────────── */}
      {onlineSession && adapter && currentUid && (
        <div className="bottom-grid">
          <SessionStatusBar
            session={onlineSession}
            adapter={adapter}
            currentUid={currentUid}
          />
          {isOnlineInstructor && (
            <ParticipantsPanel
              participants={realtimeState.participants}
              studentDecisions={realtimeState.studentDecisions}
            />
          )}
        </div>
      )}

      {/* ── Teaching mode tools ─────────────────────────────────── */}
      {isTeaching && (
        <div className="teaching-tools-grid">
          <GuidedQuestionPanel
            learningObjectives={state.scenario.learningObjectives}
            scenarioTitle={state.scenario.title}
          />
          <section className="panel">
            <div className="panel-heading">
              <p className="eyebrow">Herramientas docentes</p>
              <h2>Notas y pausas</h2>
            </div>
            <TeachingPausePanel
              pauses={pauses}
              minute={state.minute}
              onAdd={addInstructorEvent}
            />
            <div style={{ marginTop: 16 }}>
              <InstructorNotesPanel
                notes={notes}
                minute={state.minute}
                onAdd={addInstructorEvent}
                onRemove={removeInstructorEvent}
              />
            </div>
          </section>
        </div>
      )}

      <FeedbackToast feedback={feedback} onClose={clearFeedback} />
    </main>
  );
}

// ─── Root app ──────────────────────────────────────────────────────────────

type AppPhase = "local-landing" | "session-landing" | "create-session" | "join-session";

export default function App() {
  const [pendingConfig, setPendingConfig] = useState<SessionConfig | null>(null);
  const [activeConfig, setActiveConfig]   = useState<SessionConfig | null>(null);
  const [projector, setProjector]         = useState(false);

  // Online session state
  const [phase, setPhase] = useState<AppPhase>(
    isFirebaseConfigured ? "session-landing" : "local-landing"
  );
  const [onlineSession, setOnlineSession] = useState<FirebaseSession | null>(null);
  const [adapter] = useState<SessionPersistenceAdapter>(() => getAdapter(firebaseDb));
  const authState = useFirebaseAuth(isFirebaseConfigured ? firebaseAuth : null);

  const handleStart    = useCallback((cfg: SessionConfig) => setPendingConfig(cfg), []);
  const handleBeginSim = useCallback(() => {
    if (!pendingConfig) return;
    setActiveConfig(pendingConfig);
    setPendingConfig(null);
  }, [pendingConfig]);
  const handleExit = useCallback(() => {
    setActiveConfig(null);
    setPendingConfig(null);
    setOnlineSession(null);
    setPhase(isFirebaseConfigured ? "session-landing" : "local-landing");
  }, []);
  const handleBack      = useCallback(() => setPendingConfig(null), []);
  const toggleProjector = useCallback(() => setProjector((p) => !p), []);

  useEffect(() => {
    const handler = () => {};
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ── Online session: instructor creates session then picks scenario
  const handleSessionCreated = useCallback((session: FirebaseSession, scenarioId: string) => {
    setOnlineSession(session);
    // Pre-select the scenario for the instructor
    setPendingConfig({ scenarioId, role: "instructor" });
    setPhase("local-landing");
  }, []);

  // ── Online session: student joins then goes straight to the scenario briefing
  const handleSessionJoined = useCallback((session: FirebaseSession) => {
    setOnlineSession(session);
    setPendingConfig({ scenarioId: session.scenarioId, role: "alumno" });
    setPhase("local-landing");
  }, []);

  // ── Session landing (shown when Firebase is configured)
  if (phase === "session-landing") {
    return (
      <SessionLandingPanel
        onLocalMode={() => setPhase("local-landing")}
        onCreateSession={() => setPhase("create-session")}
        onJoinSession={() => setPhase("join-session")}
      />
    );
  }

  if (phase === "create-session") {
    return (
      <CreateSessionPanel
        adapter={adapter}
        instructorUid={authState.uid ?? "local-instructor"}
        onSessionCreated={handleSessionCreated}
        onBack={() => setPhase("session-landing")}
      />
    );
  }

  if (phase === "join-session") {
    return (
      <JoinSessionPanel
        adapter={adapter}
        studentUid={authState.uid ?? "local-student"}
        onSessionJoined={handleSessionJoined}
        onBack={() => setPhase("session-landing")}
      />
    );
  }

  // ── Local / post-session flow (existing behavior preserved)
  if (!pendingConfig && !activeConfig) {
    return <ScenarioSelector onStart={handleStart} />;
  }

  if (pendingConfig && !activeConfig) {
    const scenario = scenarioMap[pendingConfig.scenarioId] ?? scenarios[0];
    return (
      <BriefingPanel
        scenario={scenario}
        role={pendingConfig.role}
        onStart={handleBeginSim}
        onBack={handleBack}
      />
    );
  }

  return (
    <SimulationScreen
      config={activeConfig!}
      onExit={handleExit}
      projector={projector}
      onToggleProjector={toggleProjector}
      onlineSession={onlineSession ?? undefined}
      adapter={onlineSession ? adapter : undefined}
      currentUid={authState.uid ?? undefined}
    />
  );
}
