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
} from 'reactstrap'
// core components
import UserHeader from 'components/Headers/UserHeader.js'
import { useUserContext } from 'context/UserContext'
import { useState, useEffect } from 'react'
import DoctorApi from 'api/doctor'
import PatientApi from 'api/patient'
import Swal from 'sweetalert2'
import AuthApi from 'api/auth'
import { useHistory } from 'react-router-dom'

const Profile = () => {
  const { user } = useUserContext()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [accountType, setAccountType] = useState('')
  const [speciality, setSpeciality] = useState('')
  const [description, setDescription] = useState('')
  const [username, setUsername] = useState('')
  const history = useHistory()
  const [price, setPrice] = useState()

  useEffect(() => {
    const fetchData = async () => {
      await getUser()
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const getUser = async () => {
    try {
      if (user.accountType === "DOCTOR") {
        const response = await DoctorApi.GetDoctorById(user.id);
        console.log(response.data)
        setEmail(user.email)
        setAccountType(user.accountType)
        setUsername(response.data.username)
        setFirstName(response.data.firstName)
        setLastName(response.data.lastName)
        setDescription(response.data.description)
        setPrice(response.data.appointmentPrice)
        setSpeciality(response.data.speciality)
      } else if (user.accountType === 'PATIENT') {
        const response = await PatientApi.GetPatientById(user.id);
        console.log(response.data)
        setEmail(user.email)
        setAccountType(user.accountType)
        setUsername(response.data.username)
        setFirstName(response.data.firstName)
        setLastName(response.data.lastName)
        setDescription(response.data.description)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateProfile = async () => {
    try {
      const data = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        description: description,
      }
      if (accountType === 'DOCTOR') {
        await DoctorApi.UpdateDoctor(user.id, { updateUserDto: data, appointmentPrice: Number(price) })
        const response = await DoctorApi.GetDoctorById(user.id);
        console.log(response.data)
        setUsername(response.data.username)
        setFirstName(response.data.firstName)
        setLastName(response.data.lastName)
        setDescription(response.data.description)
        setPrice(response.data.appointmentPrice)
      } else if (accountType === 'PATIENT') {
        await PatientApi.UpdatePatient(user.id, data)
        const response = await PatientApi.GetPatientById(user.id);
        setUsername(response.data.username)
        setFirstName(response.data.firstName)
        setLastName(response.data.lastName)
        setDescription(response.data.description)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deletePopup = async () => {
    const { value: password } = await Swal.fire({
      title: 'Sorry to see you go',
      text:
        'In order to permanently delete your account, please confirm your password.',
      icon: 'info',
      input: 'password',
      inputPlaceholder: 'Enter your password',
      inputAttributes: {
        maxlength: 30,
        autocapitalize: 'off',
        autocorrect: 'off',
      },
      confirmButtonText: 'Delete',
      showCloseButton: true
    })
    if (password) {
      try {
        await AuthApi.Login({
          email: user.email,
          password: password,
        })
        if (user.accountType === 'DOCTOR') {
          await DoctorApi.DeleteDoctor(user.id)
        } else if (user.accountType === 'PATIENT') {
          await PatientApi.DeletePatient(user.id)
        }
        history.push('/auth/logout')
      } catch (error) {
        return Swal.fire({
          title: 'Oops',
          text: 'Your password is wrong.',
          icon: 'error',
        })
      }
    }
  }

  return (
    <>
      <UserHeader firstName={firstName} lastName={lastName} />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0 d-flex" xl="4">
            <Card className="card-profile shadow flex-fill">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={require('../../assets/img/dashboard/default-avatar.jpg')}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4"></CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                  </div>
                </Row>
                <div className="text-center mt-6">
                  <h3>
                    {firstName} {lastName}
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="fas fa-globe mr-2" />
                    Romania
                  </div>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    {accountType ? accountType : "No information"}
                  </div>
                  {user.accountType === "DOCTOR" ?
                  <div>
                    <i className="ni education_hat mr-2" />
                    {speciality ? speciality : "No information"}
                  </div> : null}

                  <hr className="my-4" />
                  <p>{description}</p>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1 d-flex" xl="8">
            <Card className="bg-secondary shadow flex-fill">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col className="text-left">
                    <h2 className="mb-0">My account</h2>
                  </Col>
                  <Col className="text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={updateProfile}
                    >
                      Save Changes
                    </Button>
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
                            htmlFor="input-username"
                          >
                            Username
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={username}
                            id="input-username"
                            placeholder="Username"
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
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
                            defaultValue={email}
                            id="input-email"
                            placeholder="jesse@example.com"
                            type="email"
                            style={{ pointerEvents: 'none' }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
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
                            maxLength={20}
                            className="form-control-alternative"
                            defaultValue={firstName}
                            id="input-first-name"
                            placeholder="First name"
                            type="text"
                            onChange={(e) => setFirstName(e.target.value)}
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
                            maxLength={20}
                            className="form-control-alternative"
                            defaultValue={lastName}
                            id="input-last-name"
                            placeholder="Last name"
                            type="text"
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {user.accountType === "DOCTOR" ?
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-price"
                            >
                              Price
                            </label>
                            <Input
                              max="999"
                              className="form-control-alternative"
                              defaultValue={price}
                              id="input-price"
                              placeholder="Appointment Price"
                              type="number"
                              onChange={(e) => setPrice(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row> : null}
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
                  <hr className="my-4" />
                  <h4
                    onClick={deletePopup}
                    className="text-left mb-0 mt-4 text-danger c-pointer"
                  >
                    Delete my Account
                  </h4>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Profile
