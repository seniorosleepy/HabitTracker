import SidebarIcon from "../icons/SidebarIcon";
import ArrowIcon from "../icons/ArrowIcon";

function Sidebar({ isOpen, onClose, logout }) {
  const username = localStorage.getItem("username");
  const firstLetter = username.slice(0, 1);

  return (
    <>
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__header">
          <button className="sidebar__profile-area">
            <div className="sidebar__pfp-container">
              <p className="sidebar__pfp-letter">{firstLetter}</p>
            </div>
            <h3 className="sidebar__username">{username}</h3>
            <ArrowIcon />
          </button>
          <button
            className="sidebar__toggle-btn"
            aria-label="Переключить боковую панель"
            onClick={() => {
              onClose();
            }}
          >
            <SidebarIcon />
          </button>
        </div>
        <button onClick={logout} className="sidebar__logout-btn">
          Log out
        </button>
      </aside>
      {isOpen && <div className="sidebar__overlay" onClick={onClose} />}
    </>
  );
}

export default Sidebar;
