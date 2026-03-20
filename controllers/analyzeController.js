const { analyzeImageWithGemini } = require('../services/geminiService');

const analyzeReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Silakan unggah dokumen terlebih dahulu." });
    }

    // Menggunakan Gemini 1.5 Flash yang bisa melakukan OCR (baca gambar) 
    // sekaligus menyimpulkan menggunakan LLM (semua dalam 1 API gratis).
    const mimeType = req.file.mimetype;
    
    // Validate type for safety
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(mimeType)) {
      return res.status(400).json({ error: "Format file tidak didukung." });
    }

    const result = await analyzeImageWithGemini(req.file.buffer, mimeType);
    
    res.json(result);

  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memproses laporan dengan Gemini AI." });
  }
};

module.exports = { analyzeReport };
