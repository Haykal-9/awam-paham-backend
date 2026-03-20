const OpenAI = require('openai');

const simplifyReport = async (extractedText) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'mock-api-key',
    });

    if (!process.env.OPENAI_API_KEY) {
      console.warn("⚠️ OPENAI_API_KEY not found. Using fallback mock response.");
      return {
        summary: "Laporan ini menunjukkan hasil pemeriksaan darah. Secara umum, sebagian besar nilai berada dalam batas normal, namun ditemukan level Hemoglobin yang sedikit lebih rendah.",
        definitions: [
          { term: "Hemoglobin", meaning: "Protein dalam sel darah merah yang membawa oksigen ke seluruh tubuh." },
          { term: "Leukosit", meaning: "Sel darah putih yang berfungsi melawan infeksi." },
          { term: "Trombosit", meaning: "Keping darah yang membantu proses pembekuan darah." }
        ],
        questions: [
          "Apakah kadar hemoglobin saya memerlukan penanganan khusus tambahan suplemen zat besi?",
          "Apakah ada pantangan makanan berdasarkan hasil lab ini?"
        ]
      };
    }

    const prompt = `
    Kamu adalah asisten kesehatan yang membantu pasien awam memahami hasil laporan radiologi atau laboratorium mereka. Jelaskan isi laporan berikut dalam Bahasa Indonesia yang sederhana, hangat, dan mudah dipahami oleh orang tanpa latar belakang medis. 
    
    Aturan penting:
    1. JANGAN memberikan diagnosis
    2. JANGAN menyarankan pengobatan spesifik
    3. Selalu akhiri dengan kalimat yang mendorong pasien untuk mendiskusikan hasil ini dengan dokter
    4. Gunakan bahasa yang menenangkan, bukan menakutkan
    5. Jika ada nilai yang di luar rentang normal, jelaskan secara netral tanpa dramatisasi
    6. Maksimal 200 kata
    7. Kembalikan respons dalam format JSON: { "summary": "...", "definitions": [{ "term": "...", "meaning": "..." }], "questions": ["..."] }

    Teks Laporan:
    ${extractedText}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content);
    
  } catch (error) {
    console.error("LLM Error:", error);
    throw new Error("Gagal menyederhanakan laporan dengan AI.");
  }
};

module.exports = { simplifyReport };
