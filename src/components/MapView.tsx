import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import type { EventItem } from "../types/event";

type MapViewProps = {
  events: EventItem[];
  hoveredEventId: string | null;
  selectedEventId: string | null;
  onMarkerHover: (eventId: string | null) => void;
  onMarkerClick: (eventId: string) => void;
};

const defaultCenter: [number, number] = [20, 0];

type MapCenterControllerProps = {
  selectedEvent: EventItem | undefined;
};

function MapCenterController({ selectedEvent }: MapCenterControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (!selectedEvent) {
      return;
    }

    map.flyTo(
      [selectedEvent.coordinates.lat, selectedEvent.coordinates.lng],
      Math.max(map.getZoom(), 5),
      { duration: 0.6 }
    );
  }, [map, selectedEvent]);

  return null;
}

function MapView({
  events,
  hoveredEventId,
  selectedEventId,
  onMarkerHover,
  onMarkerClick,
}: MapViewProps) {
  const selectedEvent = events.find((eventItem) => eventItem.id === selectedEventId);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={2}
      scrollWheelZoom
      className="map-canvas"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapCenterController selectedEvent={selectedEvent} />
      {events.map((eventItem) => (
        <CircleMarker
          key={eventItem.id}
          center={[eventItem.coordinates.lat, eventItem.coordinates.lng]}
          radius={
            selectedEventId === eventItem.id ? 12 : hoveredEventId === eventItem.id ? 11 : 7
          }
          pathOptions={{
            color:
              selectedEventId === eventItem.id
                ? "#0b3aa6"
                : hoveredEventId === eventItem.id
                  ? "#0b3aa6"
                  : "#0f172a",
            fillColor:
              selectedEventId === eventItem.id
                ? "#2563eb"
                : hoveredEventId === eventItem.id
                  ? "#2563eb"
                  : "#1d4ed8",
            fillOpacity: selectedEventId === eventItem.id || hoveredEventId === eventItem.id ? 1 : 0.85,
          }}
          eventHandlers={{
            mouseover: () => onMarkerHover(eventItem.id),
            mouseout: () => onMarkerHover(null),
            click: () => onMarkerClick(eventItem.id),
          }}
        >
          <Popup>
            <div>
              <strong>{eventItem.title}</strong>
              <p>{eventItem.description}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default MapView;
