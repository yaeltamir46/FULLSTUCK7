import { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUserStatus,
} from "../../api/usersApi";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../utils/formatDate";

const INITIAL_FILTERS = {
  search: "",
  role: "",
  isActive: "",
};

function AdminUsersPage() {
  const { user: currentUser, token } = useAuth();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignoreResult = false;

    const requestTimer = setTimeout(async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getAllUsers(
          {
            ...filters,
            page,
            limit: 10,
          },
          token
        );

        if (!ignoreResult) {
          const receivedUsers =
            response.data.users ?? response.data;

          setUsers(receivedUsers);
          setPagination(response.pagination);
        }
      } catch (requestError) {
        if (!ignoreResult) {
          setError(
            requestError.message || "Failed to load users"
          );
        }
      } finally {
        if (!ignoreResult) {
          setIsLoading(false);
        }
      }
    }, 350);

    return () => {
      ignoreResult = true;
      clearTimeout(requestTimer);
    };
  }, [filters, page, token]);

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));

    setPage(1);
    setMessage("");
  }

  function handleResetFilters() {
    setFilters(INITIAL_FILTERS);
    setPage(1);
    setMessage("");
  }

  async function handleStatusChange(selectedUser) {
    const nextStatus = !selectedUser.isActive;

    const action = nextStatus ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `${action.charAt(0).toUpperCase() + action.slice(1)} ${
        selectedUser.firstName
      } ${selectedUser.lastName}?`
    );

    if (!confirmed) {
      return;
    }

    setUpdatingId(selectedUser.id);
    setError("");
    setMessage("");

    try {
      const response = await updateUserStatus(
        selectedUser.id,
        nextStatus,
        token
      );

      const updatedUser = response.data.user;

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );

      setMessage(
        `User ${nextStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          "Failed to update user status"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section>
      <header>
        <h1>Users</h1>
        <p>Search users and manage account availability.</p>
      </header>

      <section aria-labelledby="user-filters-title">
        <h2 id="user-filters-title">Filter users</h2>

        <Input
          id="admin-user-search"
          name="search"
          label="Search"
          type="search"
          placeholder="Name or email"
          value={filters.search}
          onChange={handleFilterChange}
        />

        <div>
          <label htmlFor="admin-user-role">Role</label>

          <select
            id="admin-user-role"
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
          >
            <option value="">All roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label htmlFor="admin-user-status">
            Account status
          </label>

          <select
            id="admin-user-status"
            name="isActive"
            value={filters.isActive}
            onChange={handleFilterChange}
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <Button type="button" onClick={handleResetFilters}>
          Reset filters
        </Button>
      </section>

      <ErrorMessage message={error} />

      {message && <p role="status">{message}</p>}

      {isLoading ? (
        <Loader message="Loading users..." />
      ) : !users.length ? (
        <EmptyState
          title="No users found"
          message="No users match the selected filters."
        />
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">User</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
              <th scope="col">Joined</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const isCurrentUser =
                user.id === currentUser.id;

              return (
                <tr key={user.id}>
                  <td>
                    {user.firstName} {user.lastName}
                    {isCurrentUser && " (You)"}
                  </td>

                  <td>{user.email}</td>
                  <td>{user.role}</td>

                  <td>
                    {user.isActive ? "Active" : "Inactive"}
                  </td>

                  <td>{formatDate(user.createdAt)}</td>

                  <td>
                    <Button
                      type="button"
                      isLoading={updatingId === user.id}
                      disabled={
                        isCurrentUser ||
                        Boolean(updatingId)
                      }
                      onClick={() =>
                        handleStatusChange(user)
                      }
                    >
                      {user.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {pagination && pagination.totalPages > 1 && (
        <nav aria-label="User management pages">
          <Button
            type="button"
            disabled={page <= 1 || isLoading}
            onClick={() =>
              setPage((currentPage) => currentPage - 1)
            }
          >
            Previous
          </Button>

          <span>
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </span>

          <Button
            type="button"
            disabled={
              page >= pagination.totalPages || isLoading
            }
            onClick={() =>
              setPage((currentPage) => currentPage + 1)
            }
          >
            Next
          </Button>
        </nav>
      )}
    </section>
  );
}

export default AdminUsersPage;