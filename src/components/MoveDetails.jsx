import { useState } from "react";
import { ChevronDown } from "lucide-react";

function HouseBlock({ title, data }) {
  return (
    <div className="house-block">
      <h4 className="sub-title">{title}</h4>
      <div className="house-grid">
        <div><div className="label">Floor No.</div><div className="val">{data.floor}</div></div>
        <div><div className="label">Elevator Available.</div><div className="val">{data.elevator}</div></div>
        <div><div className="label">Distance from Elevator / Staircase to truck</div><div className="val">{data.distance}</div></div>
      </div>
    </div>
  );
}

function Category({ cat }) {
  const [open, setOpen] = useState(false);
  const id = `cat-${cat.name.replace(/\W+/g, "-")}`;
  return (
    <section className="cat">
      <button className="cat-head" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
        <span className="cat-name">{cat.name}</span>
        <span className="badge">{cat.count}</span>
        <ChevronDown size={18} className={open ? "chev up" : "chev"} aria-hidden="true" />
      </button>
      {open && (
        <div id={id} className="cat-body">
          {cat.groups.map((g, i) => (
            <div className="group" key={`${g.name}-${i}`}>
              {g.name && <h5 className="group-title">{g.name}</h5>}
              <ul>
                {g.rows.map((r, j) => (
                  <li key={`${r.name}-${j}`}>
                    <span>
                      {r.name}
                      {r.detail && <small>{r.detail}</small>}
                    </span>
                    <b>{r.qty}</b>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function MoveDetails({ move }) {
  return (
    <>
      <div className="detail-head">
        <h3 className="section-title">Additional Information</h3>
        <button className="btn btn-black">Edit Additional Info</button>
      </div>
      <p className="muted">{move.additionalInfo || "No additional information provided."}</p>

      <div className="detail-head">
        <h3 className="section-title">House Details</h3>
        <button className="btn btn-black">Edit House Details</button>
      </div>
      <HouseBlock title="Existing House Details" data={move.house.existing} />
      <HouseBlock title="New House Details" data={move.house.next} />

      <div className="detail-head">
        <h3 className="section-title">Inventory Details</h3>
        <button className="btn btn-black">Edit Inventory</button>
      </div>
      {move.categories.length ? (
        move.categories.map((c) => <Category key={c.name} cat={c} />)
      ) : (
        <p className="muted">No inventory items were listed for this move.</p>
      )}
    </>
  );
}
