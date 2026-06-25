import { useMemo, useReducer } from "react";
import { scenarios } from "../data/scenarios";
import { structuralFireRubric } from "../data/rubrics";
import {
  createInitialState,
  evaluateSimulation,
  getGlobalScore,
  simulationReducer
} from "../engine/simulationEngine";

export function useSimulation() {
  const [state, dispatch] = useReducer(simulationReducer, scenarios[0], createInitialState);

  const evaluation = useMemo(() => evaluateSimulation(state, structuralFireRubric), [state]);
  const globalScore = useMemo(() => getGlobalScore(evaluation), [evaluation]);

  return {
    state,
    dispatch,
    evaluation,
    globalScore,
    rubric: structuralFireRubric
  };
}
