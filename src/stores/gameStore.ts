import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { GameState, Round, TeamIndex, GameFormat, RoundFormState, RoundDeclarations } from '@/types/game';

const STORAGE_KEY = 'clabor_game_state';

// ── Pure scoring functions ────────────────────────────────────────────────────

export function computePool(declarations: RoundDeclarations): number {
  return 162 + declarations.tierces * 20 + declarations.poltinas * 50 + (declarations.hasBela ? 20 : 0);
}

export function computeBaitPenalty(baitCount: number): number {
  if (baitCount >= 6) return -200;
  if (baitCount >= 3) return -100;
  return 0;
}

export function resolveRound(
  playedBy: TeamIndex,
  rawPoints: [number, number],
  pool: number,
  noTricks: [boolean, boolean],
  carryOver: number,
): Pick<Round, 'finalScores' | 'isBait' | 'isDraw'> {
  const opponentIndex: TeamIndex = playedBy === 0 ? 1 : 0;
  const declaringScore = rawPoints[playedBy];
  const opponentScore = rawPoints[opponentIndex];

  const finalScores: [number, number] = [0, 0];
  let isBait = false;
  let isDraw = false;

  if (declaringScore === opponentScore) {
    isDraw = true;
    finalScores[opponentIndex] = opponentScore;
    finalScores[playedBy] = 0; // hung, carry over
  } else if (declaringScore <= opponentScore) {
    isBait = true;
    finalScores[opponentIndex] = pool + carryOver;
    finalScores[playedBy] = 0;
  } else {
    finalScores[playedBy] = declaringScore + carryOver;
    finalScores[opponentIndex] = opponentScore;
  }

  // No-tricks penalty: -100 for any team that took zero tricks
  if (noTricks[0]) finalScores[0] -= 100;
  if (noTricks[1]) finalScores[1] -= 100;

  return { finalScores, isBait, isDraw };
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useGameStore = defineStore('game', () => {
  const teamNames = ref<[string, string]>(['Мы', 'Они']);
  const gameFormat = ref<GameFormat>(1001);
  const rounds = ref<Round[]>([]);
  const carryOver = ref<number>(0);
  const isActive = ref<boolean>(false);

  // ── Persistence ──

  function saveToStorage() {
    const state: GameState = {
      teamNames: teamNames.value,
      gameFormat: gameFormat.value,
      rounds: rounds.value,
      carryOver: carryOver.value,
      isActive: isActive.value,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const state: GameState = JSON.parse(raw);
      teamNames.value = state.teamNames;
      gameFormat.value = state.gameFormat;
      rounds.value = state.rounds;
      carryOver.value = state.carryOver;
      isActive.value = state.isActive;
    } catch {
      // corrupted storage — ignore
    }
  }

  // ── Computed ──

  const totals = computed<[number, number]>(() => {
    const acc: [number, number] = [0, 0];
    for (const r of rounds.value) {
      acc[0] += r.finalScores[0];
      acc[1] += r.finalScores[1];
    }
    return acc;
  });

  const baitCounts = computed<[number, number]>(() => {
    const counts: [number, number] = [0, 0];
    for (const r of rounds.value) {
      if (r.isBait) counts[r.playedBy]++;
    }
    return counts;
  });

  const totalsWithPenalties = computed<[number, number]>(() => [
    totals.value[0] + computeBaitPenalty(baitCounts.value[0]),
    totals.value[1] + computeBaitPenalty(baitCounts.value[1]),
  ]);

  const winner = computed<TeamIndex | null>(() => {
    const target = gameFormat.value;
    if (totalsWithPenalties.value[0] >= target) return 0;
    if (totalsWithPenalties.value[1] >= target) return 1;
    return null;
  });

  // ── Actions ──

  function setupGame(names: [string, string], format: GameFormat) {
    teamNames.value = names;
    gameFormat.value = format;
    rounds.value = [];
    carryOver.value = 0;
    isActive.value = true;
    saveToStorage();
  }

  function addRound(form: RoundFormState) {
    const pool = computePool(form.declarations);
    const raw = form.rawPoints as [number, number];
    const resolved = resolveRound(form.playedBy, raw, pool, form.noTricks, carryOver.value);

    const round: Round = {
      id: crypto.randomUUID(),
      playedBy: form.playedBy,
      declarations: { ...form.declarations },
      pool,
      rawPoints: raw,
      noTricks: form.noTricks,
      carryOverApplied: carryOver.value,
      timestamp: Date.now(),
      ...resolved,
    };

    rounds.value.push(round);
    carryOver.value = resolved.isDraw ? raw[form.playedBy] : 0;
    saveToStorage();
  }

  function undoLastRound() {
    if (rounds.value.length === 0) return;
    const last = rounds.value[rounds.value.length - 1];
    rounds.value.pop();
    carryOver.value = last.carryOverApplied;
    saveToStorage();
  }

  function resetGame() {
    rounds.value = [];
    carryOver.value = 0;
    isActive.value = false;
    saveToStorage();
  }

  // Initialize from storage on store creation
  loadFromStorage();

  return {
    // state
    teamNames,
    gameFormat,
    rounds,
    carryOver,
    isActive,
    // computed
    totals,
    baitCounts,
    totalsWithPenalties,
    winner,
    // actions
    setupGame,
    addRound,
    undoLastRound,
    resetGame,
  };
});
