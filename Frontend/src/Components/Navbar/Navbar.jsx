import { BuildingStorefrontIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import React from 'react'

const Navbar = () => {
    return (
        <div className="navbar h-10  rounded-md shadow-md mb-3">
            <div className='md:w-[80%] md:mx-auto flex justify-between items-center'>
                <div className='flex items-center'>
                    <a className="text-xl font-bold">SuperMarket Management</a>
                </div>
            </div>
        </div>
    )
}

export default Navbar