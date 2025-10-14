export const CONFIG = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 8080,
  USE_OPENAI: !!process.env.OPENAI_API_KEY,
  ELASTIC: {
    node: process.env.ELASTIC_URL || "http://localhost:9200",
    apiKey: process.env.ELASTIC_API_KEY || undefined,
    username: process.env.ELASTIC_USER || undefined,
    password: process.env.ELASTIC_PASS || undefined
  },
  DEFAULT_INDEX: "logs-*",
  MAX_RESULT_WINDOW: 10000,
  AGG_BUCKET_SIZE_LIMIT: 10000
};
