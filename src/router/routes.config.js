/**
 * @description router构造器的routes
 */

import Login from '@/views/Login/Login'
import Home from '@/views/Home/Home'

import Region from '@/views/Region'
export default [
    {  
      path: '/',
      component: Login
    },
    {
      path:'/home',
      component: Home,
      children: [
          {
            path: 'Region',
            component: Region
          }
      ]
    }
  ]