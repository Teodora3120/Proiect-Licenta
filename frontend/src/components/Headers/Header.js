import { Card, CardBody, CardHeader, Container, Row, Col } from "reactstrap";
import "../../assets/css//custom.css"
import { useUserContext } from "context/UserContext";

const Header = () => {
  const { user } = useUserContext();
  return (
    <>
      <div className="header bg-header pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <Col>
                        <h5 className="card-title text-uppercase text-muted mb-0">Past Orders</h5>
                        <span className="h2 font-weight-bold mb-0">4 orders</span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                          <i className="fa-solid fa-chart-line"></i>
                        </div>
                      </Col>
                      <p className="mt-3 mb-0 ml-2 text-sm">
                        <span className="text-success mr-2">
                          <i className="fa-solid fa-arrow-up"></i>
                        </span>
                        <span className="text-nowrap">since last month</span>
                      </p>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <Col>
                        <h5 className="card-title text-uppercase text-muted mb-0">Future Orders</h5>
                        <span className="h2 font-weight-bold mb-0">0 orders</span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                          <i className="fa-solid fa-chart-line"></i>
                        </div>
                      </Col>
                      <p className="mt-3 mb-0 ml-2 text-sm">
                        <span className="text-danger mr-2">
                          <i className="fa-solid fa-arrow-down"></i>
                        </span>
                        <span className="text-nowrap">since last month</span>
                      </p>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              {user.type === "worker" ? <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <Col>
                        <h5 className="card-title text-uppercase text-muted mb-0">Your rating</h5>
                        <span className="h2 font-weight-bold mb-0">
                          4 <i className="fa-solid fa-star text-yellow"></i>
                          <i className="fa-solid fa-star text-yellow"></i>
                          <i className="fa-solid fa-star text-yellow"></i>
                          <i className="fa-solid fa-star text-yellow"></i>
                        </span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </Col>
                      <p className="mt-3 mb-0 ml-2 text-sm">
                        <span className="text-success mr-2">
                          <i className="fa-solid fa-arrow-up"></i>
                        </span>
                        <span className="text-nowrap">your rating is very good</span>
                      </p>
                    </Row>
                  </CardBody>
                </Card>
              </Col> :
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <Col>
                          <h5 className="card-title text-uppercase text-muted mb-0">Given ratings</h5>
                          <span className="h2 font-weight-bold mb-0">
                            4
                          </span>
                        </Col>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                            <i className="fa-solid fa-star"></i>
                          </div>
                        </Col>
                        <p className="mt-3 mb-0 ml-2 text-sm">
                          <span className="text-success mr-2">
                            <i className="fa-solid fa-arrow-up"></i>
                          </span>
                          <span className="text-nowrap"></span>
                        </p>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>}
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <Col>
                        <h5 className="card-title text-uppercase text-muted mb-0">History</h5>
                        <span className="h2 font-weight-bold mb-0">
                          26.10.2023
                        </span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                          <i className="fa-solid fa-registered"></i>
                        </div>
                      </Col>
                      <p className="mt-3 mb-0 ml-2 text-sm">
                        <span className="text-success mr-2">
                          <i className="fa-solid fa-arrow-up"></i>
                        </span>
                        <span className="text-nowrap">your register date on this platform</span>
                      </p>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
