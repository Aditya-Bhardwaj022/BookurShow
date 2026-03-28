import { useState, useEffect } from 'react';
import { fetchMovies, fetchTheatres, fetchScreens, createScreen, fetchAllShows, createShow } from '../lib/api';
import type { Movie, Theatre, Screen, Show } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tv, Calendar } from 'lucide-react';

export default function AdminShows() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [showAddShow, setShowAddShow] = useState(false);

  const [newScreen, setNewScreen] = useState({
    name: '',
    totalSeats: 100,
    seatsPerRow: 10,
    theatreId: 0,
  });

  const [newShow, setNewShow] = useState({
    movieId: 0,
    screenId: 0,
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [m, t, s, sh] = await Promise.all([
        fetchMovies(),
        fetchTheatres(),
        fetchScreens(),
        fetchAllShows(),
      ]);
      setMovies(m);
      setTheatres(t);
      setScreens(s);
      setShows(sh);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScreen = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createScreen({
        name: newScreen.name,
        totalSeats: newScreen.totalSeats,
        seatsPerRow: newScreen.seatsPerRow,
        theatre: { id: newScreen.theatreId },
      });
      setShowAddScreen(false);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddShow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createShow({
        startTime: newShow.startTime,
        endTime: newShow.endTime,
        movie: { id: newShow.movieId },
        screen: { id: newShow.screenId },
      });
      setShowAddShow(false);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shows & Screens</h1>
          <p className="text-muted-foreground text-lg">Manage cinema scheduling and set up your screens.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setShowAddScreen(!showAddScreen)}>
            {showAddScreen ? 'Cancel Screen' : 'Add Screen'}
          </Button>
          <Button onClick={() => setShowAddShow(!showAddShow)}>
            {showAddShow ? 'Cancel Show' : 'Add Show'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Forms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {showAddScreen && (
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-primary" /> New Screen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddScreen} className="space-y-4">
                <div className="space-y-2">
                  <Label>Screen Name</Label>
                  <Input
                    value={newScreen.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewScreen({ ...newScreen, name: e.target.value })}
                    placeholder="e.g. Screen 1, IMAX"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Total Seats</Label>
                    <Input
                      type="number"
                      value={newScreen.totalSeats}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewScreen({ ...newScreen, totalSeats: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Seats Per Row</Label>
                    <Input
                      type="number"
                      value={newScreen.seatsPerRow}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewScreen({ ...newScreen, seatsPerRow: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Theatre</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={newScreen.theatreId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewScreen({ ...newScreen, theatreId: Number(e.target.value) })}
                    required
                  >
                    <option value={0}>Select Theatre...</option>
                    {theatres.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="w-full">Create Screen</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {showAddShow && (
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> New Show
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddShow} className="space-y-4">
                <div className="space-y-2">
                  <Label>Movie</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newShow.movieId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewShow({ ...newShow, movieId: Number(e.target.value) })}
                    required
                  >
                    <option value={0}>Select Movie...</option>
                    {movies.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Screen</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newShow.screenId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewShow({ ...newShow, screenId: Number(e.target.value) })}
                    required
                  >
                    <option value={0}>Select Screen...</option>
                    {screens.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} - {s.theatre?.name} ({s.theatre?.city})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="datetime-local"
                      value={newShow.startTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewShow({ ...newShow, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="datetime-local"
                      value={newShow.endTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewShow({ ...newShow, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">Schedule Show</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Shows Listing */}
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-primary" /> Active Shows
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {shows.map((s) => (
          <Card key={s.id} className="border-border/60 hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-primary">{s.movie?.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 font-medium text-foreground">
                <Tv className="w-3 h-3" /> {s.screen?.name} · {s.screen?.theatre?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Starts:</span>
                <span>{new Date(s.startTime).toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Ends:</span>
                <span>{new Date(s.endTime).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Screens Listing */}
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Tv className="w-6 h-6 text-primary" /> Configured Screens
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {screens.map((sc) => (
          <div key={sc.id} className="p-4 rounded-xl border bg-card/50 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Tv className="w-5 h-5" />
            </div>
            <h4 className="font-semibold">{sc.name}</h4>
            <p className="text-xs text-muted-foreground mb-2">{sc.theatre?.name} · {sc.theatre?.city}</p>
            <div className="flex gap-3 text-xs font-medium">
              <span>{sc.totalSeats} seats</span>
              <span className="text-muted-foreground">|</span>
              <span>{sc.seatsPerRow} per row</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
