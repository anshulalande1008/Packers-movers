// API client + defensive normalizers.
// The raw response is mapped into a stable shape so the UI never depends on
// exact backend key names.

export const API_URL =
  "https://apis2.ccbp.in/packers-and-movers/packers-and-movers-details";

const pick = (obj, keys, fallback = undefined) => {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return fallback;
};

const asArray = (v) => (Array.isArray(v) ? v : []);

/** Locate the array of moves wherever the API put it. */
function findMoves(json) {
  if (Array.isArray(json)) return json;
  if (json && typeof json === "object") {
    for (const k of ["data", "moves", "results", "response", "packers_and_movers"]) {
      if (Array.isArray(json[k])) return json[k];
      if (json[k] && typeof json[k] === "object") {
        const inner = findMoves(json[k]);
        if (inner.length) return inner;
      }
    }
    // Last resort: first array of objects among the values.
    for (const v of Object.values(json)) {
      if (Array.isArray(v) && v.length && typeof v[0] === "object") return v;
    }
    // Single move object
    if (pick(json, ["from_address", "request_id", "from"])) return [json];
  }
  return [];
}

/* ---------------- Inventory tree ---------------- */

const nameOf = (n) =>
  pick(n, ["displayName", "display_name", "category_name", "categoryName", "name", "title", "label"], "");

const qtyOf = (n) => {
  const q = pick(n, ["qty", "quantity", "count"]);
  return q === undefined ? undefined : Number(q) || 0;
};

const childrenOf = (n) => {
  for (const k of ["inventory", "category", "categories", "items", "sub_items", "children"]) {
    if (Array.isArray(n?.[k])) return n[k];
  }
  return null;
};

/** Extract human-readable detail like "Wooden" or "Metal, Dismantlable". */
function detailOf(n) {
  const parts = [];
  const t = n?.type ?? n?.types ?? n?.options;
  if (Array.isArray(t)) {
    t.forEach((o) => {
      if (typeof o === "string") parts.push(o);
      else if (o && (o.selected || o.isSelected || o.is_selected)) {
        parts.push(nameOf(o) || o.option || o.value);
      }
    });
  } else if (typeof t === "string") parts.push(t);
  ["size", "material"].forEach((k) => {
    if (typeof n?.[k] === "string" && n[k]) parts.push(n[k]);
  });
  return parts.filter(Boolean).join(", ");
}

function leafOf(n) {
  return { name: nameOf(n), qty: qtyOf(n) ?? 1, detail: detailOf(n) };
}

function sumQty(rows) {
  return rows.reduce((s, r) => s + (r.qty || 0), 0);
}

/** Convert a raw category node into { name, count, groups:[{name, rows}] }. */
function toCategory(node) {
  const kids = childrenOf(node) || [];
  const groups = [];
  const looseRows = [];

  kids.forEach((k) => {
    const sub = childrenOf(k);
    if (sub && sub.length) {
      const rows = sub.map(leafOf).filter((r) => r.name);
      groups.push({ name: nameOf(k), rows });
    } else if (nameOf(k)) {
      looseRows.push(leafOf(k));
    }
  });
  if (looseRows.length) groups.unshift({ name: groups.length ? "Other" : "", rows: looseRows });

  const count = sumQty(groups.flatMap((g) => g.rows));
  return { name: nameOf(node), count, groups };
}

function toCategories(items) {
  if (!items) return [];
  let top = items;
  if (!Array.isArray(top)) top = childrenOf(top) || [];
  // Unwrap a single wrapper node (e.g. [{ inventory: [...] }]).
  if (top.length === 1 && !nameOf(top[0]) && childrenOf(top[0])) top = childrenOf(top[0]);
  return top.map(toCategory).filter((c) => c.name && c.groups.length);
}

/* ---------------- Move ---------------- */

function formatDistance(d) {
  if (d === undefined) return "-";
  const s = String(d);
  return /[a-z]/i.test(s) ? s : `${s} km`;
}

export function formatMoveDate(value) {
  const d = new Date(value);
  if (!value || Number.isNaN(d.getTime())) return value || "-";
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const time = d
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    .toLowerCase();
  return `${date} at ${time}`;
}

const yesNo = (v) => {
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "string") return /^(y|yes|true|1)$/i.test(v) ? "Yes" : /^(n|no|false|0)$/i.test(v) ? "No" : v;
  if (typeof v === "number") return v ? "Yes" : "No";
  return "-";
};

const meters = (v) => (v === undefined ? "-" : /[a-z]/i.test(String(v)) ? String(v) : `${v} meters`);

function normalizeMove(m, index) {
  const items = pick(m, ["items", "inventory", "inventory_details"]);
  const categories = toCategories(items);
  const totalItems = pick(m, ["total_items", "totalItems", "items_count", "no_of_items"], undefined);

  return {
    key: pick(m, ["id", "request_id", "requestId"], index),
    requestId: pick(m, ["request_id", "requestId", "id", "estimate_id"], "-"),
    from: pick(m, ["from_address", "fromAddress", "from", "pickup_address", "old_address"], "-"),
    to: pick(m, ["to_address", "toAddress", "to", "drop_address", "new_address"], "-"),
    size: pick(m, ["property_size", "propertySize", "house_type", "bhk", "size"], "-"),
    itemCount:
      totalItems !== undefined ? totalItems : categories.reduce((s, c) => s + c.count, 0) || "-",
    distance: formatDistance(pick(m, ["distance", "distance_km", "distance_in_km"])),
    movingOn: pick(m, ["moving_on", "movingOn", "move_date", "date", "shifting_date"], ""),
    isFlexible: Boolean(pick(m, ["is_flexible", "isFlexible", "flexible", "date_flexible"], false)),
    additionalInfo: pick(m, ["additional_info", "additionalInfo", "additional_information"], ""),
    house: {
      existing: {
        floor: pick(m, ["old_floor_no", "old_floor", "existing_floor_no", "from_floor"], "-"),
        elevator: yesNo(pick(m, ["old_elevator_availability", "old_elevator", "existing_elevator"])),
        distance: meters(pick(m, ["old_parking_distance", "old_distance", "existing_distance"])),
      },
      next: {
        floor: pick(m, ["new_floor_no", "new_floor", "to_floor"], "-"),
        elevator: yesNo(pick(m, ["new_elevator_availability", "new_elevator"])),
        distance: meters(pick(m, ["new_parking_distance", "new_distance"])),
      },
    },
    categories,
  };
}

export function normalizeMoves(json) {
  const moves = findMoves(json).map(normalizeMove);
  if (!moves.length) throw new Error("The API returned no moves.");
  return moves;
}

export async function fetchMoves(signal) {
  const res = await fetch(API_URL, { signal });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return normalizeMoves(await res.json());
}
