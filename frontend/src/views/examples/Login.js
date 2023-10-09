import { useEffect, useState } from 'react'
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
  Col,
  CardHeader,
  Row
} from 'reactstrap'
import AuthApi from 'api/auth'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from "context/UserContext";

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login: loginContext } = useUserContext()
  const { user } = useUserContext();

  useEffect(() => {
    setError(null)
  }, [email, password])

  const login = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      return setError('Please fill in your credentials.')
    }
    try {
      const credentials = {
        email: email,
        password: password,
      }
      console.log(credentials)
      const response = await AuthApi.Login(credentials)
      const user = response.data.user
      localStorage.setItem('user', JSON.stringify(user))
      loginContext();
      navigate('/admin/index')
    } catch (err) {
      console.log(err)
      return setError('There has been an error.')
    }
  }

  return (
    <>
      <Col lg="5" md="7">
        {!user || !user.token ? <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <h3>Sign in with credentials</h3>
            </div>
            <Form autoComplete='on' role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
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

              {error ? (
                <h4 className="text-center text-danger mt-3 font-weight-400">
                  {error}
                </h4>
              ) : null}
              <div className="text-center">
                <Button
                  onClick={login}
                  className="my-4"
                  color="primary"
                  type="submit"
                >
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card> :
          <Card>
            <CardHeader>
              <Row>
                <Col>
                  <h3 className='text-center text-muted'>Welcome back</h3>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Row>
                <Col className='text-center d-flex flex-column'>
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="rounded-circle img-fluid"
                      style={{ width: "75px" }}
                      src={require("../../assets/img/brand/user-default-image-transparent-bg.png")}
                    />
                  </a>
                  <span className='mt-2 font-weight-600'>
                    {user.firstName} {user.lastName}
                  </span>
                  {user.type === "customer" ? <small className='mt-2'>Find a worker for your needs </small> : user.type === "worker" ? <small className='mt-2'>Lets find some customers for you</small> : ""}
                  <Button color="primary" className='mt-4' onClick={() => navigate("/admin/index")} > Go to dashboard <i className='fa-solid fa-arrow-right text-white ml-1' /></Button>
                </Col>
              </Row>
            </CardBody>
          </Card>}

      </Col >
    </>
  )
}

export default Login