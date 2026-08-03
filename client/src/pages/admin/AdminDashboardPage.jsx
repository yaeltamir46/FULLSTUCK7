import { Link } from "react-router-dom";

function AdminDashboardPage() {
  return (
    <section>
      <header>
        <h1>Admin dashboard</h1>
        <p>Manage your Craftify store from one place.</p>
      </header>

      <div>
        <article>
          <h2>Products</h2>
          <p>
            Add products, update inventory and manage product
            availability.
          </p>
          <Link to="/admin/products">Manage products</Link>
        </article>

        <article>
          <h2>Categories</h2>
          <p>
            Create and update the categories used throughout the
            store.
          </p>
          <Link to="/admin/categories">
            Manage categories
          </Link>
        </article>

        <article>
          <h2>Orders</h2>
          <p>
            Review customer orders and update their current status.
          </p>
          <Link to="/admin/orders">Manage orders</Link>
        </article>

        <article>
          <h2>Users</h2>
          <p>
            Search customers and manage account availability.
          </p>
          <Link to="/admin/users">Manage users</Link>
        </article>
      </div>
    </section>
  );
}

export default AdminDashboardPage;