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
  Spinner,
} from 'reactstrap'
import StepWizard from 'react-step-wizard'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import '../../assets/css/custom.css'
import { useUserContext } from "context/UserContext";
import AuthApi from '../../api/auth'

const hasSpecialChars = (password, rule) => {
  console.log(rule.split(""))
  if (rule.split("").some(v => password.includes(v))) {
    return true;
  }
  return false;
}

const cities = [
  { value: 1, label: "Alba Iulia" },
  { value: 2, label: "Botosani" },
  { value: 3, label: "Iasi" }]

const Register = () => {
  const [accountType, setAccountType] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [age, setAge] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [creating, setCreating] = useState(false)

  const [stepWizardRef, setStepWizardRef] = useState(null)
  const navigate = useNavigate()
  const { login: loginContext } = useUserContext()

  useEffect(() => {
    setError(null)
  }, [firstName, lastName, email, password, repeatPassword, age, city])

  const handleRegister = async () => {
    const error = verifyCredentials()
    if (error) {
      return
    }
    if (accountType === 'customer') {
      return await registerCustomer()
    } else if (accountType === 'worker') {
      return await registerWorker()
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
      !repeatPassword ||
      !age ||
      !city
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

  const registerCustomer = async () => {
    try {
      setCreating(true)
      const credentials = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        age: age,
        city: city
      }
      const response = await AuthApi.Register(credentials)
      console.log(response)
      setCreating(false)
    } catch (err) {
      console.log(err)
      setCreating(false)
      if (err && err.message) {
        return setError(err.message)
      }
      return setError('There has been an error.')
    }
  }


  const registerWorker = async () => {
    try {
      setCreating(true)
      const credentials = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        age: age,
        city: city
      }
      const response = await AuthApi.Register(credentials)
      console.log(response)
      setCreating(false)
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
              setAge={setAge}
              setCity={setCity}
              error={error}
              handleRegister={handleRegister}
              accountType={accountType}
              stepWizardRef={stepWizardRef}
              creating={creating}
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
            <h3 className="text-center">Choose Your Account Type</h3>
            <Row className="mt-4">
              <Col>
                <div
                  onClick={() => handleType('customer')}
                  className="border border-info register-box"
                >
                  <i
                    className="fas fa-user text-info"
                    style={{ fontSize: '45px' }}
                  />
                  <h1 className="display-4 mt-3">I'm a customer</h1>
                </div>
              </Col>
              <Col>
                <div
                  onClick={() => handleType('worker')}
                  className="border border-primary register-box"
                >
                  <i
                    className="fa-solid fa-users-gear text-primary"
                    style={{ fontSize: '45px' }}
                  />
                  <h1 className="display-4 mt-3">I'm a worker</h1>
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
  setAge,
  setCity,
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
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fa-regular fa-list-ol" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
                type="number"
                autoComplete="new-age"
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <div className='d-flex align-items-center'>
              <i className="ni ni-pin-3 mr-2" />
              <Select
                options={cities}
                onChange={(e) => setCity(e.value)}
              ></Select>
            </div>
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
              {creating ? <Spinner size="sm" /> : 'Create account'}
            </Button>
          </div>
        </Form>
      </CardBody>
    </>
  )
}


export default Register