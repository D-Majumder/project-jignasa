export const FIELD_MAP: Record<string, string[]> = {
  failed_login: ["event.action", "event.outcome"],
  malware: ["threat.indicator.type", "threat.indicator.malware"],
  vpn: ["network.transport", "network.application"]
};

export const INDEX_MAP = {
  default: "logs-*",
  auth: "auth-*",
  network: "network-*"
};
