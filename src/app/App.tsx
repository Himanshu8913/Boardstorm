import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/app/AppRouter';
import { SplashScreen } from '@/components/splash';
import { useSplashLoader } from '@/hooks/useSplashLoader';

export function App() {
  const { progress, phase, isVisible, skip } = useSplashLoader();

  return (
    <BrowserRouter>
      <AppRouter />
      {isVisible && (
        <SplashScreen
          progress={progress}
          exiting={phase === 'exiting'}
          onSkip={skip}
        />
      )}
    </BrowserRouter>
  );
}
