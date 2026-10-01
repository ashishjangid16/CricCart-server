import { GoogleGenAI } from "@google/genai";
import { Product } from "../models/product.model.js";

const getConversation = (history, message) => {
  const entries = Array.isArray(history) ? history.slice(-20) : [];
  return [
    ...entries
      .filter((entry) => ["user", "assistant"].includes(entry?.role))
      .map((entry) => ({
        role: entry.role,
        text: String(entry.text || "").trim().slice(0, 1000),
      }))
      .filter((entry) => entry.text),
    { role: "user", text: message },
  ];
};

const getMaximumPrice = (conversation) => {
  const budgetPattern = /(?:under|below|less than|up to|within|max(?:imum)?|budget(?:\s*(?:of|is|to))?|price limit(?:\s*(?:of|is|to))?)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/gi;
  let maximumPrice;

  for (const entry of conversation) {
    if (entry.role !== "user") continue;
    for (const match of entry.text.matchAll(budgetPattern)) {
      const amount = Number(match[1].replace(/,/g, ""));
      if (Number.isFinite(amount) && amount > 0) maximumPrice = amount;
    }
  }

  return maximumPrice;
};

const getRequestedSize = (conversation) => {
  const latestUserMessage = [...conversation].reverse().find((entry) => entry.role === "user")?.text || "";
  const explicitSize = latestUserMessage.match(/\b(?:shoe\s+)?size\s*(?:is\s*)?(\d+(?:\.\d+)?)\b/i);
  if (explicitSize) return explicitSize[1];

  const latestAssistantMessage = [...conversation].reverse().find((entry) => entry.role === "assistant")?.text || "";
  const bareSize = latestUserMessage.match(/^\s*(\d+(?:\.\d+)?)\s*$/);
  return /\bsize\b/i.test(latestAssistantMessage) && bareSize ? bareSize[1] : undefined;
};

const getMatchingCategory = (categories, conversation) => {
  const categoryTerms = categories
    .map((category) => ({
      category,
      terms: String(category).toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 2 && term !== "cricket"),
    }));

  for (const entry of [...conversation].reverse()) {
    if (entry.role !== "user") continue;
    const matches = categoryTerms.filter(({ terms }) =>
      terms.some((term) => new RegExp(`\\b${term}\\b`, "i").test(entry.text)),
    );
    if (matches.length) return matches.length === 1 ? matches[0].category : undefined;
  }

  return undefined;
};

const getGeminiApiKey = () =>
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.OPENAI_API_KEY;

export const chatWithAssistant = async (req, res) => {
  try {
    const { message = "", conversationHistory = [] } = req.body || {};
    const userMessage = String(message || "").trim();

    if (!userMessage) {
      return res
        .status(400)
        .json({ message: "Please enter a message for the assistant." });
    }

    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      return res.status(500).json({
        message:
          "Gemini API key is missing. Add GEMINI_API_KEY, GOOGLE_API_KEY, or OPENAI_API_KEY to the backend .env file.",
      });
    }

    const conversation = getConversation(conversationHistory, userMessage);
    const maximumPrice = getMaximumPrice(conversation);
    const requestedSize = getRequestedSize(conversation);
    const categories = await Product.distinct("category");
    const category = getMatchingCategory(categories, conversation);
    const filters = {};
    if (maximumPrice !== undefined) filters.price = { $lte: maximumPrice };
    if (category) filters.category = category;
    if (requestedSize) {
      filters.availableSizes = { $in: [requestedSize, `UK ${requestedSize}`, `US ${requestedSize}`] };
    }

    const matchingProducts = await Product.find(filters)
      .select("title description price category availableSizes")
      .limit(30)
      .lean();
    const hasSizeData = requestedSize
      ? await Product.exists({ ...filters, availableSizes: { $exists: true, $ne: [] } })
      : true;

    const ai = new GoogleGenAI({ apiKey });
    const historyText = conversation
      .slice(0, -1)
      .map((entry) => `${entry.role === "assistant" ? "Assistant" : "User"}: ${entry.text}`)
      .join("\n");
    const activeFilters = [
      maximumPrice !== undefined ? `maximum price ₹${maximumPrice}` : "no maximum price specified",
      category ? `category ${category}` : "no specific category identified",
      requestedSize ? `size ${requestedSize}` : "no size specified",
    ].join("; ");
    const prompt = `You are CricCart's shopping assistant. Use the conversation to understand follow-up answers and preserve earlier requirements.\n\nHard rules:\n- Recommend products only from the eligible products JSON below. Never invent products, prices, categories, or sizes.\n- The backend has already applied these non-negotiable filters: ${activeFilters}. Never suggest an item that violates them.\n- If eligible products is empty, clearly say there are no matching products in the catalog; do not relax a filter.\n- If a requested size has no recorded availability data, say size availability is not recorded and do not claim any product fits.\n- Be concise and helpful.\n\nConversation so far:\n${historyText || "(No earlier messages)"}\nUser: ${userMessage}\n\nSize availability recorded: ${hasSizeData ? "yes" : "no"}\nEligible products JSON:\n${JSON.stringify(matchingProducts)}`;

    async function generateGeminiResponse(prompt) {
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3.8-flash",
                contents: prompt,
            });

            return response;

        } catch (error) {
            console.log(`Gemini attempt ${attempt} failed:`, error.status);

            // Retry only for temporary server/rate-limit problems
            if (error.status !== 503 && error.status !== 429) {
                throw error;
            }

            if (attempt === maxRetries) {
                throw error;
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
}

    const response = await generateGeminiResponse(prompt);

    const reply =
      response?.text ||
      response?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || "")
        .join("") ||
      "I’m sorry, I couldn’t generate a reply right now.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini assistant error:", error);

    const errorMessage = error?.message || "Unknown error";
    const isBlockedKeyError =
      errorMessage.includes("API_KEY_SERVICE_BLOCKED") ||
      errorMessage.includes("PERMISSION_DENIED") ||
      errorMessage.includes("429") ||
      errorMessage.includes("403");

    return res.status(500).json({
      message: isBlockedKeyError
        ? "The Gemini API key is blocked, expired, or the Generative Language API is not enabled in Google Cloud."
        : "AI assistant failed to respond.",
      error: errorMessage,
    });
  }
};
