import { Client } from "@elastic/elasticsearch";
import { CONFIG } from "../config";

export class ElasticConnector {
  client: Client;
  constructor() {
    const opts: any = { node: CONFIG.ELASTIC.node };
    if (CONFIG.ELASTIC.apiKey) opts.auth = { apiKey: CONFIG.ELASTIC.apiKey };
    if (CONFIG.ELASTIC.username && CONFIG.ELASTIC.password) {
      opts.auth = { username: CONFIG.ELASTIC.username, password: CONFIG.ELASTIC.password };
    }
    this.client = new Client(opts);
  }

  async search(body: any) {
    // Defensive: prevent huge scans
    if (body.body && body.body.size && body.body.size > CONFIG.MAX_RESULT_WINDOW) {
      body.body.size = CONFIG.MAX_RESULT_WINDOW;
    }
    const resp = await this.client.search(body);
    return resp;
  }
}
