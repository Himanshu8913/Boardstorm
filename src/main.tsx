import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { hydrateSettingsStore } from '@/services/settingsPersistence';
import { initGameAudio } from '@/services/audio';
import { useGameStore } from '@/store/gameStore';
import '@/index.css';

hydrateSettingsStore((settings) => {
  useGameStore.getState().setSettings(settings);
});

initGameAudio();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
