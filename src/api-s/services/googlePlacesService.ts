import type { Doctor } from '../../types/models/Evaluation';

const API_KEY = import.meta.env.REACT_APP_GOOGLE_PLACES_API_KEY as string;
const PLACES_URL = 'https://places.googleapis.com/v1/places:searchText';

interface PlaceResult {
  displayName: { text: string };
  formattedAddress: string;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  location?: { latitude: number; longitude: number };
}

export async function searchDoctors(
  specialty: string,
  location: string,
  coords?: { lat: number; lng: number }
): Promise<Doctor[]> {
  if (!API_KEY) throw new Error('REACT_APP_GOOGLE_PLACES_API_KEY is not configured');

  const body: Record<string, unknown> = { maxResultCount: 5 };

  if (coords) {
    body.textQuery = specialty;
    body.locationBias = {
      circle: {
        center: { latitude: coords.lat, longitude: coords.lng },
        radius: 15000,
      },
    };
  } else {
    body.textQuery = `${specialty} ${location}`;
  }

  const response = await fetch(PLACES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': [
        'places.displayName',
        'places.formattedAddress',
        'places.rating',
        'places.userRatingCount',
        'places.websiteUri',
        'places.nationalPhoneNumber',
        'places.location',
      ].join(','),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any).error?.message ?? 'Google Places request failed');
  }

  const data = await response.json();
  const places: PlaceResult[] = data.places ?? [];

  return places.map((p, i) => ({
    name: p.displayName.text,
    specialist: specialty,
    sector: 'Secteur 1',
    rating: p.rating ?? 0,
    reviews: p.userRatingCount ?? 0,
    address: p.formattedAddress,
    nextSlot: '',
    website: p.websiteUri,
    phone: p.nationalPhoneNumber ?? '',
    lat: p.location?.latitude,
    lng: p.location?.longitude,
    coords: { x: 80 + i * 60, y: 120 + (i % 3) * 80 }, // fallback SVG coords, unused
  }));
}
