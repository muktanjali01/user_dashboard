import { useState, useEffect } from 'react';
import axios from 'axios';

type User = {
  id: string;
  name: string;
  email: string;
};

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState({ name: '', email: '' });

  // Fetch Users
  useEffect(() => {
    axios.get('/api/users')
      .then((response) => setUsers(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Create User
  const createUser = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('/api/users', newUser)
      .then((response) => setUsers([...users, response.data]))
      .catch((error) => console.error(error));
  };

  // Update User
  const updateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUserId) return;
    axios.put(`/api/users/${editUserId}`, editUser)
      .then(() => {
        setUsers(users.map(user => user.id === editUserId ? { ...user, ...editUser } : user));
        setEditUserId(null);
      })
      .catch((error) => console.error(error));
  };

  // Delete User
  const deleteUser = (id: string) => {
    axios.delete(`/api/users/${id}`)
      .then(() => setUsers(users.filter(user => user.id !== id)))
      .catch((error) => console.error(error));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {/* Create User Form */}
      <form onSubmit={createUser} className="mb-4">
        <input
          className="border p-2 mr-2"
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          className="border p-2 mr-2"
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button className="bg-blue-500 text-white p-2 rounded" type="submit">Add User</button>
      </form>

      {/* User List */}
      <ul className="list-none">
        {users.map(user => (
          <li key={user.id} className="border-b py-2 flex justify-between">
            {editUserId === user.id ? (
              <form onSubmit={updateUser}>
                <input
                  className="border p-2 mr-2"
                  type="text"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                />
                <input
                  className="border p-2 mr-2"
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                />
                <button className="bg-green-500 text-white p-2 rounded" type="submit">Save</button>
              </form>
            ) : (
              <>
                <span>{user.name} - {user.email}</span>
                <div>
                  <button className="bg-yellow-500 text-white p-2 mr-2 rounded" onClick={() => { setEditUserId(user.id); setEditUser({ name: user.name, email: user.email }); }}>Edit</button>
                  <button className="bg-red-500 text-white p-2 rounded" onClick={() => deleteUser(user.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
