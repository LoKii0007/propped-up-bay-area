import React, { useState } from 'react'
import ProfileForm from './profileForm';

function SignUpForm() {

  const [formData, setFormData] = useState({
    id: '25411',
    username: '',
    firstName: '',
    lastName: '',
    profilePhoto: '',
    company: '',
    caDreLicense: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    workPhone: '',
    mobilePhone: '',
    email: '',
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
      <ProfileForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
    </>
  )
}

export default SignUpForm