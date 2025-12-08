/**
 * @fileoverview Users Management Page Component
 * 
 * Provides interface for managing system users.
 * Features include listing users, creating new users, and deleting users.
 * 
 * @module pages/UsersPage
 * @requires react
 */

import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getUsers, deleteUser } from "../../services/userService";
import UserModal from "../../components/UserModal";

/**
 * UsersPage Component
 * 
 * Manages user accounts with create and delete operations.
 * Uses a modal component for user creation.
 * 
 * @component
 * @returns {JSX.Element} User management interface
 */
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  /**
   * Loads all users from the API
   * 
   * @async
   * @function loadUsers
   * @returns {Promise<void>}
   */
  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  /**
   * Effect: Load users on component mount
   */
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <AdminLayout>
      <h1 className="admin-title">Usuarios</h1>

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Lista de usuarios</h2>
          <button
            className="admin-btn-primary"
            onClick={() => setOpenModal(true)}
          >
            + Crear usuario
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button className="admin-btn-secondary">Editar</button>
                  <button
                    className="admin-btn-danger"
                    style={{ marginLeft: "6px" }}
                    onClick={() => {
                      // Delete user and refresh list
                      deleteUser(u.id).then(loadUsers);
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User creation modal */}
      {openModal && (
        <UserModal
          close={() => setOpenModal(false)}
          refresh={loadUsers}
        />
      )}
    </AdminLayout>
  );
};

export default UsersPage;
