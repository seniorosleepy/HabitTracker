import SidebarIcon from "../icons/SidebarIcon";

function Header({ onMenuClick, isOpen }) {
  return (
    <div className="header-container">
      <div className="header__container-btn">
        {!isOpen && (
          <button
            className="sidebar__toggle-btn"
            aria-label="Переключить боковую панель"
            onClick={() => {
              onMenuClick(true);
            }}
          >
            <SidebarIcon />
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
