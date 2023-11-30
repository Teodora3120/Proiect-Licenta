/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import { useUserContext } from "context/UserContext";
import { useWebSocket } from "context/WebsocketContext";
import { useEffect, useState } from "react"
import NotificationApi from "api/notification";


const AdminNavbar = (props) => {
  const [fullName, setFullName] = useState("")
  const [notifications, setNotifications] = useState([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { message } = useWebSocket();

  useEffect(() => {
    if (user && user._id) {
      const fetchData = async () => {
        await getNotifications()
      }
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message])

  useEffect(() => {
    if (user && user.firstName && user.lastName) {
      setFullName(user.firstName + " " + user.lastName)
    }
  }, [user])

  useEffect(() => {
    if (user && user._id) {
      const fetchData = async () => {
        await getNotifications()
      }
      fetchData()
    }
  }, [user])

  const getNotifications = async () => {
    try {
      const response = await NotificationApi.GetAllNotifications(user._id);
      console.log(response)
      const notificationArr = response.data;
      let unreadNotif = 0;
      if (notificationArr?.length) {
        for (const notification of notificationArr) {
          if (!notification.read) {
            unreadNotif = unreadNotif + 1;
          }
        }
        setUnreadNotifications(unreadNotif)
        console.log(unreadNotif)
      }

      setNotifications(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const readNotification = async (notificationId) => {
    try {
      await NotificationApi.SetReadNotification(notificationId)
      if (user.type === "customer") {
        navigate("/admin/my-orders")
      } else {
        navigate("/admin/index")
      }
      getNotifications()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav>
                <i className={`fa-solid fa-bell text-lg mt-2 ${unreadNotifications > 0 ? "text-danger" : "text-white"}`} />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <DropdownItem className="noti-title text-lowercase" header tag="div">
                  <h4 className="text-left text-muted font-weight-600 py-0 mb-4 mt-1">You have <span className="text-danger">{unreadNotifications}</span> new notifications.</h4>
                </DropdownItem>
                {notifications && notifications.length > 0 ? (
                  notifications.reverse().map((notification, index) => (
                    <DropdownItem key={index} onClick={() => readNotification(notification._id)} className="mb-3">
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-sm rounded-circle">
                          <img
                            alt="..."
                            src={require("../../assets/img/brand/worker_notification_image-removebg-preview.png")}
                          />
                        </span>
                        <span className="ml-2">{notification.message}</span>
                        {notification.read === false ? (
                          <span>
                            <i className="fa-solid fa-circle text-danger ml-2"></i>
                          </span>
                        ) : null}
                      </div>
                    </DropdownItem>
                  ))
                ) : (
                  <DropdownItem>You've read all the notifications.</DropdownItem>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/brand/user-default-image-transparent-bg.png")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {fullName}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/my-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem onClick={() => navigate("/auth/logout")}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
