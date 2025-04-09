import AreaPage from '@/pages/areas';
import ChangePasswordPage from '@/pages/auth/change-password';
import CityPage from '@/pages/cities';
import CountryPage from '@/pages/countries';
import DriverPage from '@/pages/drivers';
import NotFound from '@/pages/not-found';
import RolesPage from '@/pages/roles';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

const DashboardLayout = lazy(
  () => import('@/components/layout/dashboard-layout')
);
const SignInPage = lazy(() => import('@/pages/auth/signin'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));

export default function AppRouter() {
  const dashboardRoutes = [
    {
      path: '/',
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: <DashboardPage />,
          index: true
        },
        {
          path: 'countries',
          element: <CountryPage />
        },
        {
          path: 'cities',
          element: <CityPage />
        },
        {
          path: 'areas',
          element: <AreaPage />
        },
        {
          path: 'drivers',
          element: <DriverPage />
        },
        {
          path: 'roles',
          element: <RolesPage />
        },
        {
          path: '/change-password',
          element: <ChangePasswordPage />,
          index: true
        }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/login',
      element: <SignInPage />,
      index: true
    },

    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}
