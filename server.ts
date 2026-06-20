import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limits for base64 image uploads
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Lazy-initialize GoogleGenAI client to avoid crashes if API key is missing
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ========================================================
// API ROUTES FIRST
// ========================================================

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

/**
 * 1. Text-to-Image / Image-to-Image using gemini-3.1-flash-image
 */
app.post("/api/gemini/generate-image", async (req, res) => {
  try {
    const { prompt, existingImageB64, mimeType = "image/png", aspectRatio = "1:1" } = req.body;
    
    if (!prompt) {
       res.status(400).json({ error: "Prompt is required." });
       return;
    }

    const ai = getAi();
    
    // Prepare contents parts
    const parts: any[] = [];
    
    // If we've got an existing image to edit, append it first
    if (existingImageB64) {
      const cleanData = existingImageB64.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          data: cleanData,
          mimeType: mimeType
        }
      });
    }
    
    // Add prompt text
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K"
        }
      }
    });

    let generatedImageUrl: string | null = null;
    let fallbackText: string | null = null;

    if (response?.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const b64 = part.inlineData.data;
          generatedImageUrl = `data:image/png;base64,${b64}`;
        } else if (part.text) {
          fallbackText = part.text;
        }
      }
    }

    if (generatedImageUrl) {
      res.json({ success: true, imageUrl: generatedImageUrl, text: fallbackText });
    } else {
      res.status(502).json({ 
        error: "Did not receive image bits from the model.", 
        rawText: fallbackText || "No additional text returned." 
      });
    }
  } catch (error: any) {
    console.error("Error in generate-image:", error);
    res.status(500).json({ error: error?.message || "An unexpected error occurred during image generation." });
  }
});

/**
 * 2. Visual understanding / analyze-image using gemini-3.1-pro-preview
 */
app.post("/api/gemini/analyze-image", async (req, res) => {
  try {
    const { imageB64, mimeType = "image/png", systemPrompt } = req.body;
    
    if (!imageB64) {
       res.status(400).json({ error: "Base64 image data is required." });
       return;
    }

    const ai = getAi();
    const cleanData = imageB64.replace(/^data:image\/\w+;base64,/, "");
    
    const imagePart = {
      inlineData: {
        data: cleanData,
        mimeType
      }
    };
    
    const analysisPrompt = systemPrompt || 
      "Analyze this product illustration (it may be an ugly sketch, reference screenshot, napkin plan, or raw layout). " +
      "Extract key modules, components, potential materials, dimensions (estimates), visual form language, " +
      "and manufacturing considerations. Frame your output inside structured JSON with keys: name, description, " +
      "materialsList (array of strings), components (array of objects with keys: name, function), " +
      "manufacturingAdvices (array of strings), formStyle (string). Return only this valid JSON Object.";

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: { parts: [imagePart, { text: analysisPrompt }] },
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error("Error in analyze-image:", error);
    res.status(500).json({ error: error?.message || "An unexpected error occurred during image analysis." });
  }
});

/**
 * 3. Premium engineering brain with extreme thinking capability using gemini-3.1-pro-preview
 * Sets thinkingLevel to HIGH and does NOT set maxOutputTokens
 */
app.post("/api/gemini/think", async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;
    
    if (!prompt) {
       res.status(400).json({ error: "Prompt is required." });
       return;
    }

    const ai = getAi();

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 
          "You are the ForgeMind Engineering/Jarvis Brain. You evaluate mechanical products, solve constraint equations, " +
          "run DFM reviews, create exhaustive BOM matrices, assess structural stability, thermal venting, and material fail-safes. " +
          "Provide deeply mathematical, thorough engineering justifications. Output beautiful clean HTML or Markdown.",
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH
        }
      }
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error("Error in thinking-mode:", error);
    res.status(500).json({ error: error?.message || "An unexpected error occurred during reasoning session." });
  }
});

// ========================================================
// VITE OR STATIC SERVING MIDDLEWARE NEXT
// ========================================================

async function bootServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with compiled asset serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[VisualOS Server] Live at http://localhost:${PORT}`);
  });
}

bootServer();
