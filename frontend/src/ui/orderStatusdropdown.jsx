import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function OrderStatusdropdown({handleOrderType, filterType}) {
    return (
        <>
            <Menu as="div" className="relative inline-block py-1">
                <div>
                    <MenuButton className="inline-flex capitalize w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                        Order Status
                        <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                    </MenuButton>
                </div>

                <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                    <div className="py-3 flex flex-col gap-2 ">
                        <MenuItem>
                            {({ close }) => (
                                <button
                                className={`${filterType=== 'all' && ' text-[#638856] font-semibold ' } py-2 `}
                                    onClick={() => {
                                        handleOrderType('all');
                                        close(); // Closes the dropdown
                                    }}
                                >
                                    All
                                </button>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({ close }) => (
                                <button
                                className={`${filterType=== 'pending' && ' text-[#638856] font-semibold ' } py-2 `}
                                    onClick={() => {
                                        handleOrderType('pending');
                                        close(); // Closes the dropdown
                                    }}
                                >
                                    Pending
                                </button>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({ close }) => (
                                <button
                                className={`${filterType=== 'installed' && ' text-[#638856] font-semibold ' } py-2 `}
                                    onClick={() => {
                                        handleOrderType('installed');
                                        close(); // Closes the dropdown
                                    }}
                                >
                                    Installed
                                </button>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({ close }) => (
                                <button
                                className={`${filterType=== 'completed' && ' text-[#638856] font-semibold ' } py-2 `}
                                    onClick={() => {
                                        handleOrderType('completed');
                                        close(); // Closes the dropdown
                                    }}
                                >
                                    completed
                                </button>
                            )}
                        </MenuItem>
                    </div>
                </MenuItems>
            </Menu>
        </>
    )
}

export default OrderStatusdropdown