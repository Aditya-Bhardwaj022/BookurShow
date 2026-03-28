import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieById, fetchShowsByMovie, createBooking } from '../lib/api';
import type { Movie, Show } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [seats, setSeats] = useState(1);
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (!id) return;
    const movieId = Number(id);
    Promise.all([fetchMovieById(movieId), fetchShowsByMovie(movieId)])
      .then(([m, s]) => {
        setMovie(m);
        setShows(s);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!selectedShow) return;
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setBooking(true);
    setError('');
    try {
      const userId = Number(localStorage.getItem('userId') || 1);
      await createBooking({ showId: selectedShow.id, userId, numberOfSeats: seats });
      setBookingSuccess(true);
      setSelectedShow(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Loading...</div>;
  }
  if (!movie) {
    return <div className="flex items-center justify-center min-h-[60vh] text-red-500">Movie not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">{movie.title}</h1>
        <p className="text-muted-foreground mb-1">{movie.genre} · {movie.language} · {movie.durationMins} min</p>
        <p className="text-sm mt-4 leading-relaxed">{movie.description}</p>
      </div>

      {bookingSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-md p-4">
          🎉 Booking confirmed! Enjoy the movie.
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
          {error}
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Available Shows</h2>
      {shows.length === 0 ? (
        <p className="text-muted-foreground">No shows available for this movie.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {shows.map((show) => (
            <Card
              key={show.id}
              className={`cursor-pointer border-2 transition-colors ${
                selectedShow?.id === show.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => {
                setSelectedShow(show);
                setBookingSuccess(false);
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{show.screen?.theatre?.name || 'Grand Cinema'}</CardTitle>
                <div className="text-xs text-muted-foreground">{show.screen?.theatre?.city || 'Location'}</div>
              </CardHeader>
              <CardContent className="pt-0 space-y-1 text-sm">
                <p>🕐 {new Date(show.startTime).toLocaleString()}</p>
                <p>💺 {show.availableSeats ?? 0} seats available</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedShow && (
        <Card className="border-primary shadow-lg">
          <CardHeader>
            <CardTitle>Confirm Booking</CardTitle>
            <p className="text-sm text-muted-foreground">
              {movie.title} — {selectedShow.screen?.theatre?.name}, {selectedShow.screen?.theatre?.city}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seats">Number of Seats</Label>
              <Input
                id="seats"
                type="number"
                min={1}
                max={selectedShow.availableSeats || 20}
                value={seats}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeats(Number(e.target.value))}
                className="w-32"
              />
            </div>
            {isLoggedIn ? (
              <Button onClick={handleBook} disabled={booking} className="w-full">
                {booking ? 'Booking...' : 'Confirm & Book'}
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} className="w-full">
                Login to Book
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
