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
  Col
} from 'reactstrap'
import AuthApi from 'api/auth'
import { json, useNavigate } from 'react-router-dom'
import { useUserContext } from "context/UserContext";

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login: loginContext } = useUserContext()

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
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <h3>Sign in with credentials</h3>
            </div>
            <Form role="form">
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
        </Card>
      </Col>
    </>
  )
}

export default Login