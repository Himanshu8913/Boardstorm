import '@/styles/home-brand.css';
import { Route, Routes } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { GamePage } from '@/pages/GamePage';
import { HomePage } from '@/pages/HomePage';
import { ModeSelectPage } from '@/pages/ModeSelectPage';
import { SettingsPage } from '@/pages/SettingsPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/modes" element={<ModeSelectPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
