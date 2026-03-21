const API_BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchMovies() {
  const res = await fetch(`${API_BASE}/movies`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch movies');
  return res.json();
}

export async function fetchMovieById(id: number) {
  const res = await fetch(`${API_BASE}/movies/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch movie');
  return res.json();
}

export async function fetchShowsByMovie(movieId: number) {
  const res = await fetch(`${API_BASE}/shows/movie/${movieId}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch shows');
  return res.json();
}

export async function fetchShowsByMovieAndCity(movieId: number, city: string) {
  const res = await fetch(`${API_BASE}/shows/movie/${movieId}/city/${city}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch shows');
  return res.json();
}

export async function createBooking(bookingRequest: { showId: number; userId: number; numberOfSeats: number }) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingRequest),
  });
  if (!res.ok) throw new Error('Failed to create booking');
  return res.json();
}

export async function createMovie(movieData: object) {
  const res = await fetch(`${API_BASE}/movies`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(movieData),
  });
  if (!res.ok) throw new Error('Failed to create movie');
  return res.json();
}
