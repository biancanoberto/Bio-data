import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { LoadingState } from '../components/common/PageState';

const AnimalDetailPage = lazy(() =>
  import('../pages/AnimalDetailPage').then((module) => ({
    default: module.AnimalDetailPage,
  })),
);
const AnimalFormPage = lazy(() =>
  import('../pages/AnimalFormPage').then((module) => ({
    default: module.AnimalFormPage,
  })),
);
const AnimalsPage = lazy(() =>
  import('../pages/AnimalsPage').then((module) => ({
    default: module.AnimalsPage,
  })),
);
const DashboardPage = lazy(() =>
  import('../pages/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
);

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingState label="Carregando tela..." />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route element={<AnimalsPage />} index />
          <Route element={<DashboardPage />} path="dashboard" />
          <Route element={<AnimalFormPage mode="create" />} path="animals/new" />
          <Route element={<AnimalDetailPage />} path="animals/:id" />
          <Route element={<AnimalFormPage mode="edit" />} path="animals/:id/edit" />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Route>
      </Routes>
    </Suspense>
  );
}
