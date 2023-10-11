import Index from "views/Index.js";
import WProfile from "views/examples/WProfile.js";
import WSchedule from "views/examples/WSchedule";
import CProfile from "views/examples/CProfile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import Logout from "views/examples/Logout";

var routes = {
  ADMIN: [],
  CUSTOMER: [
    {
      path: "/index",
      name: "Dashboard",
      icon: "ni ni-tv-2 text-primary",
      component: <Index />,
      layout: "/admin",
    },
    {
      path: "/icons",
      name: "Icons",
      icon: "ni ni-planet text-blue",
      component: <Icons />,
      layout: "/admin",
    },
    {
      path: "/maps",
      name: "Maps",
      icon: "ni ni-pin-3 text-orange",
      component: <Maps />,
      layout: "/admin",
    },
    {
      path: "/my-profile",
      name: "My Profile",
      icon: "ni ni-single-02 text-yellow",
      component: <CProfile />,
      layout: "/admin",
    },
    {
      path: "/tables",
      name: "Tables",
      icon: "ni ni-bullet-list-67 text-red",
      component: <Tables />,
      layout: "/admin",
    },
    {
      path: "/login",
      name: "Login",
      icon: "ni ni-key-25 text-info",
      component: <Login />,
      layout: "/auth",
      hide: true
    },
    {
      path: "/register",
      name: "Register",
      icon: "ni ni-circle-08 text-pink",
      component: <Register />,
      layout: "/auth",
      hide: true
    },
    {
      path: "/logout",
      name: "Logout",
      icon: "ni ni-circle-08 text-pink",
      component: <Logout />,
      layout: "/auth",
      hide: true
    },
  ],
  WORKER: [
    {
      path: "/index",
      name: "Dashboard",
      icon: "ni ni-tv-2 text-primary",
      component: <Index />,
      layout: "/admin",
    },
    {
      path: "/my-profile",
      name: "My Profile",
      icon: "ni ni-single-02 text-yellow",
      component: <WProfile />,
      layout: "/admin",
    },
    {
      path: "/my-schedule",
      name: "My Schedule",
      icon: "ni ni-single-02 text-info",
      component: <WSchedule />,
      layout: "/admin",
    },
    {
      path: "/icons",
      name: "Icons",
      icon: "ni ni-planet text-blue",
      component: <Icons />,
      layout: "/admin",
      hide: true
    },
    {
      path: "/maps",
      name: "Maps",
      icon: "ni ni-pin-3 text-orange",
      component: <Maps />,
      layout: "/admin",
      hide: true
    },
    {
      path: "/tables",
      name: "Tables",
      icon: "ni ni-bullet-list-67 text-red",
      component: <Tables />,
      layout: "/admin",
      hide: true
    },
    {
      path: "/login",
      name: "Login",
      icon: "ni ni-key-25 text-info",
      component: <Login />,
      layout: "/auth",
      hide: true
    },
    {
      path: "/register",
      name: "Register",
      icon: "ni ni-circle-08 text-pink",
      component: <Register />,
      layout: "/auth",
      hide: true
    },
    {
      path: "/logout",
      name: "Logout",
      icon: "ni ni-circle-08 text-pink",
      component: <Logout />,
      layout: "/auth",
      hide: true
    },
  ]
}
export default routes;
