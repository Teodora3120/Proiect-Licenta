import Index from "views/Index.js";
import WProfile from "views/examples/WProfile.js";
import WSchedule from "views/examples/WSchedule";
import CProfile from "views/examples/CProfile.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Logout from "views/examples/Logout";
import CustomerOrders from "views/examples/CustomerOrders";
import Support from "views/examples/Support";
import AdminSupport from "views/examples/AdminSupport";

var routes = {
  ADMIN: [
    {
      path: "/index",
      name: "Data",
      icon: "ni ni-chart-bar-32 text-primary",
      component: <Index />,
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
      path: "/admin-support",
      name: "Support",
      icon: "ni ni-settings-gear-65 text-red",
      component: <AdminSupport />,
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
      path: "/logout",
      name: "Logout",
      icon: "ni ni-circle-08 text-pink",
      component: <Logout />,
      layout: "/auth",
      hide: true
    },
  ],
  CUSTOMER: [
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
      component: <CProfile />,
      layout: "/admin",
    },
    {
      path: "/my-orders",
      name: "My Orders",
      icon: "ni ni-cart text-info",
      component: <CustomerOrders />,
      layout: "/admin",
    },
    {
      path: "/support",
      name: "Support",
      icon: "ni ni-settings-gear-65 text-red",
      component: <Support />,
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
      path: "/support",
      name: "Support",
      icon: "ni ni-settings-gear-65 text-red",
      component: <Support />,
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
  ]
}
export default routes;
