import React, { useState } from 'react'


function CardDetails() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    postalCode: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    // Reset form after submission
    setFormData({
      firstName: '',
      lastName: '',
      cardNumber: '',
      expDate: '',
      cvv: '',
      email: '',
      phone: '',
      country: '',
      state: '',
      postalCode: ''
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Payment info</h2>
        <button type="button" className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <button className="w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-between hover:bg-gray-50">
          <span className="text-gray-700">+ Payment method</span>
          <div className="flex space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Adam"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Johnson"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="234 *** *** ***"
            required
          />
        </div>
        <div>
          <label htmlFor="expDate" className="block text-sm font-medium text-gray-700 mb-1">Expiration date</label>
          <input
            type="text"
            id="expDate"
            name="expDate"
            value={formData.expDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="12/27"
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV/CVC</label>
        <input
          type="text"
          id="cvv"
          name="cvv"
          value={formData.cvv}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="547"
          required
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Billing address</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Adam.2516@gmail.com" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
            <input type="tel" id="phone" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="+1 555-621-6231" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input type="text" id="country" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="United States" />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input type="text" id="state" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Texas" />
          </div>
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
            <input type="text" id="postalCode" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="73301" />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" className="text-gray-600 hover:text-gray-800">Cancel</button>
        <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800">Continue</button>
      </div>
    </form>
  )
}

export default CardDetails