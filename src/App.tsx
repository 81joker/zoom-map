import { useEffect, useMemo, useState } from "react";
import "./App.css";
import MapView from "./components/MapView";
import eventsData from "./data/events.json";
import type { EventCategory, EventItem } from "./types/event";

const events = eventsData as EventItem[];
type CategoryFilter = "All" | EventCategory;

function isValidEventItem(item: unknown): item is EventItem {
  if (!item || typeof item !== "object") {
    return false;
  }

  const candidate = item as Partial<EventItem>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.description === "string" &&
    typeof candidate.address === "string" &&
    typeof candidate.country === "string" &&
    typeof candidate.coordinates?.lat === "number" &&
    typeof candidate.coordinates?.lng === "number" &&
    (candidate.category === "A" || candidate.category === "B")
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => {
      const isValidDataset = Array.isArray(events) && events.every(isValidEventItem);
      if (!isValidDataset) {
        setErrorMessage("Event data could not be loaded. Please check dataset structure.");
      }
      setIsLoading(false);
    }, 300);

    return () => window.clearTimeout(loadingTimer);
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeCategory === "All") {
      return events;
    }
    return events.filter((eventItem) => eventItem.category === activeCategory);
  }, [activeCategory]);

  const selectedExistsInFiltered = filteredEvents.some(
    (eventItem) => eventItem.id === selectedEventId
  );

  const hasEmptyResults = !isLoading && !errorMessage && filteredEvents.length === 0;

  return (
    <div className="app">
      <header className="header">
        <h1>Zooom Event Map</h1>
        <p>Explore international air race events by map, list, and category.</p>
      </header>

      <section className="filter-panel" aria-label="Category filter">
        <span className="filter-label">Category</span>
        <div className="filter-buttons">
          <button
            type="button"
            className={activeCategory === "All" ? "active" : ""}
            onClick={() => setActiveCategory("All")}
          >
            All
          </button>
          <button
            type="button"
            className={activeCategory === "A" ? "active" : ""}
            onClick={() => setActiveCategory("A")}
          >
            A
          </button>
          <button
            type="button"
            className={activeCategory === "B" ? "active" : ""}
            onClick={() => setActiveCategory("B")}
          >
            B
          </button>
        </div>
      </section>

      <main className="content-grid">
        <section className="map-section" aria-label="Map section">
          <div className="section-head">
            <h2>Map</h2>
            <span>
              {isLoading
                ? "Loading event markers..."
                : `${filteredEvents.length} event markers are currently displayed.`}
            </span>
          </div>
          {errorMessage ? (
            <div className="state-box error-state">{errorMessage}</div>
          ) : isLoading ? (
            <div className="state-box loading-state">Loading map data...</div>
          ) : hasEmptyResults ? (
            <div className="state-box empty-state">
              No events found for category <strong>{activeCategory}</strong>.
            </div>
          ) : (
            <MapView
              events={filteredEvents}
              hoveredEventId={hoveredEventId}
              selectedEventId={selectedExistsInFiltered ? selectedEventId : null}
              onMarkerHover={setHoveredEventId}
              onMarkerClick={setSelectedEventId}
            />
          )}
        </section>

        <section className="list-section" aria-label="Event list section">
          <div className="section-head">
            <h2>Event List</h2>
            <span>
              {isLoading
                ? "Loading events..."
                : `${filteredEvents.length} events match the active category filter.`}
            </span>
          </div>
          {errorMessage ? (
            <div className="state-box error-state">{errorMessage}</div>
          ) : isLoading ? (
            <div className="state-box loading-state">Loading list data...</div>
          ) : hasEmptyResults ? (
            <div className="state-box empty-state">
              No list entries available for category <strong>{activeCategory}</strong>.
            </div>
          ) : (
            <ul className="event-list">
              {filteredEvents.map((eventItem) => (
                <li
                  key={eventItem.id}
                  className={`event-card ${hoveredEventId === eventItem.id ? "hovered" : ""} ${
                    selectedEventId === eventItem.id ? "selected" : ""
                  }`}
                  onMouseEnter={() => setHoveredEventId(eventItem.id)}
                  onMouseLeave={() => setHoveredEventId(null)}
                  onClick={() => setSelectedEventId(eventItem.id)}
                >
                  <div className="event-card-top">
                    <h3>{eventItem.title}</h3>
                    <span className="event-category">{eventItem.category}</span>
                  </div>
                  <p className="event-description">{eventItem.description}</p>
                  <p className="event-location">
                    {eventItem.address}, {eventItem.country}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
