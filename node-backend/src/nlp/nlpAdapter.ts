export type ParsedNL = {
  intent?: string;
  entities?: Record<string, any>;
  timeRange?: { from: string; to: string };
  rawText?: string;
  filters?: any[];
  aggregation?: any;
};

export interface NLParser {
  parse(text: string, context?: any): Promise<ParsedNL>;
}
