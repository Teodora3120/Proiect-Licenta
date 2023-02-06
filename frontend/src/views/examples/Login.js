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
import { useHistory } from 'react-router-dom'
import { useUserContext } from "context/UserContext";

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const history = useHistory()
  const { login: loginContext } = useUserContext()

  useEffect(() => {
    setError(null)
  }, [email, password])

  const login = async (e) => {
    if (e) e.preventDefault()
    if (!email || !password) {
      return setError('Please fill in your credentials.')
    }
    try {
      const credentials = {
        email: email,
        password: password,
      }
      const response = await AuthApi.Login(credentials)
      const user = response.data
      localStorage.setItem(
        'user',
        JSON.stringify({ ...user.userDetails, jwtToken: user.jwtToken }),
      )
      loginContext();
      return history.push('/admin/index')
    } catch (err) {
      console.log(err)
      if (err && err.response && err.response.data) {
        return setError(err.response.data)
      }
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
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
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
