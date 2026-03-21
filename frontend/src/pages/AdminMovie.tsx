import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMovie } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminMoviePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    genre: '',
    description: '',
    durationMinutes: '',
    language: '',
    releaseDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Guard: only ADMIN can access
  if (localStorage.getItem('role') !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500 text-center">
        <div>
          <p className="text-xl font-semibold">Access Denied</p>
          <p className="text-sm mt-1">Only admins can add movies.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createMovie({ ...form, durationMinutes: Number(form.durationMinutes) });
      navigate('/movies');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Movie</CardTitle>
          <CardDescription>Only visible to admins</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3">{error}</div>
            )}
            {[
              { label: 'Title', name: 'title', placeholder: 'e.g. Interstellar' },
              { label: 'Genre', name: 'genre', placeholder: 'e.g. Sci-Fi' },
              { label: 'Language', name: 'language', placeholder: 'e.g. English' },
              { label: 'Duration (minutes)', name: 'durationMinutes', placeholder: '140', type: 'number' },
              { label: 'Release Date', name: 'releaseDate', type: 'date' },
            ].map(({ label, name, placeholder, type = 'text' }) => (
              <div key={name} className="space-y-1">
                <Label htmlFor={name}>{label}</Label>
                <Input
                  id={name}
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            ))}
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Movie synopsis..."
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Movie'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
