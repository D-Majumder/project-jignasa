import NodeCache from "node-cache";

export class SessionManager {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
  }

  get(sessionId?: string) {
    if (!sessionId) return {};
    return this.cache.get(sessionId) || {};
  }

  update(sessionId: string | undefined, partial: any) {
    if (!sessionId) return;
    const prev = this.get(sessionId);
    const merged = { ...prev, ...partial };
    this.cache.set(sessionId, merged);
    return merged;
  }

  clear(sessionId: string) {
    if (!sessionId) return;
    this.cache.del(sessionId);
  }
}
