const vision = require('@google-cloud/vision');

const extractText = async (imageBuffer) => {
  try {
    if (!process.env.GOOGLE_CLOUD_VISION_API_KEY && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.warn("⚠️ Google Cloud Vision credentials not found. Using fallback mock text.");
      return "Hemoglobin 11.2 g/dL (Low), Leukosit 8500 /uL (Normal), Trombosit 150000 /uL (Normal). Kesan: Anemia ringan.";
    }

    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.documentTextDetection(imageBuffer);
    const fullTextAnnotation = result.fullTextAnnotation;
    
    return fullTextAnnotation ? fullTextAnnotation.text : '';
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("Gagal membaca teks dari gambar.");
  }
};

module.exports = { extractText };
