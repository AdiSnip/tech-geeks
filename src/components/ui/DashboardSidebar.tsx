'use client'
import React, { useEffect } from 'react'
import { BookIcon, HomeIcon, MessageCircleIcon, Settings, ShoppingCartIcon, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { ReactNode } from 'react'

import Link from 'next/link'

// Define type for sidebar items
interface SidebarItem {
  name: string;
  icon: ReactNode;
  link: string;
}

const DashboardSidebar = () => {
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([])  
  useEffect(()=>{
    setSidebarItems([
      {
        name: 'Dashboard',
        icon: <HomeIcon />,
        link: '/main/dashboard',
      },
      {
        name: 'Learning Hub',
        icon: <BookIcon />,
        link: '/main/learning-hub',
      },
      {
        name: 'My Products',
        icon: <ShoppingCartIcon />,
        link: '/main/my-products',
      },
      {
        name: 'Community Forum',
        icon: <MessageCircleIcon />,
        link: '/main/community-forum',
      },
      {
        name: 'Profile',
        icon: <UserIcon />,
        link: '/main/profile',
      },
      {
        name:'Setting',
        icon: <Settings/>,
        link: '/main/setting'
      }
    ])
  },[])

  return (
    <div className='w-64 h-full bg-gray-800 text-white'>
      <div>
        {sidebarItems.map((item,index)=>{
          return (
            <div key={index} className='h-[8vh] w-full flex items-center gap-2 pl-2 rounded-md hover:bg-gray-700'>
              {item.icon}
              <span className='h-full w-full text-sm font-medium relative'><Link href={item.link} className='h-full w-full absolute flex items-center'>{item.name}</Link></span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DashboardSidebar