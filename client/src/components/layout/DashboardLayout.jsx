import Sidebar from './Sidebar.jsx';
import MobileNavbar from './MobileNavbar.jsx';
import Navbar from './Navbar.jsx';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg">
      <div className="lg:hidden">
        <Navbar />
      </div>
      <div className="flex">
        <Sidebar />
        <main className="min-h-screen flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-10">{children}</main>
      </div>
      <MobileNavbar />
    </div>
  );
}
