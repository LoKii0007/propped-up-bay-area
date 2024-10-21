import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { AuthContext } from '../context/AuthContext'
import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Dropdown() {

  const { currentUser } = useContext(AuthContext)
  console.log(currentUser?.displayName)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { setCurrentUser, setUserLoggedIn } = useContext(AuthContext)

  async function handleSignOut(e) {
    e.preventDefault()
    setLoading(true)
    try {
      // await signOut(auth)
      setCurrentUser(null)
      setUserLoggedIn(false)
      toast.success("Signed out successfully")
      navigate('/')
    } catch (error) {
      console.log('error in sign out : ', error)
      toast.error(error.message)
    }
    finally {
      setLoading(false)
    }
  }

  function handleSignIn(e) {
    e.preventDefault()
    navigate('/signup')
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
          Welcome , {currentUser ? currentUser?.firstName : 'Guest'}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              profile
            </a>
          </MenuItem>
          <MenuItem>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              Change Password
            </a>
          </MenuItem>

          {currentUser ?
            <form onSubmit={handleSignOut}>
              <MenuItem>
                <button
                  type="submit"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                >
                  {loading ? 'signing out...' : 'Sign out'}
                </button>
              </MenuItem>
            </form> :
            <form onSubmit={handleSignIn}>
              <MenuItem>
                <button
                  type="submit"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                >
                  Sign in
                </button>
              </MenuItem>
            </form>
          }

        </div>
      </MenuItems>
    </Menu>
  )
}
