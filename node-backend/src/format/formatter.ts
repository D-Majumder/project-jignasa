export class ResponseFormatter {
  format(raw: any, parsed: any, meta: any) {
    const hits = raw.body.hits?.hits || [];
    const rows = hits.map((h: any) => {
      const s = h._source || {};
      return {
        timestamp: s["@timestamp"],
        host: s.host?.name || s.host,
        user: s.user?.name || s.user,
        message: s.message || s.event?.action || JSON.stringify(s)
      };
    });

    const textSummary = `Found ${raw.body.hits?.total?.value || rows.length} matching events.`;
    const aggSeries: any = {};

    if (raw.body.aggregations) {
      for (const [k, v] of Object.entries(raw.body.aggregations)) {
        if ((v as any).buckets) {
          aggSeries[k] = (v as any).buckets.map((b: any) => ({
            key: b.key,
            doc_count: b.doc_count
          }));
        }
      }
    }

    return { text: textSummary, rows, agg: aggSeries };
  }

  // ✅ Added this method to support report generation
  formatReport(raw: any, parsed: any, meta: any) {
    const base = this.format(raw, parsed, meta);
    const narrative: string[] = [];

    narrative.push(`Report generated for: "${parsed.rawText || "your query"}"`);
    narrative.push(base.text);

    if (Object.keys(base.agg).length) {
      narrative.push("\nTop breakdowns:");
      for (const [k, v] of Object.entries(base.agg)) {
        const items = (v as any)
          .slice(0, 5)
          .map((s: any) => `${s.key} (${s.doc_count})`)
          .join(", ");
        narrative.push(`${k}: ${items}`);
      }
    }

    return {
      narrative: narrative.join("\n"),
      table: base.rows,
      charts: base.agg
    };
  }
}
