import React, { useState, useEffect } from 'react';
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/custom.css';
import { useUserContext } from 'context/UserContext';
import AuthApi from '../../api/auth';
import citiesJsonArray from '../../utils/cities.json';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


const hasSpecialChars = (password, rule) => {
  if (rule.split('').some((v) => password.includes(v))) {
    return true;
  }
  return false;
};

const calculateAge = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

const Register = () => {
  const [userType, setUserType] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cities, setCities] = useState([])
  const [telephoneNumber, setTelephoneNumber] = useState("")
  const [telephoneNumberError, setTelephoneNumberError] = useState("")

  const navigate = useNavigate();
  const { login: loginContext } = useUserContext();

  useEffect(() => {
    setError(null);
  }, [firstName, lastName, email, password, repeatPassword, dateOfBirth, city]);

  useEffect(() => {
    if (cities) {
      const citiesArray = citiesJsonArray.map((city) => {
        return { label: city.name, value: city.id }
      })
      setCities(citiesArray)
    }
    //eslint-disable-next-line
  }, [citiesJsonArray])

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const validEmail = (email) => {
    if (email) {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (emailPattern.test(email)) {
        return true;
      } else {
        return false;
      }
    }
  };

  const verifyCredentials = () => {
    if (creating) {
      return;
    }
    if (!validEmail(email)) {
      setError('Your email does not look valid.');
      return true;
    }
    if (calculateAge(dateOfBirth) < 18) {
      setError('You must be older than 18.')
      return true;
    }
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !repeatPassword ||
      !telephoneNumber ||
      !dateOfBirth ||
      !city ||
      !userType
    ) {
      setError('You must fill in all credentials.');
      return true;
    }
    if (password !== repeatPassword) {
      setError('Passwords do not match.');
      return true;
    }
    if (
      password.length < 8 ||
      !hasSpecialChars(password, '!#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~')
    ) {
      setError(
        'Please create a password longer than 8 characters which also contains at least one special character.'
      );
      return true;
    }
    return false;
  };

  const handleTelephoneNumber = (telephoneNumberString) => {
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

  useEffect(() => {
    handleTelephoneNumber(telephoneNumber)
  }, [telephoneNumber])

  const register = async () => {
    try {
      const error = verifyCredentials();
      if (error) {
        return;
      }
      setCreating(true);
      const credentials = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        dateOfBirth: dateOfBirth,
        city: city,
        type: userType,
        telephoneNumber: telephoneNumber
      };
      await AuthApi.Register(credentials);
      const userCredentials = await AuthApi.Login({
        email: email,
        password: password,
      })
      const user = userCredentials.data
      localStorage.setItem('user', JSON.stringify(user))
      loginContext()
      return navigate('/admin/my-profile')
    } catch (error) {
      console.log(error);
      setCreating(false);
      if (error && error.response.status === 401) {
        return setError("Email already exists.");
      }
      return setError('There has been an error.');
    }
  };

  return (
    <Col lg="6" md="8">
      <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            <h3>Sign up with credentials</h3>
          </div>
          <Form role="form">
            <FormGroup>
              <Row>
                <Col>
                  <Card className={userType === "customer" ? "bg-info" : ""}>
                    <div
                      onClick={() => setUserType(`customer`)}
                      className="border border-info register-box"
                    >
                      <i
                        className="fas fa-user text-info mt-1"
                        style={{ fontSize: '30px' }}
                      />
                      <h4 className="display-5 mt-3">Customer</h4>
                    </div>
                  </Card>
                </Col>
                <Col>
                  <Card className={userType === "worker" ? "bg-primary" : ""}>
                    <div
                      onClick={() => setUserType('worker')}
                      className="border border-primary register-box"
                    >
                      <i
                        className="fas fa-user-tie text-primary mt-1"
                        style={{ fontSize: '30px' }}
                      />
                      <h4 className="display-5 mt-3">Worker</h4>
                    </div>
                  </Card>
                </Col>
              </Row>
            </FormGroup>
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
                  autoComplete="email"
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <PhoneInput
                country="RO"
                placeholder="Enter phone number"
                value={String(telephoneNumber)}
                onChange={setTelephoneNumber} />
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fa-solid fa-cake-candles" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  placeholder="Date of birth"
                  type="date"
                  autoComplete="new-age"
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className='fa-solid fa-location-dot' />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  type="select"
                  value={city ?? ""}
                >
                  <option disabled value="">City</option>
                  {cities.map((city, index) => {
                    return <option value={city.value} key={index}>{city.label}</option>
                  })}
                </Input>
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
            {error ? (
              <h4 className="text-center text-danger mt-3 font-weight-400">
                {error}
              </h4>
            ) : null}
            {telephoneNumberError ? (
              <h4 className="text-center text-danger mt-3 font-weight-400">
                {telephoneNumberError}
              </h4>
            ) : null}
            <div className="text-center">
              <Button
                onClick={register}
                className="mt-3"
                color="primary"
                type="button"
                disabled={creating || telephoneNumberError}
              >
                {creating ? <Spinner size="sm" /> : 'Create account'}
              </Button>
              <p className="mt-4 mb--3" style={{ fontSize: '16px' }}>
                By clicking "Create account", you agree to our{' '}
                <span
                  className="text-primary"
                  onClick={toggleModal}
                  style={{ cursor: 'pointer' }}
                >
                  Terms and Policy
                </span>
                .
              </p>
            </div>
          </Form>
        </CardBody>
      </Card>
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} className="bg-secondary">Terms and Policy</ModalHeader>
        <ModalBody>
          {/* Your terms and policy content goes here */}
          <p>
            By signing up for an account on Schedule Mate, you agree to provide
            the following information, which may be used for various purposes
            including user identification and location services:
          </p>
          <ul>
            <li>Name (First and Last)</li>
            <li>Email Address</li>
            <li>Address for location purposes</li>
            <li>Documents for worker certification (if applicable)</li>
          </ul>
        </ModalBody>
        <ModalFooter>
          <Button color="info" size="sm" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </Col>
  );
};

export default Register;
