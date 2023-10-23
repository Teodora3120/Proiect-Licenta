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
  Badge,
} from "reactstrap";
import { useUserContext } from "context/UserContext";
import { useWebSocket } from "context/WebsocketContext";
import { useEffect, useState } from "react"
import NotificationApi from "api/notification";




const AdminNavbar = (props) => {
  const [fullName, setFullName] = useState("")
  const [notifications, setNotifications] = useState([])
  const [unreadNotifications, setUnreadNotifications] = useState([])
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
      const notificationArr = response.data;
      let unreadNotif = [];
      if (notificationArr?.length) {
        for (const notification of notificationArr) {
          if (!notification.read) {
            unreadNotif = unreadNotif.push(notification);
          }
        }
        setUnreadNotifications(unreadNotif)
      }

      setNotifications(response.data)
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
            {/* Notification Bell and Dropdown */}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav>
                <i className={`ni ni-bell-55 text-lg mt-2 text-white`} />
                {unreadNotifications && unreadNotifications.length > 0 && (
                  <Badge color="danger" pill className="mb-3">
                    {unreadNotifications.length}
                  </Badge>
                )}
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                {notifications && notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <DropdownItem key={index} className="mb-3">
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-sm rounded-circle">
                          <img
                            alt="..."
                            src={require("../../assets/img/brand/worker_notification_image-removebg-preview.png")}
                          />
                        </span>
                        <span className="ml-2">{notification.message}</span>
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
