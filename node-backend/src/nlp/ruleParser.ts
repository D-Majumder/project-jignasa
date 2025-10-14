import { NLParser, ParsedNL } from "./nlpAdapter";
import { parseTimeRange } from "../utils/timeParser";

const KEYWORDS: Record<string, string> = {
  "failed login": "failed_login",
  "malware": "malware",
  "vpn": "vpn",
  "suspicious login": "suspicious_login",
  "mfa": "mfa"
};

export class RuleParser implements NLParser {
  async parse(text: string, context?: any): Promise<ParsedNL> {
    const lowered = text.toLowerCase();
    const entities: Record<string, any> = {};
    for (const k of Object.keys(KEYWORDS)) {
      if (lowered.includes(k)) {
        entities.event = KEYWORDS[k];
        break;
      }
    }

    const tr = parseTimeRange(lowered);
    const filters: any[] = [];

    if (lowered.includes("vpn")) filters.push({ term: { "network.vpn.keyword": true }});
    if (lowered.includes("failed")) filters.push({ term: { "event.outcome.keyword": "failure" }});

    if (lowered.startsWith("filter") && context?.lastParsed) {
      const prev = context.lastParsed as ParsedNL;
      return { ...prev, filters: [...(prev.filters || []), ...filters], rawText: text, timeRange: tr || prev.timeRange };
    }

    return { intent: entities.event ? "search" : "unknown", entities, timeRange: tr || undefined, filters, rawText: text };
  }
}
