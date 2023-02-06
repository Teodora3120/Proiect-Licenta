/* eslint-disable react-hooks/exhaustive-deps */
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
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Label,
  Spinner,
} from 'reactstrap'
import StepWizard from 'react-step-wizard'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import AuthApi from 'api/auth'
import { useHistory } from 'react-router-dom'
import { useUserContext } from "context/UserContext";
import SpecialitiesApi from 'api/specialities'

const hasSpecialChars = (password, rule) => {
  if (rule.split("").some(v => password.includes(v))) {
    return true;
  }
  return false;
}
const Register = () => {
  const [accountType, setAccountType] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [creating, setCreating] = useState(false)

  const [stepWizardRef, setStepWizardRef] = useState(null)
  const history = useHistory()
  const { login: loginContext } = useUserContext()




  useEffect(() => {
    setError(null)
  }, [firstName, lastName, email, password, repeatPassword])

  const handleRegister = async () => {
    const error = verifyCredentials()
    if (error) {
      return
    }
    if (accountType === 'patient') {
      return await registerPatient()
    } else {
      stepWizardRef.nextStep()
    }
  }

  const verifyCredentials = () => {
    if (creating) {
      return
    }
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !repeatPassword
    ) {
      setError('You must fill in all credentials.')
      return true
    }
    if (password !== repeatPassword) {
      setError('Password do not match.')
      return true
    }
    if (password.length < 8 || !hasSpecialChars(password, "!#$%&'()*+,-./:;<=>?@[\\]^_`{|}~")) {
      setError('Please create a password longer than 8 characters which also contains at least one special character.')
      return true
    }
    return false
  }

  const registerPatient = async () => {
    try {
      setCreating(true)
      const credentials = {
        userDetails: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        }
      }
      await AuthApi.RegisterPatient(credentials)
      const user_response = await AuthApi.Login({
        email: email,
        password: password,
      })
      const user = user_response.data
      localStorage.setItem(
        'user',
        JSON.stringify({ ...user.userDetails, jwtToken: user.jwtToken }),
      )
      loginContext()
      return history.push('/admin/index')
    } catch (err) {
      console.log(err)
      setCreating(false)
      if (err && err.message) {
        return setError(err.message)
      }
      return setError('There has been an error.')
    }
  }

  const handleType = (value) => {
    setAccountType(value)
    stepWizardRef.nextStep()
  }

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <StepWizard transitions={{}} ref={(ref) => setStepWizardRef(ref)}>
            <FirstStep handleType={handleType} />

            <SecondStep
              setFirstName={setFirstName}
              setLastName={setLastName}
              setEmail={setEmail}
              setShowPassword={setShowPassword}
              showPassword={showPassword}
              setRepeatPassword={setRepeatPassword}
              setPassword={setPassword}
              error={error}
              handleRegister={handleRegister}
              accountType={accountType}
              stepWizardRef={stepWizardRef}
              creating={creating}
            />
            <ThirdStep
              firstName={firstName}
              lastName={lastName}
              email={email}
              password={password}
              history={history}
            />
          </StepWizard>
        </Card>
      </Col>
    </>
  )
}

const FirstStep = ({ handleType }) => {
  return (
    <>
      <CardBody className="px-lg-5 py-lg-5">
        <Row>
          <Col>
            <h3 className="text-center">Choose your Account type</h3>
            <Row className="mt-4">
              <Col>
                <div
                  onClick={() => handleType('patient')}
                  className="border border-info register-box"
                >
                  <i
                    className="fas fa-user text-info"
                    style={{ fontSize: '45px' }}
                  />
                  <h1 className="display-4 mt-3">I'm a patient</h1>
                </div>
              </Col>
              <Col>
                <div
                  onClick={() => handleType('doctor')}
                  className="border border-primary register-box"
                >
                  <i
                    className="fas fa-user-md text-primary"
                    style={{ fontSize: '45px' }}
                  />
                  <h1 className="display-4 mt-3">I'm a doctor</h1>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </CardBody>
    </>
  )
}

const SecondStep = ({
  setFirstName,
  setLastName,
  setEmail,
  setShowPassword,
  showPassword,
  setRepeatPassword,
  setPassword,
  error,
  handleRegister,
  accountType,
  creating,
}) => {
  return (
    <>
      <CardBody className="px-lg-5 py-lg-5">
        <div className="text-center text-muted mb-4">
          <h3>Sign up with credentials</h3>
        </div>
        <Form role="form">
          <FormGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-hat-3" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                type="text"
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-hat-3" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                type="text"
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-email-83" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                autoComplete="new-email"
              />
            </InputGroup>
          </FormGroup>
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
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="Confirm password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
              />
            </InputGroup>
          </FormGroup>
          <Row className="my-4">
            <Col xs="12">
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id="customCheckRegister"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor="customCheckRegister"
                >
                  <span className="text-muted">
                    I agree with the{' '}
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>
            </Col>
          </Row>
          {error ? (
            <h4 className="text-center text-danger mt-3 font-weight-400">
              {error}
            </h4>
          ) : null}
          <div className="text-center">
            <Button
              onClick={handleRegister}
              className="mt-4"
              color="primary"
              type="button"
              disabled={creating}
            >
              {accountType === 'patient' ? (
                <>{creating ? <Spinner size="sm" /> : 'Create account'}</>
              ) : (
                'Next step'
              )}
            </Button>
          </div>
        </Form>
      </CardBody>
    </>
  )
}

