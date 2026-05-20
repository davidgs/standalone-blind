import { useContext, useEffect, useRef } from 'react';
import { MapContext } from '@react-google-maps/api';

type AdvancedMarkerProps = {
  position: google.maps.LatLngLiteral;
  title?: string;
  iconUrl: string;
  onClick?: () => void;
};

export default function AdvancedMarker({
  position,
  title,
  iconUrl,
  onClick,
}: AdvancedMarkerProps) {
  const map = useContext(MapContext);
  const onClickRef = useRef(onClick);

  onClickRef.current = onClick;

  useEffect(() => {
    if (!map) return undefined;

    const img = document.createElement('img');
    img.src = iconUrl;
    img.width = 32;
    img.height = 32;
    img.alt = title ?? '';
    img.style.display = 'block';
    img.style.cursor = 'pointer';
    img.style.pointerEvents = 'auto';

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      title,
      content: img,
      gmpClickable: true,
    });

    const handleClick = () => {
      onClickRef.current?.();
    };

    marker.addEventListener('gmp-click', handleClick);
    img.addEventListener('click', handleClick);

    return () => {
      marker.removeEventListener('gmp-click', handleClick);
      img.removeEventListener('click', handleClick);
      marker.map = null;
    };
  }, [map, position.lat, position.lng, title, iconUrl]);

  return null;
}
