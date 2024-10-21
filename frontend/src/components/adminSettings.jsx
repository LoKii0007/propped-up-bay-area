import React, { useState } from 'react'
import ChangePassword from './changePassword'
import ProfileSettings from './ProfileSettings'
import AccountSettings from './AccountSettings'

function AdminSettings() {

  const [activeView, setActiveView] = useState('profileSettings')

  return (
    <>
      <div className="admin-st">
        <div className="st-top flex space-x-4 mb-6">
          <button onClick={()=>setActiveView('profileSettings')} className={` ${activeView === 'profileSettings' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'} px-4 py-2 font-medium hover:text-teal-600 focus:text-teal-600`}>Profile Setting</button>
          <button onClick={()=>setActiveView('password')} className={` ${activeView === 'password' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'} px-4 py-2 font-medium hover:text-teal-600 focus:text-teal-600`}>Password</button>
          <button onClick={()=>setActiveView('connectedAccounts')} className={` ${activeView === 'connectedAccounts' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'} px-4 py-2 font-medium hover:text-teal-600 focus:text-teal-600`}>Connected Accounts</button>
        </div>
        <div className="st-bottom">
          {activeView === 'profileSettings' && <ProfileSettings/> }
          {activeView === 'password' && <ChangePassword /> }
          {activeView === 'connectedAccounts' && <AccountSettings /> }
        </div>
      </div>
    </>
  )
}

export default AdminSettings