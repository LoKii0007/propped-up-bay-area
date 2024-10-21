import React, { useState } from 'react';

const ProfileSettings = () => {
    // State for form inputs
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the form submission logic here
        console.log({ profilePic, fullName, email, username, phone, bio });
    };

    // Handle file input change
    const handleFileChange = (e) => {
        setProfilePic(e.target.files[0]);
    };

    return (
        <div className="w-full max-w-4xl">

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2 mb-8">
                    <label htmlFor="profilePic" className="block font-medium text-gray-700">Your Profile Picture</label>
                    <div className="flex items-center justify-center w-32 h-32 bg-[#EDF2F6] border border-dashed border-[#4C535F] border-[1px] rounded-md">
                        <input type="file" id="profilePic" className="hidden" onChange={handleFileChange} />
                        <label htmlFor="profilePic" className="text-center cursor-pointer text-gray-400 items-center justify-center flex flex-col ">
                            <h4 className="img-icon ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-plus"><path d="M16 5h6" /><path d="M19 2v6" /><path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /><circle cx="9" cy="9" r="2" /></svg>
                            </h4>
                            <p>Upload your photo</p>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full name</label>
                        <input type="text" id="fullName" placeholder="Please enter your full name" className="w-full mt-1 p-2 border border-[#E0E4EC] bg-[#EDF2F6] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" placeholder="Please enter your email" className="w-full mt-1 p-2 border border-[#E0E4EC] bg-[#EDF2F6] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" id="username" placeholder="Please enter your username" className="w-full mt-1 p-2 border border-[#E0E4EC] bg-[#EDF2F6] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone number</label>
                        <input type="tel" id="phone" placeholder="Please enter your phone number" className="w-full mt-1 p-2 border border-[#E0E4EC] bg-[#EDF2F6] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea id="bio" placeholder="Write your Bio here e.g your hobbies, interests ETC" className="w-full mt-1 p-2 border border-[#E0E4EC] bg-[#EDF2F6] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>

                <div className="flex space-x-4 mt-6">
                    <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400">Update Profile</button>
                    <button type="reset" className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">Reset</button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;
