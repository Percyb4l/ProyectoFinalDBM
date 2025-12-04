import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getUsers, deleteUser } from "../../services/userService";
import UserModal from "../../components/UserModal";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

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
