export type EventCategory = "A" | "B";

export interface EventCoordinates {
  lat: number;
  lng: number;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  address: string;
  country: string;
  coordinates: EventCoordinates;
  category: EventCategory;
}
