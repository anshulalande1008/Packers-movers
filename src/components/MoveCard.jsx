import { useState } from "react";
import { ArrowRight, Home, Boxes, MapPin, CalendarDays, Pencil, TriangleAlert, Check } from "lucide-react";
import { formatMoveDate } from "../api.js";
import MoveDetails from "./MoveDetails.jsx";

// "2021-10-28T17:00:00" -> value accepted by <input type="datetime-local">
const toInputValue = (v) => {
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function MoveCard({ move }) {
  const [open, setOpen] = useState(false);
  const [flexible, setFlexible] = useState(move.isFlexible);
  const [date, setDate] = useState(move.movingOn);
  const [editingDate, setEditingDate] = useState(false);
  const panelId = `details-${move.key}`;

  return (
    <article className="move">
      <div className="route">
        <div className="addr">
          <h2 className="label">From</h2>
          <p>{move.from}</p>
        </div>
        <span className="arrow" aria-hidden="true"><ArrowRight size={18} /></span>
        <div className="addr">
          <h2 className="label">To</h2>
          <p>{move.to}</p>
        </div>
        <div className="req">
          <h2 className="label">Request#</h2>
          <p className="req-id">{move.requestId}</p>
        </div>
      </div>

      <div className="meta">
        <span className="chip" title="Property size"><Home size={22} className="ic" aria-hidden="true" />{move.size}</span>
        <span className="chip" title="Items"><Boxes size={22} className="ic" aria-hidden="true" />{move.itemCount}</span>
        <span className="chip" title="Distance"><MapPin size={22} className="ic" aria-hidden="true" />{move.distance}</span>

        <span className="chip date">
          <CalendarDays size={22} className="ic" aria-hidden="true" />
          {editingDate ? (
            <input
              type="datetime-local"
              className="date-input"
              value={toInputValue(date)}
              onChange={(e) => setDate(e.target.value)}
              onBlur={() => setEditingDate(false)}
              autoFocus
              aria-label="Move date"
            />
          ) : (
            <span>{formatMoveDate(date)}</span>
          )}
          <button className="icon-btn" onClick={() => setEditingDate((v) => !v)} aria-label="Edit move date">
            <Pencil size={14} />
          </button>
        </span>

        <label className="flex-check">
          <input type="checkbox" checked={flexible} onChange={(e) => setFlexible(e.target.checked)} />
          <span className="box" aria-hidden="true">{flexible && <Check size={11} strokeWidth={4} />}</span>
          Is flexible
        </label>

        <div className="actions">
          <button
            className="btn btn-outline"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            View move details
          </button>
          <button className="btn btn-solid">Quotes Awaiting</button>
        </div>
      </div>

      <p className="disclaimer">
        <TriangleAlert size={15} aria-hidden="true" />
        <strong>Disclaimer:</strong> Please update your move date before two days of shifting
      </p>

      {open && (
        <div id={panelId} className="details">
          <MoveDetails move={move} />
        </div>
      )}
    </article>
  );
}
