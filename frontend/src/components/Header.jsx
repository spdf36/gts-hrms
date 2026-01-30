import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-10">
      {/* Left side (Page Title placeholder) */}
      <h2 className="text-xl font-semibold text-gts-primary">Overview</h2>

      {/* Right side (User Profile) */}
      <div className="flex items-center space-x-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gts-primary">{user?.name}</p>
          <p className="text-xs text-gts-muted uppercase">{user?.role}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-gts-accent flex items-center justify-center text-white font-bold text-lg">
          {user?.name?.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Header;