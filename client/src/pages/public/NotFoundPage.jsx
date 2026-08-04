import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section>
      <h1>404</h1>
      <p>The page you were looking for was not found.</p>
      <Link to="/">Back to home page</Link>
    </section>
  );
}

export default NotFoundPage;