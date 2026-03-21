import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import MoviesPage from './pages/Movies';
import MovieDetailPage from './pages/MovieDetail';
import AdminMoviePage from './pages/AdminMovie';
import { Button } from './components/ui/button';

function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const isLoggedIn = !!localStorage.getItem('token');

  // Sync with storage changes (e.g. after login)
  useEffect(() => {
    const sync = () => setUserName(localStorage.getItem('userName') || '');
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight">🎬 BookYourShow</span>
        </Link>
        <nav className="flex items-center space-x-3">
          <Button variant="ghost" asChild>
            <Link to="/movies">Movies</Link>
          </Button>
          {isLoggedIn ? (
            <>
              {userName && (
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Hi, {userName}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function HomePage() {
  const isLoggedIn = !!localStorage.getItem('token');
  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 container px-4 py-20 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl lg:text-7xl">
            Book Your Favorite Movies{' '}
            <span className="text-primary">In Seconds</span>
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Experience the ultimate cinema booking platform. Minimalistic, fast, and secure.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/movies">Browse Movies</Link>
            </Button>
            {!isLoggedIn && (
              <Button size="lg" variant="outline" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex items-center justify-center px-4 mx-auto">
          <p className="text-sm text-muted-foreground">© 2026 BookYourShow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/admin/movies/new" element={<AdminMoviePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
