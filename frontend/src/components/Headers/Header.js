import { Card, CardBody, Container, Row, Col } from "reactstrap";
import "../../assets/css//custom.css"
import { useUserContext } from "context/UserContext";
import { useState } from "react";
import CustomerApi from "api/customer";
import WorkerApi from "api/worker";
import { useEffect } from "react";
import OrderApi from "api/order";
import moment from "moment";
import RatingApi from "api/rating";

function renderRatingStars(rating) {
  const stars = [];
  const integerPart = Math.floor(rating);
  const fractionalPart = rating - integerPart;

  if (fractionalPart > 0.9) {
    for (let i = 0; i < Math.ceil(rating); i++) {
      stars.push(<i className="fa-solid fa-star text-yellow" key={i} />);
    }
  } else if (fractionalPart > 0 && fractionalPart < 0.9) {
    for (let i = 0; i < integerPart; i++) {
      stars.push(<i className="fa-solid fa-star text-yellow" key={i} />);
    }

    stars.push(<i className="fa-regular fa-star-half-stroke text-yellow" key={integerPart} />);

  } else {
    for (let i = 0; i < integerPart; i++) {
      stars.push(<i className="fa-solid fa-star text-yellow" key={i} />);
    }
  }
  const remainingStars = 5 - stars.length;

  for (let i = 0; i < remainingStars; i++) {
    stars.push(<i className="fa-solid fa-star text-light" key={integerPart + i + 1} />);
  }
  return stars;
}


