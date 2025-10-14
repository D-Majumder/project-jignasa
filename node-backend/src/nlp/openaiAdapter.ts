import { NLParser, ParsedNL } from "./nlpAdapter";
import axios from "axios";

/**
 * Example adapter using OpenAI completions (replace prompt with your best-practice prompt).
 * This implementation assumes OPENAI_API_KEY env var. You can replace with any LLM API.
 */
export class OpenAIAdapter implements NLParser {
  apiUrl = "https://api.openai.com/v1/chat/completions";
  model = "gpt-4o-mini"; // placeholder — use your model

  async parse(text: string, context?: any): Promise<ParsedNL> {
    const prompt = [
      { role: "system", content: "You are an assistant that extracts SIEM search intent." },
      { role: "user", content: `Extract intent, time range (ISO), entities (event types, fields like ip,user,process,hash), filters, and recommended aggregations from this query: "${text}". Output strictly as JSON with keys: intent, timeRange:{from,to}, entities, filters[], aggregation. If ambiguous, set intent: 'clarify' and suggest 1-2 clarifying questions.` }
    ];

    const resp = await axios.post(this.apiUrl, {
      model: this.model,
      messages: prompt,
      temperature: 0
    }, {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
    });

    const content = resp.data.choices?.[0]?.message?.content;
    try {
      const json = JSON.parse(content);
      return { rawText: text, ...json } as ParsedNL;
    } catch (e) {
      // fallback
      return { rawText: text, intent: "unknown", entities: {}, filters: [] };
    }
  }
}
