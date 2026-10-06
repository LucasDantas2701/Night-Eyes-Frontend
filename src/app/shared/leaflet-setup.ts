import * as L from 'leaflet';

// Ícones padrão do Leaflet servidos localmente (copiados para /leaflet/ pelo angular.json)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/marker-icon-2x.png',
  iconUrl: 'leaflet/marker-icon.png',
  shadowUrl: 'leaflet/marker-shadow.png',
});

export { L };
