import type { Scenario } from "../../types/sci";
import { structuralFireScenario } from "./structural-fire";
import { residentialBuildingScenario } from "./residential-building";
import { commercialComplexScenario } from "./commercial-complex";
import { vehicleCrashScenario } from "./vehicle-crash";
import { vehicleMciScenario } from "./vehicle-mci";
import { vehicleTunnelScenario } from "./vehicle-tunnel";
import { wildlandIsolatedScenario } from "./wildland-isolated";
import { wildlandInterfaceScenario } from "./wildland-interface";
import { wildlandMassiveScenario } from "./wildland-massive";
import { hazmatMinorScenario } from "./hazmat-minor";
import { hazmatUrbanScenario } from "./hazmat-urban";
import { hazmatSchoolScenario } from "./hazmat-school";
import { sarUrbanScenario } from "./sar-urban";
import { sarCollapseScenario } from "./sar-collapse";
import { sarMassiveScenario } from "./sar-massive";
import { evacuationGasScenario } from "./evacuation-gas";
import { evacuationMallScenario } from "./evacuation-mall";
import { evacuationTsunamiScenario } from "./evacuation-tsunami";
import { massCasualtyScenario } from "./mass-casualty";
import { multiagencyComplexScenario } from "./multiagency-complex";

export {
  structuralFireScenario,
  residentialBuildingScenario,
  commercialComplexScenario,
  vehicleCrashScenario,
  vehicleMciScenario,
  vehicleTunnelScenario,
  wildlandIsolatedScenario,
  wildlandInterfaceScenario,
  wildlandMassiveScenario,
  hazmatMinorScenario,
  hazmatUrbanScenario,
  hazmatSchoolScenario,
  sarUrbanScenario,
  sarCollapseScenario,
  sarMassiveScenario,
  evacuationGasScenario,
  evacuationMallScenario,
  evacuationTsunamiScenario,
  massCasualtyScenario,
  multiagencyComplexScenario
};

export const scenarios: Scenario[] = [
  structuralFireScenario,
  residentialBuildingScenario,
  commercialComplexScenario,
  vehicleCrashScenario,
  vehicleMciScenario,
  vehicleTunnelScenario,
  wildlandIsolatedScenario,
  wildlandInterfaceScenario,
  wildlandMassiveScenario,
  hazmatMinorScenario,
  hazmatUrbanScenario,
  hazmatSchoolScenario,
  sarUrbanScenario,
  sarCollapseScenario,
  sarMassiveScenario,
  evacuationGasScenario,
  evacuationMallScenario,
  evacuationTsunamiScenario,
  massCasualtyScenario,
  multiagencyComplexScenario
];

export const scenarioMap: Record<string, Scenario> = Object.fromEntries(
  scenarios.map((s) => [s.id, s])
);
