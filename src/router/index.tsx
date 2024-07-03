import SuspenseLazy from '@/components/SuspenseLazy';
import {Navigate, RouteObject} from 'react-router-dom';

import React from 'react';
import {Auth} from '@/router/Auth';


const Home = SuspenseLazy(() => import(/* webpackChunkName:"home" */ '@/view/Home'));
const HomerFormSubmit = SuspenseLazy(() => import(/* webpackChunkName:"home-one" */ '@/view/Home/HomeFormSubmit/HomerFormSubmit'));
const HomeTwo = SuspenseLazy(() => import(/* webpackChunkName:"home-two" */ '@/view/Home/HomeTwo'));
const HomeThree = SuspenseLazy(() => import(/* webpackChunkName:"home-three" */ '@/view/Home/HomeThree'));
const HomeFour = SuspenseLazy(() => import(/* webpackChunkName:"home-four" */ '@/view/Home/HomeFour'));
const HomeMobx = SuspenseLazy(() => import(/* webpackChunkName:"home-mobx" */ '@/view/Home/HomeMobx'));
const HomeIcon = SuspenseLazy(() => import(/* webpackChunkName:"home-icon" */ '@/view/Home/HomeIcon'));
const HomeOrder = SuspenseLazy(() => import(/* webpackChunkName:"home-order" */ '@/view/Home/HomeOrder'));
const Dashboard = SuspenseLazy(() => import(/* webpackChunkName:"dashboard" */ '@/view/Dashboard'));
const About = SuspenseLazy(() => import(/* webpackChunkName:"about" */ '@/view/About'));
const NotFound = SuspenseLazy(() => import(/* webpackChunkName:"not-found" */ '@/view/NotFound'));
const Login = SuspenseLazy(() => import(/* webpackChunkName:"not-found" */ '@/view/Login'));
const Signup = SuspenseLazy(() => import(/* webpackChunkName:"not-found" */ '@/view/Signup'));
// const isAuthenticated = Boolean(load('token')); // 根据实际的 Cookie 名称获取

const routes :RouteObject[] = [
    {
        path: '/',

        element: <Navigate to='login'></Navigate> // 重定向
    },
    {
        path: 'home',
        element: <Auth>{Home}</Auth>,


        children: [
            {
                path: 'FormSubmit',
                element: HomerFormSubmit
            },
            {
                path: 'two',
                element: HomeTwo
            },
            {
                path: 'three',
                element: HomeThree
            },
            {
                path: 'four',
                element: HomeFour
            },
            {
                path: 'mobx',
                element: HomeMobx
            },
            {
                path: 'icon',
                element: HomeIcon
            },
            {
                path: 'order',
                element: HomeOrder
            }
        ]
    },
    {
        path: 'dashboard',

        element: <Auth>{Dashboard}</Auth>,
    },
    {
        path: 'about',
        element: <Auth>{About}</Auth>,
    },
    {
        path: 'login',
        element: Login
    },
    {
        path: 'signup',
        element: Signup
    },
    {
        path: '*',
        element: NotFound
    }
];

const checkAuth = (routers:any, path:string)=>{
    for (const data of routers) {
        if (data.path==path) return data
        if (data.children) {
            const res:any = checkAuth(data.children, path)
            if (res) return res
        }
    }
    return null
}




export default routes;
