import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { UseGlobal } from '../context/GlobalContext';
import axios from 'axios';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [passLoading, setPassLoading] = useState(false)
    const {baseUrl} = UseGlobal()

    const handleSubmit = async(e) => {
        e.preventDefault();
        setPassLoading(true);
        if (oldPassword === newPassword) {
            toast.error(`New password can't be same as old password`)
            setPassLoading(false)
            return
        }
        try {
            const res = await axios.patch(
                `${baseUrl}/auth/admin/password/update`,
                { currentPass : oldPassword , newPass : newPassword },
                { withCredentials: true, validateStatus : (status) => status < 500 }
            );
            if (res.status === 200) {
                toast.success("Password changed successfully.");
            } else {
                toast.error(res.data.message || 'Password change failed. Please try again');
            }
        } catch (error) {
            toast.error("Server error. Please try again.");
        } finally {
            setPassLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md m-12">
            <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Old password</label>
                    <div className="relative mt-1">
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                        >
                            {showOldPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New password</label>
                    <div className="relative mt-1">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                        >
                            {showNewPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">Minimum 6 characters</p>
                </div>
                <button
                    disabled={passLoading}
                    type="submit"
                    className="w-full px-4 py-2  bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                    {passLoading ? 'changing' : 'Change Password'}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;