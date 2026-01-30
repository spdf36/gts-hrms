import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex bg-gts-surface min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8 mt-16">
           {/* Outlet renders the current page (e.g., Dashboard or Profile) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;