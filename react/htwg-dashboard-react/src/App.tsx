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
import { GradesPage } from './components/grades/GradesPage';
import type { Course, LibraryStatus, Meal } from './types';
import { getCourses } from './api';

import { getLibraryStatus } from './api';

const libraryStatus: LibraryStatus = {
  loadPercentage: 65,
  freeSeats: 42,
  totalSeats: 120,
};

const AuthenticatedApp = () => {
  const { user, token, logout } = useAuth();
  const location = useLocation();
  const [courses, setCourses] = useState<Course[]>([]);
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

  useEffect(() => {
    if (!token) return;
    
    const controller = new AbortController();
    
    getCourses(token, controller.signal)
      .then(setCourses)
      .catch((err) => {
         if (!controller.signal.aborted) console.error("Fehler beim Kurse laden:", err);
      });

    return () => controller.abort();
  }, [token]);

  const [libStatus, setLibStatus] = useState<LibraryStatus>({
    loadPercentage: 0,
    freeSeats: 0,
    totalSeats: 200,
  });


  const retryMeals = () => {
    setMealsLoading(true);
    setMealsError(null);
    setMealsRequestVersion((version) => version + 1);
  };

  const pageTitle: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/stundenplan': 'Stundenplan',
    '/mensa': 'Mensa Speiseplan',
    '/bibliothek': 'Bibliothek',
    '/noten': 'Notenübersicht'
  };

  useEffect(() => {
    const controller = new AbortController();

    getLibraryStatus(controller.signal)
      .then(setLibStatus)
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.error("Fehler beim Laden der Bibliotheksdaten:", err);
        }
      });

    return () => controller.abort();
  }, []);

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
                bibStatus={libStatus}
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
          <Route path="bibliothek" element={<LibPage status={libStatus} />} />
          <Route path="noten" element={<GradesPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, isRestoring } = useAuth();

  // Solange der Token geprueft wird, darf noch nicht auf /login umgeleitet werden.
  if (isRestoring) {
    return <p className="fetch-status">Sitzung wird wiederhergestellt...</p>;
  }

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
