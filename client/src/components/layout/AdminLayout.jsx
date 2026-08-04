import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <section>
      <aside>
        <h1>Craftify Admin</h1>

        <nav aria-label="Admin navigation">
          <ul>
            <li>
              <NavLink to="/admin" end>
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/products">
                Products
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/categories">
                Categories
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/orders">
                Orders
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/users">
                Users
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <div>
        <Outlet />
      </div>
    </section>
  );
}

export default AdminLayout;