const conf = {
  mapbox_api: String(import.meta.env.VITE_MAPBOX_API_KEY),
  google_api: String(import.meta.env.VITE_GOOGLEMAP_API_KEY),
  stripe_api: String(import.meta.env.VITE_STRIPE_API_KEY)
};

export default conf;
