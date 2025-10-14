import { ParsedNL } from "../nlp/nlpAdapter";
import { FIELD_MAP, INDEX_MAP } from "./mappings";
import { CONFIG } from "../config";

export class QueryGenerator {
  generate(parsed: ParsedNL, context?: any, opts?: { forReport?: boolean }) {
    const index = INDEX_MAP.default || CONFIG.DEFAULT_INDEX;
    const filters: any[] = [];

    if (parsed.timeRange) {
      filters.push({
        range: { "@timestamp": { gte: parsed.timeRange.from, lte: parsed.timeRange.to } }
      });
    } else {
      const now = new Date();
      const from = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      filters.push({ range: { "@timestamp": { gte: from } } });
    }

    (parsed.filters || []).forEach(f => filters.push(f));

    if (parsed.entities?.event) {
      const map = FIELD_MAP[parsed.entities.event];
      if (map) map.forEach(field => filters.push({ exists: { field } }));
    }

    const body: any = {
      index,
      body: {
        query: { bool: { filter: filters } },
        size: opts?.forReport ? 0 : 50
      }
    };

    if (opts?.forReport) {
      body.body.size = 0;
      body.body.aggs = {
        top_sources: { terms: { field: "source.ip.keyword", size: 10 } }
      };
    }

    return { dsl: body, meta: { index, forReport: !!opts?.forReport } };
  }
}
