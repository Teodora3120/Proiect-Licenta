
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
  Table,
  Label,
  CardFooter,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";

import UserHeader from "components/Headers/UserHeader.js";
import { useUserContext } from "context/UserContext";
import { useEffect, useState } from "react";
import citiesJson from '../../utils/cities.json'
import domainsJson from '../../utils/domains.json'
import WorkerApi from "api/worker";
import Select from 'react-select'
import AuthApi from "api/auth";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useNavigate } from "react-router-dom";

const WProfile = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("")
  const [age, setAge] = useState("")
  const [address, setAdress] = useState("")
  const [domain, setDomain] = useState("")
  const [service, setService] = useState({})
  const [serviceObjectEdit, setServiceObjectEdit] = useState({})
  const [services, setServices] = useState([])
  const [serviceObjectDeleteId, setServiceObjectDeleteId] = useState("")
  const [serviceError, setServiceError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpenDeleteAccount, setIsModalOpenDeleteAccount] = useState(false);
  const [description, setDescription] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [accountChanges, setAccountChanges] = useState(false)
  const [password, setPassword] = useState("")
  const [deleteAccountError, setDeleteAccountError] = useState("")
  const [errorDomain, setErrorDomain] = useState("")
  const [accountDetailsError, setAccountDetailsError] = useState("")
  const [telephoneNumber, setTelephoneNumber] = useState("")
  const [telephoneNumberError, setTelephoneNumberError] = useState("")
  const { user } = useUserContext();
  const navigate = useNavigate();


  useEffect(() => {
    if (user && user._id) {
      setFirstName(user?.firstName)
      setLastName(user?.lastName)
      setEmail(user?.email)
      setAge(user?.age)
      if (user?.telephoneNumber) {
        setTelephoneNumber('+' + String(user.telephoneNumber))
      }
    }
  }, [user])

  useEffect(() => {
    handleTelephoneNumber(telephoneNumber)
    //eslint-disable-next-line
  }, [telephoneNumber])

  useEffect(() => {
    setAccountDetailsError("")
  }, [lastName, age, address, description, telephoneNumber])

  useEffect(() => {
    setDeleteAccountError("")
  }, [password])

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
      await getUser()
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
    setServiceObjectDeleteId("")
  };

  const toggleModalDeleteAccount = () => {
    setIsModalOpenDeleteAccount(!isModalOpenDeleteAccount);
  };


  const handleTelephoneNumber = (telephoneNumberString) => {
    console.log(telephoneNumberString)
    if (telephoneNumberString && telephoneNumberString.length >= 2 && telephoneNumberString.slice(0, 2) !== "+4") {
      return setTelephoneNumberError("Your prefix should be for Romania.")
    }
    if (telephoneNumberString && telephoneNumberString.length > 4 && telephoneNumberString.slice(0, 4) !== "+407") {
      return setTelephoneNumberError("Your phone number must start with 07.")
    }
    if (telephoneNumberString && telephoneNumberString.length > 12) {
      return setTelephoneNumberError("Your phone number should have maximum 10 digits.")
    }
    setTelephoneNumber(telephoneNumberString)
    setTelephoneNumberError("")
  }



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

  const handleServiceEdit = (label, value) => {
    setServiceError("")
    if (label === "name") {
      serviceObjectEdit.name = value;
    } else if (label === "price") {
      serviceObjectEdit.price = Number(value)
    } else if (label === "description") {
      serviceObjectEdit.description = value
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
      const data = { ...service, domain: domain.id, userId: user._id }
      const response = await WorkerApi.CreateService(data)
      console.log(response)
      await getServices();
      toggleModal();
    } catch (error) {
      console.log(error)
    }

  }

  const editService = async () => {
    if (!serviceObjectEdit.name || !serviceObjectEdit.price || !serviceObjectEdit.description) {
      setServiceError("You must complete all fields.")
      return
    } else if (serviceObjectEdit.price < 1) {
      setServiceError("The price must be at least 1 RON.")
    }

    try {
      const response = await WorkerApi.EditService(serviceObjectEdit)
      console.log(response)
      await getServices();
      toggleModalEdit();
    } catch (error) {
      console.log(error)
    }

  }

  const deleteService = async () => {
    if (!serviceObjectDeleteId) {
      console.log(serviceObjectDeleteId)
      setServiceError("Service id not found.")
      return
    }
    try {
      const response = await WorkerApi.DeleteService(serviceObjectDeleteId)
      console.log(response)
      await getServices();
      toggleModalDelete();
    } catch (error) {
      console.log(error)
    }

  }


  const saveAccountChanges = async () => {
    if (!lastName || !age || !address || !description) {
      setAccountDetailsError("All fields must not be null.")
      return
    } else if (age < 18) {
      setAccountDetailsError("You must be older than 18.")
      return
    }
    try {
      const data = {
        lastName: lastName,
        age: age,
        address: address,
        description: description,
        telephoneNumber: telephoneNumber
      }
      const response = await WorkerApi.UpdateUserAccountDetails(user._id, data)
      const worker = response.data;
      setLastName(worker.lastName)
      setAge(worker.age)
      setAdress(worker.address)
      setDescription(worker.description)
      setTelephoneNumber('+' + String(worker.telephoneNumber))
      setAccountChanges(true)

      setTimeout(() => {
        setAccountChanges(false);
      }, 5000);
    } catch (error) {
      console.log(error)
    }
  }

  const saveDomain = async (domain) => {
    if (!domain.value) {
      return
    }
    try {
      const data = {
        domain: domain.value
      }
      const response = await WorkerApi.SaveDomain(user._id, data);
      const domainId = response.data
      if (domainId && domainsJson[domainId - 1]) {
        setDomain(domainsJson[domainId - 1])
      }
      await WorkerApi.DeleteAllServices(user._id);
      setServices([])
    } catch (error) {
      console.log(error)
      setErrorDomain("Couldn't save the domain.")
    }
  }

  const getUser = async () => {
    try {
      const response = await AuthApi.GetUserById(user._id)
      const newUser = response.data
      setLastName(newUser?.lastName)
      setAge(newUser?.age)
      setAdress(newUser?.address)
      setDescription(newUser?.description)
      setDomain(domainsJson[newUser?.domain - 1])
      console.log(user)
      if (newUser.telephoneNumber) {
        setTelephoneNumber('+' + String(newUser?.telephoneNumber))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getServices = async () => {
    try {
      const response = await WorkerApi.GetServices(user._id)
      setServices(response.data)
    } catch (error) {
      console.log(error)
    }

  }

  const deleteAccount = async () => {
    if (!password) {
      return setDeleteAccountError("Please write your password.")
    }
    try {
      const data = {
        email: user.email,
        password: password
      }
      await AuthApi.Login(data);
      await WorkerApi.DeleteAccount(user._id)
      toggleModalDeleteAccount();
      navigate("/auth/logout")
    } catch (error) {
      console.log(error)
      if (error.response.status === 401) {
        return setDeleteAccountError("Invalid password.")
      } else {
        return setDeleteAccountError("Couldn't delete your account.")
      }
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
                    {domain ? domain.name : "Unknown"}
                  </div>
                  <div className="h5 mt-4">
                    <i className="fa-solid fa-phone mr-2" />
                    {telephoneNumber ? telephoneNumber : "Unknown"}
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
                  <Col xs="8" className="text-left">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                  <Col className="text-right">
                    {accountChanges ? <h4 className="font-weight-400 text-nowrap text-success mb-0">Account changes saved successfully</h4> : null}
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
                            defaultValue={address}
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
                    <Row>
                      <Col>
                        <FormGroup>
                          <label>Telephone number</label>
                          <PhoneInput
                            country="RO"
                            placeholder="Enter phone number"
                            value={String(telephoneNumber)}
                            onChange={setTelephoneNumber} />
                        </FormGroup>
                        {telephoneNumberError ? <h4 className="font-weight-400 text-danger">{telephoneNumberError}</h4> : null}
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted">
                    Your services
                  </h6>
                  <small>These changes will be saved automatically</small>
                  <div className="pl-lg-4 mt-4">
                    <Row className="d-flex align-items-center">
                      <Col lg="7">
                        <Label>
                          Domain (maximum one domain) <i
                            className="fa-solid fa-circle-info text-primary ml-1"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Once you change your domain, the current services will be deleted from the database." />
                        </Label>
                        <Select
                          options={
                            domainsJson.map((domainObj) => {
                              return { value: domainObj.id, label: domainObj.name }
                            })
                          }
                          defaultValue={domain}
                          onChange={(e) => saveDomain(e)}
                          isClearable
                        />
                        {errorDomain ? <h4 className="font-weight-400 text-danger">{errorDomain}</h4> : ""}
                      </Col>
                      <Col lg="5" className="mt-xs-5">
                        <Row>
                          <Col>
                            <Label>Service (maximum 5 services)</Label>
                          </Col>
                        </Row>

                        <Button color="primary" size="sm" onClick={toggleModal} disabled={domain && services?.length < 5 ? false : true}> <i className="fa-solid fa-plus ml-2"></i> Add Custom Service</Button>
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
                                  <Button color="danger" size="sm" onClick={() => {
                                    toggleModalDelete();
                                    setServiceObjectDeleteId(service._id);
                                  }}>Delete</Button>
                                </td>
                              </tr>
                            }) :
                              <tr>
                                <td>
                                  <h4 className="font-weight-400 mt-2">There are no services to display.</h4>
                                </td>
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
              <CardFooter className="border-0">
                {accountDetailsError ? <h4 className="font-width-400 text-danger text-center">{accountDetailsError}</h4> : null}
                <Row className="align-items-center">
                  <Col className="text-left">
                    <p className="text-danger c-pointer font-weight-600 mb-0" onClick={toggleModalDeleteAccount}>
                      Delete account
                    </p>
                  </Col>
                  <Col className="text-right">
                    <Button
                      color="default"
                      disabled={telephoneNumberError || accountDetailsError ? true : false}
                      onClick={saveAccountChanges}
                    >
                      Save changes
                    </Button>
                  </Col>
                </Row>
              </CardFooter>
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
                  defaultValue=""
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
                  onChange={(e) => handleServiceEdit("name", e.target.value)}
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
                  onChange={(e) => handleServiceEdit("price", e.target.value)}
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
                  onChange={(e) => handleServiceEdit("description", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          {serviceError ? <h4 className="text-danger font-weight-400 text-right">{serviceError}</h4> : ""}
          <Button color="primary" size="sm" onClick={editService}>
            Edit
          </Button>
          <Button color="secondary" size="sm" onClick={toggleModalEdit}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isModalOpenDelete} toggle={toggleModalDelete}>
        <ModalHeader toggle={toggleModalDelete} className="bg-secondary">Delete service</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <h4>Are you sure that you want to delete this service?</h4>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          {serviceError ? <h4 className="text-danger font-weight-400 text-right">{serviceError}</h4> : ""}
          <Button color="primary" size="sm" onClick={deleteService}>
            Yes
          </Button>
          <Button color="secondary" size="sm" onClick={toggleModalDelete}>
            No
          </Button>
        </ModalFooter>
      </Modal>


      <Modal isOpen={isModalOpenDeleteAccount} toggle={toggleModalDeleteAccount}>
        <ModalHeader toggle={toggleModalDeleteAccount} className="bg-secondary">Delete your account</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <h4>Please write your password for confirmation</h4>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i
                        onClick={() => setShowPassword(!showPassword)}
                        className={
                          showPassword
                            ? 'fas fa-eye-slash c-pointer'
                            : 'fas fa-eye c-pointer'
                        }
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          {deleteAccountError ? <h4 className="text-danger font-weight-400 text-right">{deleteAccountError}</h4> : ""}
          <Button
            color="danger"
            onClick={deleteAccount}
            disabled={deleteAccountError || !password ? true : false}
          >
            Delete
          </Button>
          <Button color="secondary" onClick={() => {
            toggleModalDeleteAccount()
            setPassword("")
          }}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default WProfile;
