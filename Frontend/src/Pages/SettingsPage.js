import React, { useEffect, useState } from 'react';
import VehicleSidebar from '../Components/Layout/VehicleSidebar';
import TopNav from '../Components/Layout/TopNav';
import { ToastContainer, toast } from 'react-toastify';
import { useProfileContext } from '../Context/fetchProfileContext';
import { getAllUsers, addNewUser, updateUser, removeUser } from '../APIS/APIS';
import 'react-toastify/dist/ReactToastify.css';
import { PlusCircle, Trash2, Pencil, X } from 'lucide-react';

export default function SettingsPage() {
  const { profile, getProfile } = useProfileContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: '' });
  const [changePassword, setChangePassword] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [editUser, setEditUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const [settings, setSettings] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    timezone: '',
  });

  useEffect(() => {
    if (!profile || !profile._id) {
      getProfile();
    } else {
      setSettings({
        id: profile._id,
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        password: '',
        timezone: '',
      });
    }
  }, [profile, getProfile]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response.status === 200) {
          setUsers(response.data);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.log(err);
        setUsers([]);
      }
    };
    fetchAllUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setChangePassword((prev) => ({ ...prev, [name]: value }));
  };

  const addUser = async () => {
    const { name, email, phone, password, confirmPassword, role } = newUser;
    if (name && email && phone && password && confirmPassword && role) {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      try {
        const response = await addNewUser(newUser);
        if (response.status === 200) {
          setUsers((prev) => [...prev, response.data]);
          setNewUser({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: '' });
          toast.success('User added');
        } else {
          toast.error(response.error || 'An error occurred. Please try again.');
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Unexpected error';
        toast.error(msg);
      }
    } else {
      toast.error('Please fill all user fields');
    }
  };

  const deleteUser = async (Id) => {
    try {
      const response = await removeUser(Id);
      if (response.status === 200) {
        const updatedUsers = users.filter((user) => user._id !== Id);
        setUsers(updatedUsers);
        toast.info('User removed');
      } else {
        toast.error(response.error || 'An error occurred. Please try again.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Unexpected error';
      toast.error(msg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmNewPassword } = changePassword;
    const updates = {};

    if (settings.name !== profile.name) updates.name = settings.name;
    if (settings.email !== profile.email) updates.email = settings.email;
    if (settings.phone !== profile.phone) updates.phone = settings.phone;
    if (settings.timezone !== profile.timezone) updates.timezone = settings.timezone;

    if ((currentPassword || newPassword || confirmNewPassword) && (!currentPassword || !newPassword || !confirmNewPassword)) {
      toast.error('All password fields are required');
      return;
    }

    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword) {
      updates.password = newPassword;
      updates.currentPassword = currentPassword;
    }

    if (Object.keys(updates).length === 0) {
      toast.info('No changes detected.');
      return;
    }
    updates.id = profile._id;

    try {
      const response = await updateUser(updates);
      if (response.status === 200) {
        toast.success('Settings updated successfully!');
        setChangePassword({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        toast.error(response.data?.message || 'Update failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Unexpected error';
      toast.error(msg);
    }
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await updateUser(editUser);
      if (response.status === 200) {
        toast.success('User updated');
        setEditUser(null);
        const res = await getAllUsers();
        if (res.status === 200) setUsers(res.data);
      } else {
        toast.error(response.error || 'Update failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Unexpected error';
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x:hidden">
      <ToastContainer />
      <VehicleSidebar toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} />

      <div className="flex-1 flex flex-col">
        <TopNav toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} />
        <main className="flex-1 p-6 mt-7  overflow-x:hidden">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b">
                <button 
                  onClick={() => setActiveTab('profile')} 
                  className={`px-6 py-4 font-medium text-sm ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                >
                  Profile Settings
                </button>
                <button 
                  onClick={() => setActiveTab('users')} 
                  className={`px-6 py-4 font-medium text-sm ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                >
                  User Management
                </button>
              </div>
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input name="name" value={settings.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" value={settings.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="tel" name="phone" value={settings.phone} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h2 className="text-xl font-bold mb-4">Change Password</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="password" name="currentPassword" value={changePassword.currentPassword} onChange={handlePasswordChange} placeholder="Current Password" className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        <input type="password" name="newPassword" value={changePassword.newPassword} onChange={handlePasswordChange} placeholder="New Password" className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        <input type="password" name="confirmNewPassword" value={changePassword.confirmNewPassword} onChange={handlePasswordChange} placeholder="Confirm New Password" className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Save Settings
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">User Management</h2>
                    <button onClick={() => setNewUser({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: '' })} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                      <PlusCircle size={18} /> Add User
                    </button>
                  </div>
                  
                  {/* Add User Form */}
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h3 className="text-lg font-medium mb-3">Add New User</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input name="name" value={newUser.name} onChange={handleNewUserChange} placeholder="Name" className="px-4 py-2 border border-gray-300 rounded-md" />
                      <input name="email" value={newUser.email} onChange={handleNewUserChange} placeholder="Email" className="px-4 py-2 border border-gray-300 rounded-md" />
                      <input name="phone" value={newUser.phone} onChange={handleNewUserChange} placeholder="Phone" className="px-4 py-2 border border-gray-300 rounded-md" />
                      <input type="password" name="password" value={newUser.password} onChange={handleNewUserChange} placeholder="Password" className="px-4 py-2 border border-gray-300 rounded-md" />
                      <input type="password" name="confirmPassword" value={newUser.confirmPassword} onChange={handleNewUserChange} placeholder="Confirm Password" className="px-4 py-2 border border-gray-300 rounded-md" />
                      <select name="role" value={newUser.role} onChange={handleNewUserChange} className="px-4 py-2 border border-gray-300 rounded-md">
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Staff">Staff</option>
                      </select>
                    </div>
                    <div className="mt-4">
                      <button onClick={addUser} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Save User
                      </button>
                    </div>
                  </div>
                  
                  {/* User List */}
                  {users.length > 0 && (
                    <div className="bg-white rounded-md shadow">
                      <h3 className="sr-only">User List</h3>
                      <ul className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <li key={user._id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                            <div>
                              <p className="font-medium text-gray-800">{user.name}</p>
                              <div className="flex items-center text-sm text-gray-600">
                                <span>{user.email}</span>
                                <span className="mx-2">•</span>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">{user.role}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button onClick={() => setEditUser(user)} className="text-blue-600 hover:text-blue-800 p-1">
                                <Pencil size={18} />
                              </button>
                              <button onClick={() => deleteUser(user._id)} className="text-red-600 hover:text-red-800 p-1" disabled={user.role === 'Admin'}>
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Edit Modal */}
          {editUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Edit User</h3>
                  <button onClick={() => setEditUser(null)} className="text-gray-500 hover:text-gray-700">
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <input name="name" value={editUser.name} onChange={handleEditUserChange} placeholder="Name" className="px-4 py-2 border rounded-md" />
                  <input name="email" value={editUser.email} onChange={handleEditUserChange} placeholder="Email" className="px-4 py-2 border rounded-md" />
                  <input name="phone" value={editUser.phone} onChange={handleEditUserChange} placeholder="Phone" className="px-4 py-2 border rounded-md" />
                  <select name="role" value={editUser.role} onChange={handleEditUserChange} className="px-4 py-2 border rounded-md">
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={() => setEditUser(null)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                  <button onClick={handleEditSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save Changes</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}