import html2canvas from "html2canvas";

/**
 * Captures a chart by DOM element ID and returns a base64 PNG image string.
 * @param {string} elementId - The DOM ID of the chart container.
 * @param {object} options - Optional settings for html2canvas.
 * @returns {Promise<string | null>} - Base64 PNG image data.
 */
const captureChart = async (elementId, options = {}) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    return null;
  }

  try {
    // Default options can be overridden with the provided `options` object
    const canvas = await html2canvas(element, {
      logging: false,  // Turn off logging (can be helpful for debugging)
      scale: 2,        // Optional: scaling factor for higher resolution (default: 1)
      useCORS: true,   // Optional: enable CORS for external images
      ...options,      // Merge additional options if provided
    });
    return canvas.toDataURL("image/png");  // Convert canvas to base64 PNG
  } catch (error) {
    console.error("Error capturing chart:", error);
    return null;
  }
};

export default captureChart;
