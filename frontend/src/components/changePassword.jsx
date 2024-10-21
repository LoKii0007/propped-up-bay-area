import React, { useState } from 'react'
import toast from 'react-hot-toast';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [isLoading , setIsLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true)
        console.log({ oldPassword, newPassword })
        setTimeout(() => {
            setIsLoading(false)
            toast.success('password changed successfully', {position:'top-right'})
        }, 2000)
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
                    disabled={isLoading}
                    type="submit"
                    className="w-full px-4 py-2  bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                    {isLoading ? 'changing' : 'Change Password'}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;