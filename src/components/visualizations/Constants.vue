<script>
/**
 * This file contains constants used across different visualizations.
 *
 * This is to ensure that properties such as the size of the circles and
 * how fast the visualization zooms in an out are consistent across all
 * visualizations.
 */
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

/* Global constants for data visualizations */
export const radius = 5;
export const zoomDur = 10; // controls zoom speed
export const maxZoom = 16;
export const tooltipLeft = 24;
export const tooltipTop = 24;

// color scheme
export const colors = scaleOrdinal(schemeCategory10);

</script>
