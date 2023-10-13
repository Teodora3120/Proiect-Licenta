import { useEffect, useState } from "react";
import Select from 'react-select'
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Label,
    InputGroup,
    Input,
    InputGroupAddon,
    InputGroupText,
    CardFooter,
} from "reactstrap";
import domainsJson from '../../utils/domains.json'
import citiesJson from '../../utils/cities.json'
import { useUserContext } from "context/UserContext";
import WorkerApi from "api/worker";
import DashboardApi from "api/dashboard";


const ratingOptions = [
    {
        value: 1,
        label: `O stea`
    },
    {
        value: 2,
        label: "Doua stele"
    },
    {
        value: 3,
        label: "Trei stele"
    },
    {
        value: 4,
        label: "Patru stele"
    },
    {
        value: 5,
        label: "Cinci stele"
    }
]

function concatenateServiceNames(userId, services) {

    const serviceNames = services.map((service) => {
        if (service.user === userId) {
            return service.name
        }
    });

    // Use the join method to concatenate the service names with a comma and space
    return serviceNames.join(', ');
}

function renderRatingStars(rating) {
    const stars = [];
    for (let i = 0; i < rating; i++) {
        stars.push(<i className="fa-solid fa-star text-yellow" />);
    }
    for (let i = rating; i < 5; i++) {
        stars.push(<i className="fa-solid fa-star text-light" />);
    }
    return stars;
}

const CustomerDashboard = () => {
    const [domain, setDomain] = useState("")
    const [errorDomain, setErrorDomain] = useState("")
    const [service, setService] = useState({})
    const [services, setServices] = useState([])
    const [searchWorkerValue, setSearchWorkerValue] = useState("")
    const [workers, setWorkers] = useState([])
    const { user } = useUserContext();

    useEffect(() => {
        const fetchData = async () => {
            await getServices();
            await getWorkers();
        }
        if (user && user._id) {
            fetchData();
        }
        //eslint-disable-next-line
    }, [user])


    const getServices = async () => {
        try {
            const response = await DashboardApi.GetAllServices()
            console.log(response.data)
            setServices(response.data)
        } catch (error) {
            console.log(error)
        }

    }

    const getWorkers = async () => {
        try {
            const response = await DashboardApi.GetAllWorkers()
            console.log(response.data)
            setWorkers(response.data)
        } catch (error) {
            console.log(error)
        }

    }

    return (<>
        <Row>
            <Col className="mb-5 mb-xl-0">
                <Row className="mb-5">
                    <Col>
                        <Card className="shadow">
                            <CardHeader className="bg-transparent">
                                <Row className="align-items-center">
                                    <Col>
                                        <h3>Search for services</h3>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Row className="mb-3">
                                    <Col xl="4" lg="4" md="4" sm="6" xs="12">
                                        <InputGroup className="input-group-alternative">
                                            <Input
                                                type="text"
                                                value={searchWorkerValue}
                                                onChange={(e) => setSearchWorkerValue(e.target.value)}
                                                placeholder="Search worker by name..."
                                            />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    {searchWorkerValue ? <i className="fa-solid fa-xmark mt-2 c-pointer" onClick={() => setSearchWorkerValue("")} /> : <i className="fa-solid fa-magnifying-glass mt-2" />}
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Label>City</Label>
                                        <Select
                                            options={
                                                citiesJson.map((cityObj) => {
                                                    return { value: cityObj.id, label: cityObj.name }
                                                })
                                            }
                                            defaultValue={domain}
                                            onChange={(e) => console.log(e)}
                                            isClearable
                                        />
                                    </Col>
                                    <Col>
                                        <Label>Domain</Label>
                                        <Select
                                            options={
                                                domainsJson.map((domainObj) => {
                                                    return { value: domainObj.id, label: domainObj.name }
                                                })
                                            }
                                            defaultValue={domain}
                                            onChange={(e) => console.log(e)}
                                            isClearable
                                        />
                                    </Col>
                                    <Col>
                                        <Label>Service</Label>
                                        <Select
                                            options={
                                                services ? services.map((service) => {
                                                    return { value: service._id, label: service.name }
                                                })
                                                    : []
                                            }
                                            defaultValue={domain}
                                            onChange={(e) => console.log(e)}
                                            isClearable
                                        />
                                    </Col>
                                    <Col>
                                        <Label>Ratings</Label>
                                        <Select
                                            options={ratingOptions}
                                            defaultValue=""
                                            onChange={(e) => console.log(e)}
                                            isClearable
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Card>
                    <CardBody>
                        <Row>
                            {workers?.length ? workers.map((worker, index) => {
                                return <Col xl="6" lg="6" md="6" sm="6" xs="12" key={index}>
                                    <Card className="shadow">
                                        <CardHeader className="py-3">
                                            <Row>
                                                <Col className="text-left">
                                                    <h3 className="mb-0"> {worker.firstName} {worker.lastName}</h3>
                                                </Col>
                                                <Col className="text-right">
                                                    <h4 className="mb--1">Rating:   {renderRatingStars(3)}</h4>
                                                    <span><small>3 reviews</small></span>
                                                </Col>
                                            </Row>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col xl="3" lg="3" md="3">
                                                    <a href="#profile-picture" onClick={(e) => e.preventDefault()}>
                                                        <img
                                                            alt="..."
                                                            className="rounded-circle img-fluid"
                                                            src={require("../../assets/img/brand/user-default-image-transparent-bg.png")}
                                                        />
                                                    </a>
                                                </Col>
                                                <Col>
                                                    <h5>Domain:  <span className="font-weight-500">{domainsJson[worker.domain - 1].name}</span></h5>
                                                    <h5>Services:  <span className="font-weight-500">{concatenateServiceNames(worker._id, services)}</span></h5>
                                                    <h5>City: <span className="font-weight-500">{citiesJson[worker.city - 1].name}</span></h5>
                                                    <h5>Phone: <span className="font-weight-500"> +{worker.telephoneNumber}</span></h5>
                                                    <h5>About: <span className="font-weight-500">{worker.description?.slice(0, 40)}...</span></h5>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                        <CardFooter className="py-3 border-0">
                                            <Row>
                                                <Col className="text-right">
                                                    <Button color="primary">Book</Button>
                                                </Col>
                                            </Row>
                                        </CardFooter>
                                    </Card>
                                </Col>
                            }) : null}

                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </>)
}


export default CustomerDashboard