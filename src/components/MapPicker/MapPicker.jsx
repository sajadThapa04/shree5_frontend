import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import conf from "../../conf/conf";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

mapboxgl.accessToken = conf.mapbox_api;

const MapPicker = ({
  initialViewState,
  onLocationSelect,
  showControls = true,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [lng, setLng] = useState(initialViewState?.longitude || 0);
  const [lat, setLat] = useState(initialViewState?.latitude || 0);
  const [zoom, setZoom] = useState(initialViewState?.zoom || 2);
  const [searchQuery, setSearchQuery] = useState("");
  const [placeDetails, setPlaceDetails] = useState(null);
  const [mapStyle, setMapStyle] = useState("streets-v12");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Map style options
  const mapStyles = [
    { id: "satellite-v9", name: "Satellite" },
    { id: "satellite-streets-v12", name: "Satellite + Streets" },
    { id: "streets-v12", name: "Street" },
    { id: "outdoors-v12", name: "Outdoor" },
  ];

  // Update marker position
  const updateMarker = (lng, lat, placeInfo = null) => {
    if (marker.current) marker.current.remove();

    const el = document.createElement("div");
    el.className = "relative w-10 h-10";

    const pin = document.createElement("div");
    pin.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#EF4444" class="w-8 h-8 drop-shadow-lg">
        <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
      </svg>
    `;

    el.appendChild(pin);

    const markerInstance = new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    }).setLngLat([lng, lat]);

    if (placeInfo) {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2 max-w-xs">
          <h3 class="font-bold text-gray-800">${
            placeInfo.name || placeInfo.formatted_address || "Selected Location"
          }</h3>
          ${
            placeInfo.formatted_address
              ? `<p class="text-sm text-gray-600">${placeInfo.formatted_address}</p>`
              : ""
          }
          ${
            placeInfo.formatted_phone_number
              ? `<p class="text-sm text-gray-700 mt-1">📞 ${placeInfo.formatted_phone_number}</p>`
              : ""
          }
          ${
            placeInfo.website
              ? `<a href="${placeInfo.website}" target="_blank" class="text-sm text-blue-500 hover:underline block mt-1">🌐 Website</a>`
              : ""
          }
        </div>
      `);
      markerInstance.setPopup(popup);
    }

    markerInstance.addTo(map.current);
    marker.current = markerInstance;

    if (onLocationSelect) {
      onLocationSelect({
        lng,
        lat,
        zoom: map.current?.getZoom() || zoom,
        ...(placeInfo || {}),
      });
    }
  };

  // Handle location selection from Google Search
  const handlePlaceSelect = (place) => {
    if (!place.geometry) {
      console.log("No geometry available for this place");
      return;
    }

    const location = place.geometry.location;
    const lat = location.lat();
    const lng = location.lng();

    setLng(lng);
    setLat(lat);
    setSearchQuery(place.name || place.formatted_address || "");

    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 14,
        essential: true,
      });
    }

    if (place.place_id) {
      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );

      service.getDetails(
        {
          placeId: place.place_id,
          fields: [
            "name",
            "formatted_address",
            "types",
            "formatted_phone_number",
            "website",
            "geometry",
          ],
        },
        (details, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setPlaceDetails(details);
            updateMarker(
              details.geometry.location.lng(),
              details.geometry.location.lat(),
              details
            );
          } else {
            updateMarker(lng, lat, {
              name: place.name,
              formatted_address: place.formatted_address,
            });
          }
        }
      );
    } else {
      updateMarker(lng, lat, {
        name: place.name,
        formatted_address: place.formatted_address,
      });
    }
  };

  // Search for places using Google Places API
  const searchPlaces = () => {
    if (!searchQuery.trim() || !window.google) return;

    setIsSearching(true);
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.textSearch(
      {
        query: searchQuery,
      },
      (results, status) => {
        setIsSearching(false);

        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          document
            .querySelectorAll(".mapboxgl-marker:not(.main-marker)")
            .forEach((el) => el.remove());

          results.forEach((place) => {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            const el = document.createElement("div");
            el.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6" class="w-6 h-6 drop-shadow-lg">
                <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
              </svg>
            `;

            new mapboxgl.Marker({ element: el })
              .setLngLat([lng, lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(`
                  <div class="p-2 max-w-xs">
                    <h3 class="font-bold text-gray-800">${place.name}</h3>
                    <p class="text-sm text-gray-600">${
                      place.formatted_address || ""
                    }</p>
                    <button 
                      onclick="event.stopPropagation(); 
                      document.dispatchEvent(new CustomEvent('select-place', { detail: ${JSON.stringify(
                        place
                      )} }));"
                      class="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                    >
                      Select
                    </button>
                  </div>
                `)
              )
              .addTo(map.current);
          });

          if (results.length > 0) {
            const first = results[0].geometry.location;
            map.current.flyTo({
              center: [first.lng(), first.lat()],
              zoom: 13,
            });
          }
        } else if (
          status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
        ) {
          alert("No results found for your search. Try a different query.");
        } else {
          console.error("Search failed", status);
          alert("Search failed. Please try again.");
        }
      }
    );
  };

  // Add this state

  // Update the getCurrentLocation function
  const getCurrentLocation = (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { longitude, latitude } = position.coords;
        setLng(longitude);
        setLat(latitude);

        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            essential: true,
          });
          updateMarker(longitude, latitude, {
            name: "Your Current Location",
            formatted_address: "Detected from your device",
          });
        }
      },
      (error) => {
        setIsLocating(false);
        console.error("Error getting location:", error);
        alert(
          "Could not get your current location. Please ensure location services are enabled."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Initialize Google Places Autocomplete
  const initAutocomplete = () => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps API not loaded");
      return;
    }

    const input = document.getElementById("places-search");
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ["geocode", "establishment"],
      fields: ["place_id", "geometry", "formatted_address", "name"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      handlePlaceSelect(place);
    });
  };

  // Change map style
  const changeMapStyle = (styleId) => {
    setMapStyle(styleId);
    if (map.current) {
      map.current.setStyle(`mapbox://styles/mapbox/${styleId}`);
    }
  };

  useEffect(() => {
    const handleSelectPlace = (e) => {
      handlePlaceSelect(e.detail);
    };

    document.addEventListener("select-place", handleSelectPlace);

    return () => {
      document.removeEventListener("select-place", handleSelectPlace);
    };
  }, []);

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: `mapbox://styles/mapbox/${mapStyle}`,
        center: [lng, lat],
        zoom: zoom,
        pitch: 45,
        bearing: -17.6,
        antialias: true,
      });

      // Create custom navigation controls container
      const navControlContainer = document.createElement("div");
      navControlContainer.className = "custom-nav-controls";
      map.current.getContainer().appendChild(navControlContainer);

      // Add navigation controls to custom container
      const navControl = new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true,
      });
      navControlContainer.appendChild(navControl.onAdd(map.current));

      // Add current location button
      const locationButton = document.createElement("button");
      locationButton.type = "button";
      locationButton.innerHTML = `
        <div class="p-2 bg-white rounded-md shadow-md hover:bg-gray-100 transition-colors">
          ${
            isLocating
              ? `<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>`
              : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6" class="w-5 h-5">
                  <path fill-rule="evenodd" d="M8.25 3.75H19.5a.75.75 0 01.75.75v11.25a.75.75 0 01-1.5 0V6.31L5.03 20.03a.75.75 0 01-1.06-1.06L17.69 5.25H8.25a.75.75 0 010-1.5z" clip-rule="evenodd" />
                </svg>`
          }
        </div>
      `;
      locationButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        getCurrentLocation(e);
      });
      navControlContainer.appendChild(locationButton);

      // Style and position the navigation controls
      Object.assign(navControlContainer.style, {
        position: "absolute",
        right: "10px",
        bottom: "50%",
        transform: "translateY(50%)",
        zIndex: "10",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      });

      // Add scale control
      map.current.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 100,
          unit: "metric",
        }),
        "bottom-left"
      );

      // Click handler
      map.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        setLng(lng);
        setLat(lat);
        setPlaceDetails(null);
        updateMarker(lng, lat);
      });

      // Initial marker
      updateMarker(lng, lat);

      // Movement tracking
      map.current.on("move", () => {
        const center = map.current.getCenter();
        setLng(center.lng);
        setLat(center.lat);
        setZoom(map.current.getZoom());
      });
    }

    if (!window.google?.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${conf.google_api}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      script.onerror = () => console.error("Google Maps script failed to load");
      document.head.appendChild(script);
    } else {
      initAutocomplete();
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapStyle]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
      {/* Search and controls container */}
      <div className="absolute z-30 w-full p-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Search bar with button */}
        <div className="relative flex-1 max-w-xl">
          <input
            id="places-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchPlaces()}
            placeholder="Search for places worldwide..."
            className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
          />
          <button
            onClick={searchPlaces}
            disabled={isSearching}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors disabled:opacity-50"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <MagnifyingGlassIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Map style selector */}
        <select
          value={mapStyle}
          onChange={(e) => changeMapStyle(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 z-40"
        >
          {mapStyles.map((style) => (
            <option key={style.id} value={style.id}>
              {style.name}
            </option>
          ))}
        </select>
      </div>

      {/* Place details card */}
      {placeDetails && (
        <div className="absolute z-20 bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-bold text-lg text-gray-800">
            {placeDetails.name || "Selected Location"}
          </h3>
          {placeDetails.formatted_address && (
            <p className="text-sm text-gray-600 mt-1">
              {placeDetails.formatted_address}
            </p>
          )}
          {placeDetails.formatted_phone_number && (
            <p className="text-sm text-gray-700 mt-2">
              📞 {placeDetails.formatted_phone_number}
            </p>
          )}
          {placeDetails.website && (
            <a
              href={placeDetails.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline block mt-2"
            >
              🌐 Visit Website
            </a>
          )}
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full min-h-[400px]" />

      {/* Coordinates display */}
      <div className="hidden md:flex absolute z-10 bottom-4 right-4 bg-white bg-opacity-90 rounded-lg shadow-md p-3 text-sm text-gray-700 gap-3">
        <span>📍 Longitude: {lng.toFixed(5)}</span>
        <span>📍 Latitude: {lat.toFixed(5)}</span>
        <span>🔍 Zoom: {zoom.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default MapPicker;
