import React, { useState, useEffect } from "react";
import { useLocation, Route, Routes, Navigate, useNavigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import { useUserContext } from "context/UserContext";

import routes from "routes.js";

const Admin = (props) => {
  const [paths, setPaths] = useState([])
  const { user } = useUserContext()
  const navigate = useNavigate()

  const mainContent = React.useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (user && user._id) {
      switch (String(user.type).toLowerCase()) {
        case 'admin':
          setPaths(routes.ADMIN)
          break
        case 'customer':
          setPaths(routes.CUSTOMER)
          break
        case 'worker':
          setPaths(routes.WORKER)
          break
        default:
          setPaths(routes.CUSTOMER)
          break
      }
    }
  }, [navigate, user])

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < paths.length; i++) {
      if (
        location.pathname.indexOf(paths[i].layout + paths[i].path) !==
        -1
      ) {
        return paths[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={paths}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/colored_logo_transparent_background.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(paths)}
          {/* <Route path="*" element={<Navigate to="/admin/index" replace />} /> */}
        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
