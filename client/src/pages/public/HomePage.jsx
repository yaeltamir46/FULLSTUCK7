import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section>
      <h1>Welcome to Craftify</h1>

      <p>
       Everything you need for creation, inspiration, and handmade work in one place.
      </p>

      <Link to="/products">To view the products</Link>
    </section>
  );
}

export default HomePage;