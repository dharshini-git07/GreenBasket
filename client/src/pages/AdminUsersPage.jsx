import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowLeft, Shield } from 'lucide-react';
import { getAdminUsersApi } from '../services/api';
import { LoadingPage } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminUsersApi();
        if (data.success) {
          setUsers(data.users || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user list.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <LoadingPage message="Loading application users..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <Link to="/admin" className="text-xs font-semibold text-gray-400 hover:text-[#2E7D32] flex items-center gap-1 mb-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-[#1F2937]">Admin User Management</h1>
      </div>

      <ErrorMessage message={error} />

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1F2937]">
            <thead className="bg-[#F8FAF8] text-[#6B7280] uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-[#F8FAF8]/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-bold flex items-center justify-center text-xs">
                      {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-[#1F2937]">{u.name}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-[#E8F5E9] text-[#2E7D32]'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminUsersPage;
