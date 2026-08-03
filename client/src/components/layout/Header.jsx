import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header>
      <nav aria-label="main navigation">
        <Link to="/">Craftify</Link>

        <NavLink to="/products">products</NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to="/cart">cart</NavLink>
            <NavLink to="/orders">my orders</NavLink>
            <NavLink to="/profile">my profile</NavLink>

            {isAdmin && <NavLink to="/admin">admin</NavLink>}

            <span>Hi, {user?.firstName}</span>

            <button type="button" onClick={handleLogout}>log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login">login</NavLink>
            <NavLink to="/register">register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;