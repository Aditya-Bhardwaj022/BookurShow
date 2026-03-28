import type { Movie, Theatre, Screen, Show, User, ShowSeat, BookingRequestPayload } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// --- Movies ---
export async function fetchMovies(): Promise<Movie[]> {
  const res = await fetch(`${API_BASE}/movies`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch movies');
  const result = await res.json();
  return result.data || result;
}

export async function fetchMovieById(id: number): Promise<Movie> {
  const res = await fetch(`${API_BASE}/movies/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch movie');
  const result = await res.json();
  return result.data || result;
}

export async function createMovie(movieData: Partial<Movie>): Promise<Movie> {
  const res = await fetch(`${API_BASE}/movies`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(movieData),
  });
  if (!res.ok) throw new Error('Failed to create movie');
  const result = await res.json();
  return result.data || result;
}

// --- Theatres ---
export async function fetchTheatres(): Promise<Theatre[]> {
  const res = await fetch(`${API_BASE}/theatres`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch theatres');
  const result = await res.json();
  return result.data || result;
}

export async function fetchTheatresByCity(city: string): Promise<Theatre[]> {
  const res = await fetch(`${API_BASE}/theatres/city/${city}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch theatres');
  const result = await res.json();
  return result.data || result;
}

export async function createTheatre(theatreData: Partial<Theatre>): Promise<Theatre> {
  const res = await fetch(`${API_BASE}/theatres`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(theatreData),
  });
  if (!res.ok) throw new Error('Failed to create theatre');
  const result = await res.json();
  return result.data || result;
}

export async function updateTheatre(id: number, theatreData: Partial<Theatre>): Promise<Theatre> {
  const res = await fetch(`${API_BASE}/theatres/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(theatreData),
  });
  if (!res.ok) throw new Error('Failed to update theatre');
  const result = await res.json();
  return result.data || result;
}

export async function deleteTheatre(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/theatres/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete theatre');
}

// --- Screens ---
export async function fetchScreens(): Promise<Screen[]> {
  const res = await fetch(`${API_BASE}/screens`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch screens');
  const result = await res.json();
  return result.data || result;
}

export async function createScreen(screenData: { name: string; totalseats: number; seatsPerRow: number; theatre: { id: number } }): Promise<Screen> {
  const res = await fetch(`${API_BASE}/screens`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(screenData),
  });
  if (!res.ok) throw new Error('Failed to create screen');
  const result = await res.json();
  return result.data || result;
}

// --- Shows ---
export async function fetchAllShows(): Promise<Show[]> {
  const res = await fetch(`${API_BASE}/shows`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch shows');
  const result = await res.json();
  return result.data || result;
}

export async function fetchShowsByMovie(movieId: number): Promise<Show[]> {
  const res = await fetch(`${API_BASE}/shows/movie/${movieId}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch shows');
  const result = await res.json();
  return result.data || result;
}

export async function createShow(showData: { startTime: string; endTime: string; movie: { id: number }; screen: { id: number } }): Promise<Show> {
  const res = await fetch(`${API_BASE}/shows`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(showData),
  });
  if (!res.ok) throw new Error('Failed to create show');
  const result = await res.json();
  return result.data || result;
}

export async function fetchShowSeats(showId: number): Promise<ShowSeat[]> {
  const res = await fetch(`${API_BASE}/show-seats/show/${showId}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch show seats');
  const result = await res.json();
  return result.data || result;
}

// --- Users ---
export async function fetchUserById(id: number): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch user');
  const result = await res.json();
  return result.data || result;
}

export async function updateUser(id: number, userData: Partial<User>): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error('Failed to update user');
  const result = await res.json();
  return result.data || result;
}

// --- Bookings ---
export async function createBooking(bookingRequest: BookingRequestPayload) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingRequest),
  });
  if (!res.ok) throw new Error('Failed to create booking');
  const result = await res.json();
  return result.data || result;
}
