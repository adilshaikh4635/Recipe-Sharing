import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message } from 'antd';
import { useCookies } from 'react-cookie';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [cookies] = useCookies(["access_token"]);

  useEffect(() => {
    console.log("Fetching users...");  // This should print in the console

    const fetchUsers = async () => {
      try {
        console.log("Inside fetchUsers function...");

        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: cookies.access_token }
        });

        console.log("API Response:", response.data);  // Check if data is received
        console.log("hi");  // Should print if everything is working

        // Filter out users with isAdmin="true"
        const filteredUsers = response.data.filter(user => user.username !== "admin");
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        message.error("Failed to fetch users!");
      }
    };

    fetchUsers();
  }, [cookies]);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
      message.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user!");
    }
  };

  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    // { title: 'Role', dataIndex: 'role', key: 'role',
    //   render: (role) => role === 'admin' ? <b style={{ color: 'red' }}>Admin</b> : 'User'
    // },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          danger 
          onClick={() => deleteUser(record._id)}
          disabled={record.role === 'admin'} // Prevent deleting admin
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Admin - Manage Users</h1>
      <Table dataSource={users} columns={columns} rowKey="_id" />
    </div>
  );
};

export default AdminUsers;