import React, { useState } from 'react';

function profileForm( {formData, handleSubmit, handleChange} ) {

  return (
    <div className=" mx-5 p-6 border border-gray-300 rounded-lg bg-white overflow-y-scroll h-full">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="font-bold">ID:</label>
          <input type="text" name="id" value={formData.id} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded" />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded" />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded" />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded" />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Profile Photo:</label>
          <div className="flex items-center mt-1">
            <img src={formData.profilePhoto} alt="Profile" className="w-12 h-12 mr-4" />
            <button type="button" className="p-2 border border-gray-300 rounded">Upload photo...</button>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Company:</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded" />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">CA DRE License:</label>
          <input type="text" name="caDreLicense" value={formData.caDreLicense} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded" />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded" />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">City:</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded" />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">State:</label>
          <select name="state" value={formData.state} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded">
            <option value="California">California</option>
            {/* Add other states as needed */}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Zip Code:</label>
          <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded" />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Work Phone:</label>
          <input type="text" name="workPhone" value={formData.workPhone} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded" />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Mobile Phone:</label>
          <input type="text" name="mobilePhone" value={formData.mobilePhone} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded" />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Email Address:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded" />
        </div>
        <div className="flex items-center">
          <label className="font-bold mr-2">Receive email notifications:</label>
          <input type="checkbox" name="receiveEmailNotifications" checked={formData.receiveEmailNotifications} onChange={handleChange} className="form-checkbox h-5 w-5 text-red-600" />
        </div>
        <div className="flex items-center">
          <label className="font-bold mr-2">Receive text notifications:</label>
          <input type="checkbox" name="receiveTextNotifications" checked={formData.receiveTextNotifications} onChange={handleChange} className="form-checkbox h-5 w-5 text-red-600" />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-red-600 text-white font-bold rounded hover:bg-red-700">Save</button>
      </form>
    </div>
  );
}

export default profileForm;