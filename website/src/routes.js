/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Logout from "views/examples/Logout";
import CreateAppointment from "views/dashboard/CreateAppointment";
import DoctorSchedule from "views/dashboard/DoctorSchedule";
import PatientSurvey from "views/dashboard/PatientSurvey";
import DoctorAppointments from "views/dashboard/DoctorAppointments";
import PatientAppointments from "views/dashboard/PatientAppointments";
import AddDeleteDrugs from "views/dashboard/AddDeleteDrugs";

const routes = {
  ADMIN: [],
  DOCTOR: [
    {
      path: "/user-profile",
      name: "My Profile",
      icon: "ni ni-single-02 text-primary",
      component: Profile,
      layout: "/admin"
    },
    {
      path: "/my-schedule",
      name: "My Schedule",
      icon: "ni ni-circle-08 text-primary",
      component: DoctorSchedule,
      layout: "/admin"
    },
    {
      path: "/doctor-appointments",
      name: "View Appointments",
      icon: "far fa-calendar-check text-primary",
      component: DoctorAppointments,
      layout: "/admin"
    },
    {
      path: "/add-delete-drugs",
      name: "Manage Drugs",
      icon: "fas fa-prescription-bottle-alt text-primary",
      component: AddDeleteDrugs,
      layout: "/admin"
    },
    {
      path: "/index",
      name: "Dashboard",
      icon: "ni ni-tv-2 text-primary",
      component: Index,
      layout: "/admin"
    },
    {
      path: "/login",
      name: "Login",
      icon: "ni ni-key-25 text-info",
      component: Login,
      layout: "/auth",
      hide: true
    },
    {
      path: "/register",
      name: "Register",
      icon: "ni ni-circle-08 text-pink",
      component: Register,
      layout: "/auth",
      hide: true
    },
    {
      path: "/logout",
      name: "Logout",
      icon: "ni ni-circle-08 text-pink",
      component: Logout,
      layout: "/auth",
      hide: true
    }
  ],
  PATIENT: [
    {
      path: "/user-profile",
      name: "My Profile",
      icon: "ni ni-single-02 text-yellow",
      component: Profile,
      layout: "/admin"
    },
    {
      path: "/survey",
      name: "Survey",
      icon: "fas fa-poll-h text-primary",
      component: PatientSurvey,
      layout: "/admin"
    },
    {
      path: "/create-appointment",
      name: "Create Appointment",
      icon: "far fa-calendar-check text-primary",
      component: CreateAppointment,
      layout: "/admin"
    },
    {
    path: "/patient-appointment",
    name: "My Appointments",
    icon: "far fa-calendar-check text-primary",
    component: PatientAppointments,
    layout: "/admin"
  },
    {
      path: "/index",
      name: "Dashboard",
      icon: "ni ni-tv-2 text-primary",
      component: Index,
      layout: "/admin"
    },
    {
      path: "/login",
      name: "Login",
      icon: "ni ni-key-25 text-info",
      component: Login,
      layout: "/auth",
      hide: true
    },
    {
      path: "/register",
      name: "Register",
      icon: "ni ni-circle-08 text-pink",
      component: Register,
      layout: "/auth",
      hide: true
    },
    {
      path: "/logout",
      name: "Logout",
      icon: "ni ni-circle-08 text-pink",
      component: Logout,
      layout: "/auth",
      hide: true
    }
  ]
};
export default routes;
