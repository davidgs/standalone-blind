import React, {forwardRef} from 'react';

import styles from './map-canvas.module.css';

const MapCanvas = forwardRef<HTMLDivElement, Record<string, unknown>>(
  (_, ref) => <div ref={ref} className={styles.map} style={{ width: "80vw", height: "80vh", margin: "auto" }} />
);

export default MapCanvas;
