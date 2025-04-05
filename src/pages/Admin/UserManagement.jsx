// src/pages/Admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../api/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    department: ''
  });
  const { currentUser: authUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName || '',
      department: user.department || ''
    });
    setEditMode(true);
  };

  const handleCancel = () => {
    setCurrentUser(null);
    setFormData({
      username: '',
      email: '',
      fullName: '',
      department: ''
    });
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await userService.updateUser(currentUser.id, formData);
      
      // Update user in the list
      setUsers(users.map(user => 
        user.id === currentUser.id ? { ...user, ...formData } : user
      ));
      
      // Reset form
      handleCancel();
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error(err);
    }
  };

  const handlePromote = async (userId) => {
    try {
      await userService.promoteToAdmin(userId);
      
      // Update user in the list
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin: true } : user
      ));
    } catch (err) {
      setError('Failed to promote user. Please try again.');
      console.error(err);
    }
  };

  const handleDemote = async (userId) => {
    try {
      await userService.demoteFromAdmin(userId);
      
      // Update user in the list
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin: false } : user
      ));
    } catch (err) {
      setError('Failed to demote user. Please try again.');
      console.error(err);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await userService.deleteUser(userId);
        
        // Remove user from the list
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError('Failed to delete user. Please try again.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">User Management</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {editMode ? (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Edit User: {currentUser.username}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-control"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="department" className="form-label">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  className="form-control"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
              
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.fullName || '-'}</td>
                    <td>{user.department || '-'}</td>
                    <td>
                      <span className={`badge ${user.isAdmin ? 'bg-danger' : 'bg-secondary'}`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(user)}
                        className="btn btn-sm btn-outline-primary me-1"
                      >
                        Edit
                      </button>
                      
                      {user.id !== authUser.id && (
                        <>
                          {user.isAdmin ? (
                            <button
                              onClick={() => handleDemote(user.id)}
                              className="btn btn-sm btn-outline-warning me-1"
                            >
                              Demote
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePromote(user.id)}
                              className="btn btn-sm btn-outline-success me-1"
                            >
                              Promote
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;