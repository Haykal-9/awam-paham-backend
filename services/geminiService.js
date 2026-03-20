const { GoogleGenerativeAI } = require("@google/generative-ai");

const analyzeImageWithGemini = async (imageBuffer, mimeType) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY tidak ditemukan. Menggunakan mock data.");
      return mockResult();
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-3.1-flash";
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    Kamu adalah asisten kesehatan yang membantu pasien awam memahami laporan radiologi atau lab dari gambar dokumen ini. 
    Baca teks di dalam gambar dan berikan penjelasan dalam Bahasa Indonesia yang sederhana, hangat, dan menenangkan.
    
    Aturan:
    1. JANGAN memberikan diagnosis medis.
    2. JANGAN menyarankan pengobatan.
    3. Selalu dorong pasien untuk berkonsultasi ke dokter.
    4. Maksimal 200 kata.
    5. Keluarkan JSON dengan struktur persis seperti ini:
    {
      "summary": "Ringkasan sederhana dari hasil lab/radiologi",
      "definitions": [
        { "term": "Istilah 1", "meaning": "Penjelasan" }
      ],
      "questions": [
        "Pertanyaan ke dokter 1?",
        "Pertanyaan ke dokter 2?"
      ]
    }
    `;

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: mimeType === 'application/pdf' ? 'application/pdf' : 'image/jpeg' 
        // Note: Gemini 1.5 Flash supports PDF and images!
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    let responseText = result.response.text();
    
    // Strip markdown formatting if Gemini returns it
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(responseText);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gagal menganalisa laporan menggunakan AI AI gratis.");
  }
};

function mockResult() {
  return {
    summary: "[VERSI MOCKUP GEMINI] Laporan ini menunjukkan hasil pemeriksaan darah. Secara umum, nilai Hemoglobin sedikit rendah.",
    definitions: [
      { term: "Hemoglobin", meaning: "Protein dalam sel darah merah." }
    ],
    questions: ["Apakah saya butuh vitamin zat besi tambahan?"]
  };
}

module.exports = { analyzeImageWithGemini };
