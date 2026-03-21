import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMovies } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Movie {
  id: number;
  title: string;
  genre: string;
  description: string;
  durationMinutes: number;
  language: string;
  releaseDate: string;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovies()
      .then(setMovies)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground text-lg">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Could not load movies</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-muted-foreground text-lg">No movies available yet.</p>
        {localStorage.getItem('role') === 'ADMIN' && (
          <Button asChild>
            <Link to="/admin/movies/new">Add a Movie</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Now Showing</h1>
        {localStorage.getItem('role') === 'ADMIN' && (
          <Button asChild variant="outline">
            <Link to="/admin/movies/new">+ Add Movie</Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Card key={movie.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg leading-snug">{movie.title}</CardTitle>
              <CardDescription>
                {movie.genre} · {movie.language}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-3">{movie.description}</p>
              <p className="text-xs mt-3 text-muted-foreground">
                ⏱ {movie.durationMinutes} min
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/movies/${movie.id}`}>Book Tickets</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
