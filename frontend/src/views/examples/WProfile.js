
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table
} from "reactstrap";
import ReactStars from "react-rating-stars-component";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { useUserContext } from "context/UserContext";
import { useEffect, useState } from "react";
import citiesJson from '../../utils/cities.json'
import WorkerApi from "api/worker";

const WProfile = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("")
  const [age, setAge] = useState("")
  const [address, setAdress] = useState("")
  const [domain, setDomain] = useState("Unknown")
  const [service, setService] = useState({})
  const [serviceObjectEdit, setServiceObjectEdit] = useState({})
  const [services, setServices] = useState([])
  const [serviceError, setServiceError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [description, setDescription] = useState("")
  const { user } = useUserContext();


  useEffect(() => {
    if (user && user._id) {
      setFirstName(user?.firstName)
      setLastName(user?.lastName)
      setEmail(user?.email)
      setAge(user?.age)
    }
  }, [user])

  useEffect(() => {
    if (citiesJson) {
      const cityObj = citiesJson.find((city) => {
        return city.id === Number(user?.city)
      })
      if (cityObj) {
        setCity(cityObj.name)
      }
    }
    //eslint-disable-next-line
  }, [user, citiesJson])

  useEffect(() => {
    const fetchData = async () => {
      await getServices()
    }
    if (user && user._id) {
      fetchData();
    }
    //eslint-disable-next-line
  }, [user])

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleModalEdit = () => {
    setIsModalOpenEdit(!isModalOpenEdit);
  };

  const toggleModalDelete = () => {
    setIsModalOpenDelete(!isModalOpenDelete);
  };


  const handleService = (label, value) => {
    setServiceError("")
    if (label === "name") {
      service.name = value;
    } else if (label === "price") {
      service.price = Number(value)
    } else if (label === "description") {
      service.description = value
    }
  }

  const createService = async () => {
    if (!service.name || !service.price || !service.description) {
      setServiceError("You must complete all fields.")
      return
    } else if (service.price < 1) {
      setServiceError("The price must be at least 1 RON.")
    }

    try {
      const data = { ...service, userId: user._id }
      const response = await WorkerApi.CreateService(data)
      console.log(response)
      await getServices();
      toggleModal();
    } catch (error) {
      console.log(error)
    }

  }


  const getServices = async () => {
    try {
      const response = await WorkerApi.GetServices(user._id)
      setServices(response.data.services)
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#profile-picture" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={require("../../assets/img/brand/user-default-image-transparent-bg.png")}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div>
                        <span className="heading">21</span>
                        <span className="description text-nowrap">Past bookings</span>
                      </div>
                      <div>
                        <span className="heading">1</span>
                        <span className="description">Reviews</span>
                      </div>
                      <div>
                        <span className="heading">3</span>
                        <span className="description text-nowrap">Coming booking</span>
                      </div>
                    </div>
                  </div>
                </Row>
                <Row>
                  <Col className="text-center mb-4">
                    <div className="mb--2">
                      <h3>Your rating</h3>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <ReactStars
                        count={5}
                        onChange={[]}
                        size={24}
                        activeColor="#ffd700"
                      />
                    </div>
                  </Col>
                </Row>
                <div className="text-center">
                  <div className="h5 font-weight-300">
                    <i className="fa-solid fa-location-dot mr-2" />
                    {city}, Romania
                  </div>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    {domain}
                  </div>
                  <hr className="my-4" />
                  <p>
                    {description ? description : "No description"}
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            First name
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={firstName}
                            id="input-first-name"
                            placeholder="Your first name..."
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Last name
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={lastName}
                            id="input-last-name"
                            placeholder="Your last name"
                            type="text"
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            defaultValue={email}
                            placeholder="Your email..."
                            type="email"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Your age
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={age}
                            id="input-username"
                            placeholder="Your age..."
                            type="number"
                            onChange={(e) => setAge(Number(e.target.value))}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Contact information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="8" md="8" sm="8" xs="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Address
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                            id="input-address"
                            placeholder="Your address..."
                            type="text"
                            onChange={(e) => setAdress(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4" md="4" sm="4" xs="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            City
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={city}
                            id="input-city"
                            placeholder="City..."
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">
                    Your services
                  </h6>
                  <div className="pl-lg-4">
                    <Row className="d-flex align-items-center">
                      <Col lg="7">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-domain"
                          >
                            Domain
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={domain}
                            id="input-domain"
                            placeholder="Your domain..."
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="5">
                        <div className="d-flex c-pointer text-center" onClick={toggleModal}>
                          <i className="fa-solid fa-plus mt-3 ml-2"></i>
                          <h5 className="ml-2 mt-3">Add custom service</h5>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-5">
                      <Col>
                        <Table className="align-items-center table-flush" responsive>
                          <thead className="thead-dark">
                            <tr>
                              <th scope="col" className="text-white">Name</th>
                              <th scope="col" className="text-white">Description</th>
                              <th scope="col" className="text-white">Price</th>
                              <th scope="col" className="text-white">Action 1</th>
                              <th scope="col" className="text-white">Action 2</th>
                              <th scope="col" />
                            </tr>
                          </thead>
                          <tbody>
                            {services && services.length ? services.map((service, index) => {
                              return <tr key={index}>
                                <td>{service.name}</td>
                                <td>{service.description}</td>
                                <td>{service.price} RON</td>
                                <td>
                                  <Button color="info" size="sm" onClick={() => {
                                    toggleModalEdit();
                                    setServiceObjectEdit(service)
                                  }}>Edit</Button>
                                </td>
                                <td>
                                  <Button color="danger" size="sm">Delete</Button>
                                </td>
                              </tr>
                            }) :
                              <tr>
                                <h4 className="font-weight-400 mt-2">There are no services to display.</h4>
                              </tr>}

                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small text-muted mb-4">About me</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label>About Me</label>
                      <Input
                        className="form-control-alternative"
                        placeholder="A few words about you ..."
                        rows="4"
                        defaultValue={description}
                        type="textarea"
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </FormGroup>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} className="bg-secondary">Add new service</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-service-name"
                >
                  Name
                </label>
                <Input
                  className="form-control-alternative"
                  defaultValue=""
                  id="input-address"
                  placeholder="New service..."
                  type="text"
                  onChange={(e) => handleService("name", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-service-price"
                >
                  Price (in RON)
                </label>
                <Input
                  className="form-control-alternative"
                  defaultValue={0}
                  id="input-address"
                  placeholder="Cost of the service..."
                  type="number"
                  onChange={(e) => handleService("price", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-service-description"
                >
                  Description of service
                </label>
                <Input
                  className="form-control-alternative"
                  defaultValue="None..."
                  id="input-address"
                  placeholder="Describe the service..."
                  type="text"
                  onChange={(e) => handleService("description", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          {serviceError ? <h4 className="text-danger font-weight-400 text-right">{serviceError}</h4> : ""}
          <Button color="primary" size="sm" onClick={createService}>
            Add New Service
          </Button>
          <Button color="secondary" size="sm" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>


      <Modal isOpen={isModalOpenEdit} toggle={toggleModalEdit}>
        <ModalHeader toggle={toggleModalEdit} className="bg-secondary">Edit service</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-service-name"
                >
                  Name
                </label>
                <Input
                  className="form-control-alternative"
                  defaultValue={serviceObjectEdit.name}
                  id="input-address"
                  type="text"
                  onChange={(e) => handleService("name", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-service-price"
                >
                  Price (in RON)
                </label>
                <Input
                  className="form-control-alternative"
                  defaultValue={serviceObjectEdit.price}
                  id="input-address"
                  type="number"
                  onChange={(e) => handleService("price", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-service-description"
                >
                  Description of service
                </label>
                <Input
                  className="form-control-alternative"
                  defaultValue={serviceObjectEdit.description}
                  id="input-address"
                  type="text"
                  onChange={(e) => handleService("description", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          {serviceError ? <h4 className="text-danger font-weight-400 text-right">{serviceError}</h4> : ""}
          <Button color="primary" size="sm" onClick={createService}>
            Edit
          </Button>
          <Button color="secondary" size="sm" onClick={toggleModalEdit}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default WProfile;
