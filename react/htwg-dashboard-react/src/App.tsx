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
import type { Course, LibraryStatus, Meal, Grade } from './types';
import { getCourses, getGrades, addCourse, deleteCourse } from './api';

import { getLibraryStatus } from './api';

const libraryStatus: LibraryStatus = {
  loadPercentage: 65,
  freeSeats: 42,
  totalSeats: 200,
};

const AuthenticatedApp = () => {
  const { user, token, logout } = useAuth();
  const location = useLocation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealsLoading, setMealsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [mealsError, setMealsError] = useState<string | null>(null);
  const [mealsRequestVersion, setMealsRequestVersion] = useState(0);

  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector('.content')?.scrollTo(0, 0);
  }, [location.pathname]);
  

  useEffect(() => {
    const controller = new AbortController();

    getMeals(isDemoMode, controller.signal)
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
  }, [mealsRequestVersion, isDemoMode]);

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

  const handleDeleteCourse = async (courseId: string) => {
    if (!token) return;
    try {
      await deleteCourse(token, courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  };

  const handleAddCourse = async (courseData: Partial<Course>) => {
  if (!token) return;
    try {
      const newCourse = await addCourse(token, courseData);
      setCourses(prev => [...prev, newCourse]);
    } catch (error) {
      console.error("Fehler beim Hinzufügen:", error);
    }
  };  


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
    '/noten': 'Notenübersicht'
  };

  const [grades, setGrades] = useState<Grade[]>([]);

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

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    getGrades(token, controller.signal)
      .then(setGrades)
      .catch((err) => {
        if (!controller.signal.aborted) console.error("Fehler beim Noten laden:", err);
      });

    return () => controller.abort();
  }, [token]);

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
                grades={grades}
              />
            }
          />
          <Route path="timetable" element={<TimetablePage courses={courses} onAddCourse={handleAddCourse} onDeleteCourse={handleDeleteCourse}/>} />
          <Route
            path="mensa"
            element={
              <MensaPage
                meals={meals}
                isLoading={mealsLoading}
                error={mealsError}
                onRetry={retryMeals}
                isDemoMode={isDemoMode}
                onToggleDemo={() => setIsDemoMode((prev) => !prev)}
              />
            }
          />
          <Route path="bibliothek" element={<LibPage status={libStatus} />} />
          <Route path="noten" element={<GradesPage courses={courses} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, isRestoring } = useAuth();

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
