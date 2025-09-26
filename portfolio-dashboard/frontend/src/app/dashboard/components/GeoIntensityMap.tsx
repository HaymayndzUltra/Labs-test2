'use client';

import { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import type { DeckProps } from 'deck.gl';

export type GeoPoint = {
  lat: number;
  lng: number;
  intensity: number;
};

type GeoIntensityMapProps = {
  points: GeoPoint[];
  deckConfig: DeckProps;
};

export default function GeoIntensityMap({ points, deckConfig }: GeoIntensityMapProps) {
  const layer = useMemo(
    () =>
      new ScatterplotLayer({
        id: 'geo-intensity-layer',
        data: points,
        getPosition: (point) => [point.lng, point.lat],
        getRadius: (point) => point.intensity * 150000,
        radiusUnits: 'meters',
        getFillColor: (point) => [80, 200, 180, Math.min(255, point.intensity * 255)],
        pickable: true,
      }),
    [points],
  );

  return <DeckGL {...deckConfig} layers={[layer]} />;
}
