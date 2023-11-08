
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
    CardFooter,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from "reactstrap";

import UserHeader from "components/Headers/UserHeader.js";
import { useUserContext } from "context/UserContext";
import { useEffect, useState } from "react";
import citiesJson from '../../utils/cities.json'
import CustomerApi from "api/customer";
import AuthApi from "api/auth";
import { useNavigate } from "react-router-dom";

const CProfile = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [city, setCity] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [address, setAdress] = useState("")
    const [isModalOpenDeleteAccount, setIsModalOpenDeleteAccount] = useState(false);
    const [telephoneNumber, setTelephoneNumber] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [accountChanges, setAccountChanges] = useState(false)
    const [password, setPassword] = useState("")
    const [deleteAccountError, setDeleteAccountError] = useState("")
    const [accountDetailsError, setAccountDetailsError] = useState("")
    const { user } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user._id) {
            setFirstName(user?.firstName)
            setLastName(user?.lastName)
            setEmail(user?.email)
            setDateOfBirth(user?.dateOfBirth)
            setTelephoneNumber('+' + String(user?.telephoneNumber))
        }
    }, [user])

    useEffect(() => {
        setAccountDetailsError("")
    }, [lastName, address])

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
            await getUser()
        }
        if (user && user._id) {
            fetchData();
        }
        //eslint-disable-next-line
    }, [user])


    const toggleModalDeleteAccount = () => {
        setIsModalOpenDeleteAccount(!isModalOpenDeleteAccount);
    };


    const saveAccountChanges = async () => {
        if (!lastName || !address) {
            setAccountDetailsError("All fields must not be null.")
            return
        }
        try {
            const data = {
                lastName: lastName,
                address: address,
            }
            const response = await CustomerApi.UpdateUserAccountDetails(user._id, data)
            const customer = response.data;
            setLastName(customer.lastName)
            setAdress(customer?.address)
            setAccountChanges(true)

            setTimeout(() => {
                setAccountChanges(false);
            }, 5000);
        } catch (error) {
            console.log(error)
        }
    }

    const getUser = async () => {
        try {
            const response = await CustomerApi.GetUserById(user._id)
            const newUser = response.data
            setLastName(newUser?.lastName)
            setDateOfBirth(newUser?.dateOfBirth)
            setAdress(newUser?.address)
            setTelephoneNumber('+' + String(newUser?.telephoneNumber))
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
            await CustomerApi.DeleteAccount(user._id)
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
                                <div className="text-center">
                                    <div className="h5 font-weight-300">
                                        <i className="fa-solid fa-location-dot mr-2" />
                                        {city}, Romania
                                    </div>
                                    <div className="h5 mt-4">
                                        <i className="fa-solid fa-phone mr-2" />
                                        {telephoneNumber ? telephoneNumber : "Unknown"}
                                    </div>
                                    <div className="h5 mt-4">
                                        <i className="fa-solid fa-envelope mr-2" />
                                        {email ? email : "Unknown"}
                                    </div>
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
                                                        Your date of birth
                                                    </label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        value={dateOfBirth}
                                                        id="input-date-of-birth"
                                                        type="date"
                                                        disabled
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
                                            onClick={saveAccountChanges}
                                            disabled={accountDetailsError ? true : false}
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

export default CProfile;
