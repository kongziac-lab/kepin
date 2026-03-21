"use client";

import { useEffect, useRef } from "react";

const partnerData = [
  // Active nominations (red)
  { lat: 13.6,   lng: 100.6,  name: "Thammasat University",              country: "Thailand",    students: 8,  active: true  },
  { lat: 18.8,   lng: 98.97,  name: "Chiang Mai University",             country: "Thailand",    students: 5,  active: true  },
  { lat: 13.76,  lng: 100.53, name: "Mahidol University",                country: "Thailand",    students: 6,  active: true  },
  { lat: 31.3,   lng: 121.5,  name: "Fudan University",                  country: "China",       students: 12, active: true  },
  { lat: 30.5,   lng: 114.35, name: "Wuhan University",                  country: "China",       students: 4,  active: true  },
  { lat: 34.69,  lng: 135.5,  name: "Kansai University",                 country: "Japan",       students: 9,  active: true  },
  { lat: 35.02,  lng: 135.78, name: "Ritsumeikan University",            country: "Japan",       students: 7,  active: true  },
  { lat: 35.46,  lng: 139.62, name: "Tokai University",                  country: "Japan",       students: 3,  active: true  },
  { lat: 3.12,   lng: 101.65, name: "Universiti Malaya",                 country: "Malaysia",    students: 4,  active: true  },
  { lat: 21.03,  lng: 105.78, name: "Hanoi University",                  country: "Vietnam",     students: 6,  active: true  },
  { lat: 24.13,  lng: 120.68, name: "Tunghai University",                country: "Taiwan",      students: 5,  active: true  },
  { lat: 25.04,  lng: 121.53, name: "Fu Jen Catholic University",        country: "Taiwan",      students: 4,  active: true  },
  { lat: 14.07,  lng: 100.6,  name: "Kasetsart University",              country: "Thailand",    students: 3,  active: true  },
  { lat: 39.91,  lng: 116.4,  name: "Beijing Language & Culture Univ.", country: "China",       students: 10, active: true  },
  { lat: 22.3,   lng: 114.2,  name: "Hong Kong Baptist University",      country: "Hong Kong",   students: 2,  active: true  },
  // Partner only (gold)
  { lat: -36.85, lng: 174.77, name: "University of Auckland",            country: "New Zealand", students: 0,  active: false },
  { lat: 51.5,   lng: -0.12,  name: "University of Westminster",         country: "UK",          students: 0,  active: false },
  { lat: 48.85,  lng: 2.35,   name: "Paris Cité University",             country: "France",      students: 0,  active: false },
  { lat: 52.52,  lng: 13.41,  name: "Freie Universität Berlin",          country: "Germany",     students: 0,  active: false },
  { lat: 40.42,  lng: -3.7,   name: "Universidad Autónoma de Madrid",    country: "Spain",       students: 0,  active: false },
  { lat: -23.55, lng: -46.63, name: "Universidade de São Paulo",         country: "Brazil",      students: 0,  active: false },
  { lat: 55.75,  lng: 37.62,  name: "RUDN University",                   country: "Russia",      students: 0,  active: false },
  { lat: 19.07,  lng: 72.87,  name: "University of Mumbai",              country: "India",       students: 0,  active: false },
];

const INIT_CENTER: [number, number] = [25, 20];
const INIT_ZOOM = 2;

export function PartnerMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const initiated = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (initiated.current || !mapRef.current) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        if (initiated.current) return;
        initiated.current = true;

        const L = (await import("leaflet")).default;
        // leaflet CSS
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        const map = L.map(mapRef.current!, {
          center: INIT_CENTER,
          zoom: INIT_ZOOM,
          zoomControl: true,
          attributionControl: false,
        });
        mapInstance.current = map;

        // Custom reset-zoom control
        const ResetControl = L.Control.extend({
          options: { position: "topleft" },
          onAdd() {
            const btn = L.DomUtil.create("button", "leaflet-bar leaflet-control");
            btn.title = "원래 크기로";
            btn.style.cssText = `
              width:26px; height:26px; line-height:26px; font-size:14px;
              cursor:pointer; background:#1e0d0d; color:#f87171;
              border:none; display:flex; align-items:center; justify-content:center;
            `;
            btn.innerHTML = "⌂";
            L.DomEvent.on(btn, "click", (e) => {
              L.DomEvent.stopPropagation(e);
              map.setView(INIT_CENTER, INIT_ZOOM);
            });
            return btn;
          },
        });
        new ResetControl().addTo(map);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 10,
        }).addTo(map);

        // Style tile to dark red-tinted
        const style = document.createElement("style");
        style.textContent = `
          #partner-map-el .leaflet-container { background: #1a0808 !important; }
          #partner-map-el .leaflet-tile { filter: invert(1) hue-rotate(185deg) saturate(0.4) brightness(0.52) contrast(1.1); }
          #partner-map-el .map-popup .leaflet-popup-content-wrapper {
            background: #1e0d0d; border: 1px solid rgba(185,28,28,.35);
            color: #f5f0ef; font-family: 'Pretendard', sans-serif;
            font-size: .8rem; border-radius: .75rem;
            box-shadow: 0 8px 24px rgba(0,0,0,.5);
          }
          #partner-map-el .map-popup .leaflet-popup-tip { background: #1e0d0d; }
          #partner-map-el .map-popup .leaflet-popup-close-button { color: #f87171; }
        `;
        document.head.appendChild(style);

        // Markers
        partnerData.forEach((d) => {
          const color = d.active ? "#ef4444" : "#f59e0b";
          const size  = d.active ? 10 : 7;

          const marker = L.circleMarker([d.lat, d.lng], {
            radius:      size,
            fillColor:   color,
            color:       "rgba(0,0,0,0.3)",
            weight:      1.5,
            opacity:     1,
            fillOpacity: d.active ? 0.9 : 0.6,
          }).addTo(map);

          const badge = d.active
            ? `<span style="color:#f87171;font-weight:700">${d.students} student${d.students > 1 ? "s" : ""} nominated</span>`
            : `<span style="color:#9ca3af">Partner university</span>`;

          marker.bindPopup(
            `<div style="min-width:150px">
              <div style="font-weight:700;margin-bottom:2px">${d.name}</div>
              <div style="color:rgba(245,240,239,.45);font-size:.72rem;margin-bottom:6px">${d.country}</div>
              ${badge}
            </div>`,
            { className: "map-popup" }
          );
        });

        // KMU home marker
        L.circleMarker([35.83, 128.53], {
          radius:      14,
          fillColor:   "#2563EB",
          color:       "#fff",
          weight:      2.5,
          opacity:     1,
          fillOpacity: 1,
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-weight:700">Keimyung University<br>
             <span style="color:#f87171;font-size:.72rem">Daegu, South Korea</span></div>`,
            { className: "map-popup" }
          )
          .openPopup();
      },
      { threshold: 0.1 }
    );

    observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id="partner-map-el"
      ref={mapRef}
      style={{
        height: "100%",
        width: "100%",
        background: "#1a0808",
        borderRadius: "1rem",
        overflow: "hidden",
      }}
    />
  );
}
