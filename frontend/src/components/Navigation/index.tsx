import { NavLink } from 'react-router-dom';

import './index.css';

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
        Upload
      </NavLink>
      |
      <NavLink
        to="/videos"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        Videos
      </NavLink>
    </nav>
  );
};

export default Navigation;
