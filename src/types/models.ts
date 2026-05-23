export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  success: boolean;
  token: string;
  user: User;
};

export type Destination = {
  id: string;
  name: string;
  country: string;
  description: string;
  latitude: number;
  longitude: number;
  tags: string[];
};

export type ItineraryActivity = {
  time: string;
  title: string;
  description: string;
  location: string;
  estimatedCost: number;
};

export type ItineraryDay = {
  day: number;
  title: string;
  summary: string;
  activities: ItineraryActivity[];
};

export type Itinerary = {
  _id: string;
  destination: string;
  budget: number;
  duration: number;
  preferences: string[];
  overview: string;
  days: ItineraryDay[];
  trip?: string | null;
  createdAt: string;
};

export type Trip = {
  _id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  preferences: string[];
  notes: string;
  status: "draft" | "planned" | "booked";
  location: {
    latitude: number;
    longitude: number;
  };
  itinerary?: Itinerary | null;
  createdAt: string;
  updatedAt?: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

export type ChatSession = {
  _id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
};
