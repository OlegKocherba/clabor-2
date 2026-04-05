import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';

export const useGameNavigation = () => {
  const router = useRouter();
  const gameStore = useGameStore();

  const goToLanding = () => router.push({ name: 'landing' });
  const goToSetup = () => router.push({ name: 'setup' });
  const goToRoundEntry = () => router.push({ name: 'round-entry' });
  const goToScoreboard = () => router.push({ name: 'scoreboard' });

  const requireActiveGame = (): boolean => {
    if (!gameStore.isActive) {
      goToLanding();
      return false;
    }
    return true;
  }

  return { goToLanding, goToSetup, goToRoundEntry, goToScoreboard, requireActiveGame };
}
