import { Router } from "express";
import { SessionManager } from "../context/sessionManager";
import { NLParser } from "../nlp/nlpAdapter";
import { OpenAIAdapter } from "../nlp/openaiAdapter";
import { RuleParser } from "../nlp/ruleParser";
import { QueryGenerator } from "../query/generator";
import { ElasticConnector } from "../siem/elasticConnector";
import { ResponseFormatter } from "../format/formatter";
import { CONFIG } from "../config";

export const routes = Router();

const session = new SessionManager();
const parser = CONFIG.USE_OPENAI ? new OpenAIAdapter() : new RuleParser();
const qgen = new QueryGenerator();
const es = new ElasticConnector();
const formatter = new ResponseFormatter();

// Entry point: conversational query
routes.post("/query", async (req, res) => {
  try {
    const { sessionId, text } = req.body;
    if (!text) return res.status(400).send({ error: "text required" });

    // load session context (if any)
    const ctx = session.get(sessionId);

    // parse
    const parsed = await parser.parse(text, ctx);
    // merge into context
    session.update(sessionId, parsed);

    // translate to DSL
    const { dsl, meta } = qgen.generate(parsed, ctx);

    // run query on Elastic
    const raw = await es.search(dsl);

    // format
    const out = formatter.format(raw, parsed, meta);

    // save last request to context
    session.update(sessionId, { lastQuery: dsl, lastResultMeta: meta });

    res.json({ parsed, dsl, meta, out });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: String(err) });
  }
});

// Report generation endpoint
routes.post("/report", async (req, res) => {
  try {
    const { sessionId, text } = req.body;
    if (!text) return res.status(400).send({ error: "text required" });

    const ctx = session.get(sessionId);
    const parsed = await parser.parse(text, ctx);
    const { dsl, meta } = qgen.generate(parsed, ctx, { forReport: true });
    const raw = await es.search(dsl);
    const out = formatter.formatReport(raw, parsed, meta);
    session.update(sessionId, { lastReport: out, lastQuery: dsl });
    res.json({ parsed, dsl, meta, out });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: String(err) });
  }
});

export default routes;
