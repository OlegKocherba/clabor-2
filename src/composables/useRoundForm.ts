import { ref, computed, watch } from 'vue';
import type { TeamIndex, RoundFormState, RoundDeclarations } from '@/types/game';
import { computePool } from '@/stores/gameStore';

export const useRoundForm = () => {
  const playedBy = ref<TeamIndex>(0);

  const declarations = ref<RoundDeclarations>({
    tierces: 0,
    poltinas: 0,
    hasBela: false,
  });

  const rawPoints = ref<[number | null, number | null]>([null, null]);
  const noTricks = ref<[boolean, boolean]>([false, false]);

  const pool = computed(() => computePool(declarations.value));

  // Entering points for one team auto-fills the other
  const setPointsForTeam = (teamIndex: TeamIndex, value: number | null) => {
    const otherIndex: TeamIndex = teamIndex === 0 ? 1 : 0;
    rawPoints.value[teamIndex] = value;
    if (value !== null && !isNaN(value) && value >= 0) {
      const other = pool.value - value;
      rawPoints.value[otherIndex] = other >= 0 ? other : null;
    } else {
      rawPoints.value[otherIndex] = null;
    }
  }

  // No-tricks toggle enabled only when that team's raw score is exactly 0
  const noTricksEnabled = computed<[boolean, boolean]>(() => [rawPoints.value[0] === 0, rawPoints.value[1] === 0]);

  // Auto-disable no-tricks if score moves away from 0
  watch(
    () => rawPoints.value[0],
    (v) => {
      if (v !== 0) noTricks.value[0] = false;
    },
  );
  watch(
    () => rawPoints.value[1],
    (v) => {
      if (v !== 0) noTricks.value[1] = false;
    },
  );

  const isValid = computed(() => {
    const [p0, p1] = rawPoints.value;
    if (p0 === null || p1 === null) return false;
    if (isNaN(p0) || isNaN(p1)) return false;
    if (p0 < 0 || p1 < 0) return false;
    if (p0 + p1 !== pool.value) return false;
    return true;
  });

  const reset = () => {
    playedBy.value = 0;
    declarations.value = { tierces: 0, poltinas: 0, hasBela: false };
    rawPoints.value = [null, null];
    noTricks.value = [false, false];
  }

  const toFormState = (): RoundFormState => {
    return {
      playedBy: playedBy.value,
      declarations: { ...declarations.value },
      rawPoints: rawPoints.value as [number, number],
      noTricks: noTricks.value,
    };
  }

  return {
    playedBy,
    declarations,
    rawPoints,
    noTricks,
    pool,
    noTricksEnabled,
    isValid,
    setPointsForTeam,
    reset,
    toFormState,
  };
}
