import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { getMeals } from './api';
import { useAuth } from './context/useAuth';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/Dashboard';
import { TimetablePage } from './components/timetable/TimetablePage';
import { MensaPage } from './components/mensa/MensaPage';
import { LibPage } from './components/library/LibPage';
import type { Course, LibraryStatus, Meal } from './types';

const courses: Course[] = [
  { id: '1', day: 'Dienstag', time: '8:00 - 9:30', subject: 'Programmiertechnik 2', room: 'Raum 101', isCurrent: false },
  { id: '2', day: 'Dienstag', time: '9:45 - 11:15', subject: 'Datenbanken', room: 'Raum 303', isCurrent: false },
  { id: '3', day: 'Donnerstag', time: '8:00 - 9:30', subject: 'Algebra', room: 'Raum 202', isCurrent: false },
  { id: '4', day: 'Donnerstag', time: '9:45 - 11:15', subject: 'Betriebssysteme', room: 'Raum 404', isCurrent: false },
  { id: '5', day: 'Montag', time: '11:30 - 13:00', subject: 'Software Engineering', room: 'Raum 505', isCurrent: true },
];

const libraryStatus: LibraryStatus = {
  loadPercentage: 65,
  freeSeats: 42,
  totalSeats: 120,
};

const AuthenticatedApp = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealsLoading, setMealsLoading] = useState(true);
  const [mealsError, setMealsError] = useState<string | null>(null);
  const [mealsRequestVersion, setMealsRequestVersion] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector('.content')?.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const controller = new AbortController();

    getMeals(controller.signal)
      .then(setMeals)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setMealsError(
            error instanceof Error ? error.message : 'Mensa-Daten konnten nicht geladen werden.',
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setMealsLoading(false);
        }
      });

    return () => controller.abort();
  }, [mealsRequestVersion]);

  const retryMeals = () => {
    setMealsLoading(true);
    setMealsError(null);
    setMealsRequestVersion((version) => version + 1);
  };

  const pageTitle: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/timetable': 'Stundenplan',
    '/mensa': 'Mensa Speiseplan',
    '/bibliothek': 'Bibliothek',
  };

  return (
    <div className="app-layout-root">
      <Header title={pageTitle[location.pathname] ?? 'Dashboard'} onLogout={logout} />

      <div className="content-wrapper">
        <Sidebar />

        <Routes>
          <Route
            path="dashboard"
            element={
              <DashboardPage
                username={user?.username ?? ''}
                courses={courses}
                meals={meals}
                mealsLoading={mealsLoading}
                mealsError={mealsError}
                bibStatus={libraryStatus}
              />
            }
          />
          <Route path="timetable" element={<TimetablePage courses={courses} />} />
          <Route
            path="mensa"
            element={
              <MensaPage
                meals={meals}
                isLoading={mealsLoading}
                error={mealsError}
                onRetry={retryMeals}
              />
            }
          />
          <Route path="bibliothek" element={<LibPage status={libraryStatus} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/*"
        element={isAuthenticated ? <AuthenticatedApp /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
