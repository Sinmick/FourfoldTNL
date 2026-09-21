// EXP per hour calculation logic will go here later.
import { useState } from "react";
const partyExpMultiplier = {
  1: 1.00,
  2: 0.80,
  3: 0.70,
  4: 0.63,
  5: 0.59,
};
export function calculateExpPerHour(expPerRun, partySize, minutes, seconds) {
  const totalSeconds = minutes * 60 + seconds;

  if (totalSeconds <= 0) {
    return 0;
  }

  const multiplier = partyExpMultiplier[partySize];

  const expReceivedPerRun = expPerRun * multiplier;

  const runsPerHour = 3600 / totalSeconds;

  return expReceivedPerRun * runsPerHour;
}
