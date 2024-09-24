import React, { useState } from 'react'
import ProfileForm from './forms/profileForm'

function Profile() {

    const [formData, setFormData] = useState({
        id: '25411',
        username: 'peggyang',
        firstName: 'Peggy',
        lastName: 'ang',
        profilePhoto: 'default-photo.png',
        company: 'signalsign',
        caDreLicense: '',
        address: '2042 High Street',
        city: 'Oakland',
        state: 'California',
        zipCode: '94601',
        workPhone: '',
        mobilePhone: '2331131113',
        email: 'peggyyang1819@gmail.com',
        receiveEmailNotifications: true,
        receiveTextNotifications: true,
      });
    
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
          ...formData,
          [name]: type === 'checkbox' ? checked : value,
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
      };

  return (
    <>
    <ProfileForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit}/>
    </>
  )
}

export default Profile