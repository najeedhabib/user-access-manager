import React, { useState, useEffect } from "react";
import { UserControllerApi, User } from "../services/openapi";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import RunActionModal from "./RunActionModal";
// import EditUserModal from "./EditUserModal";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRunActionModal, setShowRunActionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();

  useEffect(() => {
    console.log("Fetching users...");
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const api = new UserControllerApi();
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (error) {
      alert(error);
    }
  };
  const deleteUser = async (user: User) => {
    try {
      const api = new UserControllerApi();
      await api.deleteUser({ id: user.id! });

      await fetchUsers();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center py-4 mb-5">
        <h2 className="text-3xl font-bold">Users</h2>
        <button
          className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded"
          onClick={() => setShowCreateModal(true)}
        >
          Create
        </button>
      </div>

      <div className="rounded-lg border px-2 overflow-hidden">
        <table className="min-w-full">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr className="text-left">
              <th scope="col" className="px-6 py-4">
                NAME
              </th>
              <th scope="col" className="px-6 py-4">
                E-MAIL
              </th>
              <th scope="col" className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b dark:border-neutral-500">
                <td className="whitespace-nowrap px-6 py-4 w-1/3">
                  {user.firstName} {user.lastName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 w-1/3">
                  {user.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4 w-1/3">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => {
                      deleteUser(user);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowRunActionModal(true);
                    }}
                  >
                    Run Action
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClosed={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            fetchUsers();
          }}
        />
      )}
      {showEditModal && selectedUser && (
        <EditUserModal
          onClosed={() => setShowEditModal(false)}
          user={selectedUser}
          onUpdated={() => {
            setShowEditModal(false);
            fetchUsers();
          }}
        />
      )}
      {showRunActionModal && selectedUser && (
        <RunActionModal
          onClosed={() => setShowRunActionModal(false)}
          onUpdated={() => {
            setShowRunActionModal(false);
            fetchUsers();
          }}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default UserList;
