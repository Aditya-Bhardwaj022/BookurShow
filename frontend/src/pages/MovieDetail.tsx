import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieById, fetchShowsByMovie, fetchShowSeats, createBooking } from '../lib/api';
import type { Movie, Show, ShowSeat } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tv } from 'lucide-react';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [showSeats, setShowSeats] = useState<ShowSeat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
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

  const handleShowSelect = async (show: Show) => {
    setSelectedShow(show);
    setBookingSuccess(false);
    setSelectedSeatIds([]);
    setLoadingSeats(true);
    try {
      const seats = await fetchShowSeats(show.id);
      // Logically sort seats (A1, A2, A3... then B1, B2...)
      const sortedSeats = [...seats].sort((a, b) => {
        const numA = parseInt(a.seat.seatNumber.substring(1)) || 0;
        const numB = parseInt(b.seat.seatNumber.substring(1)) || 0;
        const charA = a.seat.seatNumber[0];
        const charB = b.seat.seatNumber[0];
        if (charA !== charB) return charA.localeCompare(charB);
        return numA - numB;
      });
      setShowSeats(sortedSeats);
    } catch (e: unknown) {
      setError('Failed to load seats for this show');
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleBook = async () => {
    if (!selectedShow || selectedSeatIds.length === 0) return;
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    setBooking(true);
    setError('');
    try {
      const userId = Number(localStorage.getItem('userId') || 1);
      await createBooking({ 
        showId: selectedShow.id, 
        userId, 
        seatIds: selectedSeatIds,
        paymentMethod: 'CREDIT_CARD'
      });
      setBookingSuccess(true);
      setSelectedShow(null);
      setSelectedSeatIds([]);
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
                if (!isLoggedIn) {
                  window.location.href = '/login';
                  return;
                }
                handleShowSelect(show);
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
        <Card className="border-primary shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Select Seats</CardTitle>
            <p className="text-sm text-muted-foreground">
              {movie.title} — {selectedShow.screen?.theatre?.name}, {selectedShow.screen?.theatre?.city}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {loadingSeats ? (
              <div className="text-center text-sm py-4">Loading seat map...</div>
            ) : showSeats.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/30">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                    <Tv className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Seat Map Not Ready</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                    The theater layout for this screen is being initialized. Please try again in a few moments.
                </p>
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                    <Button variant="default" onClick={() => handleShowSelect(selectedShow)}>
                      Refresh Seat Map
                    </Button>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        Admin Fix: Visit Dashboard to trigger repair
                    </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="w-full bg-muted text-center text-xs py-1 mb-8 rounded shadow-inner">SCREEN THIS WAY</div>
                <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                  {showSeats.map((ss) => {
                     const isSelected = selectedSeatIds.includes(ss.id);
                     const isAvailable = ss.status === 'AVAILABLE';
                     return (
                       <button
                         key={ss.id}
                         disabled={!isAvailable}
                         onClick={() => {
                            if (isSelected) {
                              setSelectedSeatIds(prev => prev.filter(id => id !== ss.id));
                            } else {
                              setSelectedSeatIds(prev => [...prev, ss.id]);
                            }
                         }}
                         className={`w-10 h-10 sm:w-12 sm:h-12 rounded text-xs font-semibold flex flex-col items-center justify-center transition-all border ${
                           !isAvailable 
                             ? 'bg-muted text-muted-foreground opacity-30 cursor-not-allowed' 
                             : isSelected 
                               ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-md' 
                               : 'bg-background hover:border-primary border-border cursor-pointer hover:shadow-sm'
                         }`}
                         title={`₹${ss.price}`}
                       >
                         {ss.seat.seatNumber}
                       </button>
                     );
                  })}
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-10 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border border-border bg-background"></div> Available</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-primary"></div> Selected</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-muted opacity-30"></div> Unavailable</div>
                </div>
              </div>
            )}

            <div className="pt-6 mt-6 border-t flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                 <span className="text-sm font-medium">Selected Tickets: {selectedSeatIds.length}</span>
                 {selectedSeatIds.length > 0 && (
                   <span className="text-lg ml-6 font-bold text-primary">
                     Total: ₹{showSeats.filter(s => selectedSeatIds.includes(s.id)).reduce((sum, s) => sum + s.price, 0).toFixed(2)}
                   </span>
                 )}
              </div>
              {isLoggedIn ? (
                <Button 
                   onClick={handleBook} 
                   disabled={booking || selectedSeatIds.length === 0} 
                   className="w-full sm:w-auto min-w-[150px]"
                >
                  {booking ? 'Processing...' : 'Confirm & Pay'}
                </Button>
              ) : (
                <Button onClick={() => window.location.href = '/login'} className="w-full sm:w-auto min-w-[150px]">
                  Login to Book
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
