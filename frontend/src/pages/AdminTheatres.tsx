import { useState, useEffect } from 'react';
import { fetchTheatres, createTheatre, deleteTheatre } from '../lib/api';
import type { Theatre } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Trash2, Plus, Building2 } from 'lucide-react';

export default function AdminTheatres() {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newTheatre, setNewTheatre] = useState({
    name: '',
    address: '',
    city: '',
    totalScreens: 1,
  });

  useEffect(() => {
    loadTheatres();
  }, []);

  const loadTheatres = async () => {
    try {
      const data = await fetchTheatres();
      setTheatres(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTheatre(newTheatre);
      setShowAdd(false);
      setNewTheatre({ name: '', address: '', city: '', totalScreens: 1 });
      loadTheatres();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this theatre?')) return;
    try {
      await deleteTheatre(id);
      loadTheatres();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Theatres</h1>
          <p className="text-muted-foreground">Add and organize your cinema locations.</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> Add Theatre</>}
        </Button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-md text-sm">
          {error}
        </div>
      )}

      {showAdd && (
        <Card className="mb-8 border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle>Add New Theatre</CardTitle>
            <CardDescription>Enter seat details and location for the new theatre.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Theatre Name</Label>
                <Input
                  id="name"
                  value={newTheatre.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTheatre({ ...newTheatre, name: e.target.value })}
                  placeholder="e.g. PVR Saket"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newTheatre.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTheatre({ ...newTheatre, city: e.target.value })}
                  placeholder="e.g. Delhi"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newTheatre.address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTheatre({ ...newTheatre, address: e.target.value })}
                  placeholder="Street address or mall name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="screens">Total Screens</Label>
                <Input
                  id="screens"
                  type="number"
                  min="1"
                  value={newTheatre.totalScreens}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTheatre({ ...newTheatre, totalScreens: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="flex items-end md:col-span-1">
                <Button type="submit" className="w-full">Create Theatre</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {theatres.map((t) => (
          <Card key={t.id} className="relative group overflow-hidden border-border/60 hover:border-primary/40 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{t.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{t.city}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-red-500 hover:bg-red-50"
                  onClick={() => handleDelete(t.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>📍 {t.address}</p>
                <p>🎞️ {t.totalScreens} Screens</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {theatres.length === 0 && !loading && (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <Building2 className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium">No theatres found</h3>
          <p className="text-muted-foreground">Click "Add Theatre" to get started.</p>
        </div>
      )}
    </div>
  );
}
