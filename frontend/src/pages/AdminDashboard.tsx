import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function AdminDashboard() {
  const adminOptions = [
    {
      title: 'Movies',
      description: 'Add and manage movie listings',
      link: '/admin/movies/new',
      icon: '🎬',
    },
    {
      title: 'Theatres',
      description: 'Manage theatre locations and cities',
      link: '/admin/theatres',
      icon: '🏢',
    },
    {
      title: 'Shows & Screens',
      description: 'Schedule movie shows and manage screens',
      link: '/admin/shows',
      icon: '📅',
    },
  ];

  // Simple role check
  const userRole = localStorage.getItem('role');
  if (userRole !== 'ADMIN' && userRole !== 'ROLE_ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500">
        Access Denied: Admin only.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground text-lg">Manage theaters, movies, and show timing from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adminOptions.map((option) => (
          <Card key={option.title} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
            <CardHeader className="pb-2">
              <div className="text-4xl mb-2">{option.icon}</div>
              <CardTitle>{option.title}</CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to={option.link}>Manage {option.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