const Header = () => {
  const { user } = useUserContext();
  const [updatedUser, setUpdatedUser] = useState({})
  const [userPastOrders, setUserPastOrders] = useState(0)
  const [userFutureOrders, setUserFutureOrders] = useState(0)
  const [customerRatings, setCustomerRatings] = useState(0)
  const [workerReviews, setWorkerReviews] = useState(0)
  const [workerRating, setWorkerRating] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      await getUpdatedUser();

      if (user.type !== "admin") {
        await getUserOrders();
      }
      if (user.type === "customer") {
        await getCustomerRatings();
      } else if (user.type === "worker") {
        await getWorkerRatings();
      }
    }
    if (user && user._id) {
      fetchData();
    }
    //eslint-disable-next-line
  }, [user]);

  const getUpdatedUser = async () => {
    try {
      if (user.type === "customer") {
        const response = await CustomerApi.GetUserById(user._id);
        setUpdatedUser(response.data)
      } else if (user.type === "worker") {
        const response = await WorkerApi.GetUserById(user._id);
        setUpdatedUser(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getWorkerRatings = async () => {
    try {
      const response = await RatingApi.GetWorkerRating(user._id);
      setWorkerReviews(response.data?.reviews)
      setWorkerRating(response.data?.rating)
    } catch (error) {
      console.log(error)
    }
  }

  const getCustomerRatings = async () => {
    try {
      const response = await RatingApi.GetCustomerNumberOfRatings(user._id);
      setCustomerRatings(response.data.nrOfRatings);
    } catch (error) {
      console.log(error)
    }
  }

  const getUserOrders = async () => {
    try {
      const response = await OrderApi.GetOrders(user._id);
      const orders = response.data;

      const today = moment();

      const formattedDate = today.format('YYYY-MM-DD');

      const pastOrdersArr = [];
      const futureOrdersArr = [];

      orders.forEach((order) => {
        const orderDate = moment(order.date)

        if (orderDate.isBefore(formattedDate, 'day')) {
          pastOrdersArr.push(order);
        } else if (order.status === "On going") {
          futureOrdersArr.push(order);
        }
      });

      setUserPastOrders(pastOrdersArr?.length);
      setUserFutureOrders(futureOrdersArr?.length);
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <div className="header bg-header pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {user.type !== "admin" ? (<Row>
              <Col className="d-flex" lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 flex-fill">
                  <CardBody>
                    <Row>
                      <Col>
                        <h5 className="card-title text-uppercase text-muted mb-0">Past Orders</h5>
                        <span className="h2 font-weight-bold mb-0">{userPastOrders ? userPastOrders + " orders" : "No orders"}</span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                          <i className="fa-solid fa-chart-line"></i>
                        </div>
                      </Col>
                      <p className="mt-3 mb-0 ml-2 text-sm">
                        <span className={userPastOrders > 0 ? `text-success mr-2` : `text-danger mr-2`}>
                          <i className={userPastOrders > 0 ? `fa-solid fa-arrow-up` : 'fa-solid fa-arrow-down'}></i>
                        </span>
                        <span className="text-nowrap">since you joined our platform.</span>
                      </p>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col className="d-flex" lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 flex-fill">
                  <CardBody>
                    <Row>
                      <Col>
                        <h5 className="card-title text-uppercase text-muted mb-0">Future Orders</h5>
                        <span className="h2 font-weight-bold mb-0">{userFutureOrders ? userFutureOrders + " orders" : "No orders"}</span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                          <i className="fa-solid fa-chart-line"></i>
                        </div>
                      </Col>
                      <p className="mt-3 mb-0 ml-2 text-sm">
                        <span className={userFutureOrders > 0 ? `text-success mr-2` : `text-danger mr-2`}>
                          <i className={userFutureOrders > 0 ? `fa-solid fa-arrow-up` : 'fa-solid fa-arrow-down'}></i>
                        </span>
                        <span className="text-nowrap">since you joined our platform.</span>
                      </p>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              {user.type === "worker" ?
                <Col className="d-flex" lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0 flex-fill">
                    <CardBody>
                      <Row>
                        <Col>
                          <h5 className="card-title text-uppercase text-muted mb-0">Your rating</h5>
                          <span className="h2 font-weight-bold mb-0">
                            {renderRatingStars(workerRating)}
                          </span>
                        </Col>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                            <i className="fa-solid fa-star"></i>
                          </div>
                        </Col>
                        <p className="mt-3 mb-0 ml-2 text-sm">
                          <span className={workerRating > 3 ? `text-success mr-2` : workerRating === 3 ? `text-yellow mr-2` : `text-danger mr-2`}>
                            <i className={workerRating > 3 ? `fa-solid fa-arrow-up` : `fa-solid fa-arrow-down`}></i>
                          </span>
                          <span className="text-nowrap">{workerReviews > 0 && workerRating > 3 ? "your rating is very good" : workerReviews > 0 && workerRating === 3 ? "your rating is good" : workerReviews > 0 && workerRating < 3 ? "try to improve you services" : "no ratings received yet"}</span>
                        </p>
                      </Row>
                    </CardBody>
                  </Card>
                </Col> :
                <Col className="d-flex" lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0 flex-fill">
                    <CardBody>
                      <Row>
                        <Col>
                          <h5 className="card-title text-uppercase text-muted mb-0">Given reviews</h5>
                          <span className="h2 font-weight-bold mb-0">
                            {customerRatings > 0 ? customerRatings + " reviews" : "No reviews"}
                          </span>
                        </Col>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                            <i className="fa-solid fa-star"></i>
                          </div>
                        </Col>
                        <p className="mt-3 mb-0 ml-2 text-sm">
                          <span className={customerRatings > 0 ? `text-success mr-2` : `text-danger mr-2`}>
                            <i className={customerRatings > 0 ? `fa-solid fa-arrow-up` : `fa-solid fa-arrow-down`}></i>
                          </span>
                          <span className="text-nowrap">since you joined our platform.</span>
                        </p>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>}
              <Col className="d-flex" lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 flex-fill">
                  <CardBody>
                    <Row>
                      <Col>
                        <h5 className="card-title text-uppercase text-muted mb-0">History</h5>
                        <span className="h2 font-weight-bold mb-0">
                          {moment(updatedUser.createdAt).format("YYYY-MM-DD")}
                        </span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                          <i className="fa-solid fa-registered"></i>
                        </div>
                      </Col>
                      <p className="mt-3 mb-0 ml-2 text-sm">
                        <span className="text-primary mr-2">
                          <i className="fa-regular fa-calendar"></i>
                        </span>
                        <span className="text-nowrap">your register date on this platform</span>
                      </p>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>) : null}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
