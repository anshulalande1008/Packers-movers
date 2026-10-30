import { Truck, User, Building2, LogOut } from "lucide-react";

const NAV = [
  { label: "My Moves", icon: Truck, active: true },
  { label: "My Profile", icon: User },
  { label: "Get Quote", icon: Building2 },
  { label: "Logout", icon: LogOut },
];

export default function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Main">
      <ul>
        {NAV.map(({ label, icon: Icon, active }) => (
          <li key={label}>
            <a href="#" className={active ? "nav-link active" : "nav-link"} aria-current={active ? "page" : undefined}
               onClick={(e) => e.preventDefault()}>
              <Icon size={20} strokeWidth={2} aria-hidden="true" />
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
