export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: Role;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  language: string;
  genre: string;
  durationMins: number;
  releaseDate: string;
  posterUrl?: string;
}

export interface Theatre {
  id: number;
  name: string;
  address: string;
  city: string;
  totalScreens: number;
}

export interface Screen {
  id: number;
  name: string;
  totalseats: number;
  seatsPerRow: number;
  theatre?: Theatre;
}

export interface Show {
  id: number;
  startTime: string;
  endTime: string;
  movie: Movie;
  screen: Screen;
  availableSeats?: number;
}

export interface ShowRequest {
  startTime: string;
  endTime: string;
  movieId: number;
  screenId: number;
}

export interface AuthResponse {
  token: string;
  roles: string[];
  name: string;
  id: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Seat {
  id: number;
  seatNumber: string;
  seatType: string;
  basePrice: number;
}

export interface ShowSeat {
  id: number;
  seat: Seat;
  status: string;
  price: number;
}

export interface BookingRequestPayload {
  userId: number;
  showId: number;
  seatIds: number[];
  paymentMethod: string;
}
