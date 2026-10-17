import { randomBytes } from "node:crypto";

/** e.g. TEG-261017-EM-7K3Q — date, urgency code and a random suffix. */
export function makeTicket(urgency: "standard" | "emergency") {
  const d = new Date();
  const date = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from(randomBytes(4), (b) => alphabet[b % alphabet.length]).join("");
  return `TEG-${date}-${urgency === "emergency" ? "EM" : "ST"}-${rand}`;
}