const ThirdStep = ({ firstName, lastName, email, password, history }) => {
  const [speciality, setSpeciality] = useState('')
  const [specialities, setSpecialities] = useState([])
  const [degreePhoto, setDegreePhoto] = useState('')
  const [profilePhoto, setProfilePhoto] = useState('')
  const [error, setError] = useState(null)
  const [creating, setCreating] = useState(false)
  // const [diplomaFile, setDiplomaFile] = useState(null);
  // const [profileFile, setProfileFile] = useState(null);
  // const [formDataToSend, setFormDataToSend] = useState(new FormData())
  const { login: loginContext } = useUserContext()

  useEffect(() => {
    const fetchData = async () => {
      await getSpecialities()
    }
    fetchData()
  }, [])

  const getSpecialities = async () => {
    try {
      const response = await SpecialitiesApi.GetSpecialities()
      setSpecialities(response.data)
    } catch (err) {
      setError("Error: Couldn't get the specialities.")
    }
  }

  const uploadFile = async (event, type) => {
    let blobFile = event.target.files[0]
    // let file = new File([blobFile], `file-${type}`, { type: blobFile.type });
    const img = new Image()
    let url = window.URL.createObjectURL(blobFile)
    img.src = url
    if (type === 'profile') {
      setProfilePhoto(img.src)
      // setProfileFile(file)
    } else if (type === 'degree') {
      setDegreePhoto(img.src)
      // setDiplomaFile(file)
    }
  }

  const verifyCredentials = () => {
    if (!speciality || !profilePhoto || !degreePhoto) {
      setError('Please fill in all required fields.')
      return true
    }
    return false
  }

  const registerDoctor = async () => {
    const error = verifyCredentials()
    if (error) {
      return
    }
    setCreating(true)
    try {
      const credentials = {
        userDetails: {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName
        },
        specialityId: speciality
      }
      await AuthApi.RegisterDoctor(credentials)
      const user_response = await AuthApi.Login({
        email: email,
        password: password,
      })
      const user = user_response.data
      localStorage.setItem(
        'user',
        JSON.stringify({ ...user.userDetails, jwtToken: user.jwtToken }),
      )

      // let formData = new FormData()
      // formData.append('ProfilePhoto', profileFile)
      // formData.append('DiplomaPhoto', diplomaFile)
      // console.log(formData.has("ProfilePhoto"), formData.has("DiplomaPhoto"), formData.forEach((item) => console.log(item)), formData)
      // const photos_response = await DoctorApi.SendPhotos(user.userDetails.id, formData)
      // console.log(photos_response)
      loginContext()
      return history.push('/admin/index')
    } catch (err) {
      console.log(err)
      setCreating(false)
      if (err && err.message) {
        return setError(err.message)
      }
      return setError('There has been an error.')
    }
  }

  return (
    <>
      <CardBody className="px-lg-5 py-lg-5">
        <div className="text-center text-muted mb-4">
          <h3>Let's complete your profile</h3>
        </div>
        <Form role="form">
          <FormGroup className="mb-3">
            <Label>Choose your speciality *</Label>
            <Select
              onChange={(spec) => setSpeciality(spec ? spec.value : '')}
              defaultValue={null}
              isSearchable
              isClearable
              name="speciality"
              options={specialities.map((item) => {
                return { label: item.name, value: item.id }
              })}
              className="basic-single"
              classNamePrefix="select"
            />
          </FormGroup>
          <Row>
            <Col lg="6" md="6" sm="6" xs="12" className="text-left">
              <FormGroup>
                <Label className="ws-0">Upload your Degree photo *</Label>
                <Input
                  accept=".png,.jpg,.jpeg,.svg"
                  onChange={(e) => uploadFile(e, 'degree')}
                  id="degree-photo"
                  className="d-none"
                  type="file"
                />
                <Label
                  className="c-pointer text-center"
                  style={{ border: '2px dotted gray', borderRadius: '10px' }}
                  htmlFor="degree-photo"
                >
                  <img
                    className="w-75"
                    src={
                      degreePhoto
                        ? degreePhoto
                        : require('assets/img/dashboard/degree-default.png')
                    }
                    alt="Degree"
                  />
                </Label>
              </FormGroup>
            </Col>
            <Col lg="6" md="6" sm="6" xs="12" className="text-left">
              <FormGroup>
                <Label className="ws-0">Upload your profile photo *</Label>
                <Input
                  accept=".png,.jpg,.jpeg,.svg"
                  onChange={(e) => uploadFile(e, 'profile')}
                  id="profile-photo"
                  className="d-none"
                  type="file"
                />
                <Label
                  className="c-pointer text-center"
                  style={{ border: '2px dotted gray', borderRadius: '10px' }}
                  htmlFor="profile-photo"
                >
                  <img
                    className="w-75"
                    src={
                      profilePhoto
                        ? profilePhoto
                        : require('assets/img/dashboard/profile-default-doctor.png')
                    }
                    alt="Profile"
                  />
                </Label>
              </FormGroup>
            </Col>
          </Row>
          {error ? (
            <h4 className="text-center text-danger mt-3 font-weight-400">
              {error}
            </h4>
          ) : null}
          <div className="text-center">
            <Button
              onClick={registerDoctor}
              className="mt-4"
              color="primary"
              type="button"
              disabled={creating}
            >
              {creating ? <Spinner size="sm" /> : 'Create account'}
            </Button>
          </div>
        </Form>
      </CardBody>
    </>
  )
}

export default Register
