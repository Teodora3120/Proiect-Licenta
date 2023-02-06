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
import React, { useEffect, useState } from 'react'
import { useLocation, Route, Switch, useHistory } from 'react-router-dom'
// reactstrap components
import { Container } from 'reactstrap'
// core components
import AdminNavbar from 'components/Navbars/AdminNavbar.js'
import AdminFooter from 'components/Footers/AdminFooter.js'
import Sidebar from 'components/Sidebar/Sidebar.js'
import { useUserContext } from 'context/UserContext'

import routes from 'routes.js'

const Admin = (props) => {
  const [paths, setPaths] = useState([])
  const { user } = useUserContext()
  const history = useHistory()

  const mainContent = React.useRef(null)
  const location = useLocation()

  useEffect(() => {
    if (user && user.id) {
      switch (user.accountType) {
        case 'ADMIN':
          setPaths(routes.ADMIN)
          break
        case 'DOCTOR':
          setPaths(routes.DOCTOR)
          break
        case 'PATIENT':
          setPaths(routes.PATIENT)
          break
        default:
          setPaths(routes.PATIENT)
          break
      }
    }
  }, [history, user])

  React.useEffect(() => {
    document.documentElement.scrollTop = 0
    document.scrollingElement.scrollTop = 0
    mainContent.current.scrollTop = 0
  }, [location])

  const getRoutes = (routing) => {
    return routing.map((prop, key) => {
      if (prop.layout === '/admin') {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        )
      } else {
        return null
      }
    })
  }

  const getBrandText = (path) => {
    for (let i = 0; i < paths.length; i++) {
      if (
        props.location.pathname.indexOf(paths[i].layout + paths[i].path) !==
        -1
      ) {
        return paths[i].name
      }
    }
    return 'Brand'
  }

  return (
    <>
      <Sidebar
        {...props}
        routes={paths}
        logo={{
          innerLink: '/admin/index',
          imgSrc: require('../assets/img/brand/logo.png'),
          imgAlt: '...',
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props.location.pathname)}
        />
        <Switch>
          {getRoutes(paths)}
          {/* <Redirect from="*" to="/admin/index" /> */}
        </Switch>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  )
}

export default Admin
