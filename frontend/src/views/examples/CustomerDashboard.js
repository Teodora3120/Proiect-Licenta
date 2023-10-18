import { useEffect, useState } from "react";
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
    FormGroup,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Table,
    CardTitle
} from "reactstrap";
import domainsJson from '../../utils/domains.json'
import citiesJson from '../../utils/cities.json'
import { useUserContext } from "context/UserContext";
import { useNavigate } from "react-router-dom";
import ServiceApi from "api/service";
import WorkerApi from "api/worker";
import Select from 'react-select'
import OrderApi from "api/order";

const ratingOptions = [
    {
        value: 1,
        label: `One star`
    },
    {
        value: 2,
        label: "Two stars"
    },
    {
        value: 3,
        label: "Three stars"
    },
    {
        value: 4,
        label: "Four stars"
    },
    {
        value: 5,
        label: "Five stars"
    }
];

function concatenateServiceNames(userId, services) {
    const serviceNames = services
        .filter((service) => service.user === userId)
        .map((service) => service.name);

    return serviceNames.join(', ');
}

function renderRatingStars(rating) {
    const stars = [];
    for (let i = 0; i < rating; i++) {
        stars.push(<i className="fa-solid fa-star text-yellow" key={i} />);
    }
    for (let i = rating; i < 5; i++) {
        stars.push(<i className="fa-solid fa-star text-light" key={i} />);
    }
    return stars;
}

function getDayName(dateString) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateString);
    const dayIndex = date.getDay();

    return daysOfWeek[dayIndex];
}

const CustomerDashboard = () => {
    const [domain, setDomain] = useState({});
    const [city, setCity] = useState({});
    const [rating, setRating] = useState({});
    const [errorDomain, setErrorDomain] = useState("");
    const [service, setService] = useState({});
    const [services, setServices] = useState([]);
    const [searchWorkerValue, setSearchWorkerValue] = useState("");
    const [workers, setWorkers] = useState([]);
    const [filteredWorkers, setFilteredWorkers] = useState([]);
    const { user } = useUserContext();
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
    const [domainDropdownOpen, setDomainDropdownOpen] = useState(false);
    const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);
    const [isModalOpenBook, setIsModalOpenBook] = useState(false);
    const [workerToBook, setWorkerToBook] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            await getServices();
            await getWorkers();
        }
        if (user && user._id) {
            fetchData();
        }
        //eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        // Filter workers based on the searchWorkerValue
        const filtered = workers.filter((worker) => {
            const fullName = `${worker.firstName} ${worker.lastName}`;
            return fullName.toLowerCase().includes(searchWorkerValue.toLowerCase());
        });
        setFilteredWorkers(filtered);
    }, [searchWorkerValue, workers]);

    useEffect(() => {
        const filtered = workers.filter((worker) => {

            const cityMatch = city.id ? worker.city === city.id : true;
            const domainMatch = domain.id ? worker.domain === domain.id : true;
            const serviceMatch = service._id ? worker.services.includes(service._id) : true;
            const ratingMatch = rating.value ? worker.rating === rating.value : true;

            return cityMatch && domainMatch && serviceMatch && ratingMatch;
        });
        setFilteredWorkers(filtered);
    }, [workers, city, domain, service, rating]);

    const toggleModalBook = () => {
        setIsModalOpenBook(!isModalOpenBook);
    };

    const getServices = async () => {
        try {
            const response = await ServiceApi.GetAllServices();
            setServices(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getWorkers = async () => {
        try {
            const response = await WorkerApi.GetAllWorkers();
            setWorkers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
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
                                    <Row className="flex-wrap">
                                        <Col xl="4" lg="4" md="10" sm="12" xs="12" className="mb-sm-4 text-left">
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
                                        <Col sm="12" xs="12" className="text-right">
                                            <div className="d-flex flex-wrap align-items-center justify-content-end">
                                                <FormGroup>
                                                    <Dropdown isOpen={cityDropdownOpen} direction="right" toggle={() => setCityDropdownOpen(!cityDropdownOpen)}>
                                                        <DropdownToggle caret>
                                                            {city && city.name ? city.name : "Select City"}
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            <DropdownItem key={0} onClick={() => setCity({})}>
                                                                No city
                                                            </DropdownItem>
                                                            {citiesJson.map((cityObj, index) => (
                                                                <DropdownItem key={index} onClick={() => setCity(cityObj)}>
                                                                    {cityObj.name}
                                                                </DropdownItem>
                                                            ))}
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Dropdown isOpen={domainDropdownOpen} direction="right" toggle={() => setDomainDropdownOpen(!domainDropdownOpen)}>
                                                        <DropdownToggle caret>
                                                            {domain && domain.name ? domain.name : "Select Domain"}
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            <DropdownItem key={0} onClick={() => setDomain({})}>
                                                                No domain
                                                            </DropdownItem>
                                                            {domainsJson.map((domainObj, index) => (
                                                                <DropdownItem key={index} onClick={() => setDomain(domainObj)}>
                                                                    {domainObj.name}
                                                                </DropdownItem>
                                                            ))}
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Dropdown isOpen={servicesDropdownOpen} direction="right" toggle={() => setServicesDropdownOpen(!servicesDropdownOpen)}>
                                                        <DropdownToggle caret>
                                                            {service && service.name ? service.name : "Select Service"}
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            <DropdownItem key={0} onClick={() => setService({})}>
                                                                No service
                                                            </DropdownItem>
                                                            {services ? services.map((service, index) => (
                                                                <DropdownItem key={index} onClick={() => setService(service)}>
                                                                    {service.name}
                                                                </DropdownItem>
                                                            )) : null}
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Dropdown isOpen={ratingDropdownOpen} direction="right" toggle={() => setRatingDropdownOpen(!ratingDropdownOpen)}>
                                                        <DropdownToggle caret>
                                                            {rating && rating.label ? rating.label : "Select Rating"}
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            <DropdownItem key={0} onClick={() => setRating({})}>
                                                                No rating
                                                            </DropdownItem>
                                                            {ratingOptions.map((option, index) => (
                                                                <DropdownItem key={index} onClick={() => setRating(option)}>
                                                                    {option.label}
                                                                </DropdownItem>
                                                            ))}
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </FormGroup>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Card>
                        <CardBody>
                            <Row>
                                {filteredWorkers?.length ? filteredWorkers.map((worker, index) => {
                                    return <Col xl="6" lg="6" md="12" sm="12" xs="12" key={index} className="d-flex mb-3">
                                        <Card className="shadow flex-fill">
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
                                                    <Col xl="3" lg="3" md="3" className="mb-sm-3 mb-xs-3">
                                                        <a href="#profile-picture" onClick={(e) => e.preventDefault()}>
                                                            <img
                                                                alt="..."
                                                                className="rounded-circle img-fluid avatar-xxl"
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
                                                        <Button color="primary" onClick={() => {
                                                            toggleModalBook()
                                                            setWorkerToBook(worker)
                                                        }}>Book</Button>
                                                    </Col>
                                                </Row>
                                            </CardFooter>
                                        </Card>
                                    </Col>
                                }) : <Col className="text-center" key="no-result">
                                    <h3 className="font-weight-500 text-muted">{`No results found for ${searchWorkerValue ? searchWorkerValue : city && city.name ? city.name : domain && domain.name ? domain.name : service && service.name ? service.name : rating && rating.label ? rating.label : ""}.`}</h3>
                                </Col>
                                }
                            </Row>
                        </CardBody>
                    </Card>

                    <BookModal
                        isModalOpenBook={isModalOpenBook}
                        toggleModalBook={toggleModalBook}
                        workerToBook={workerToBook}
                        services={services}
                        customer={user}
                    />
                </Col>
            </Row>
        </>
    );
}

export default CustomerDashboard;

const BookModal = ({ isModalOpenBook, toggleModalBook, workerToBook, services, customer }) => {
    const [workerServices, setWorkerServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedStartTime, setSelectedStartTime] = useState({})
    const [bookError, setBookError] = useState("")
    const [selectServiceError, setServiceError] = useState("")
    const [paid, setPaid] = useState("")
    const [showSeeOrdersButton, setShowSeeOrdersButton] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        setWorkerServices(services.filter(item => item.user === workerToBook._id));
    }, [services, workerToBook._id]);

    useEffect(() => {
        setBookError("")
    }, [selectedService, selectedStartTime, paid, selectedDate])

    useEffect(() => {
        setServiceError("")
    }, [selectedService])


    const createOrder = async () => {
        try {
            if (!selectedService._id || !selectedDate || !selectedStartTime.value || !paid) {
                console.log(selectedService._id, selectedDate, selectedStartTime.value, paid)
                return setBookError("You must complete all the fields.")
            }
            const data = {
                workerId: workerToBook._id,
                customerId: customer._id,
                serviceId: selectedService._id,
                date: selectedDate,
                start: selectedStartTime?.value,
                paid: paid
            }
            await OrderApi.CreateOrder(data)

            setShowSeeOrdersButton(true);
            setTimeout(() => {
                setShowSeeOrdersButton(false);
                setSelectedDate("");
                setSelectedStartTime({});
                setSelectedService(null);
                setPaid("");
                toggleModalBook();
            }, 5000);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Modal isOpen={isModalOpenBook} toggle={toggleModalBook} size="lg">
                <ModalHeader tag="h4" toggle={toggleModalBook} className="bg-secondary">
                    Book a service from {workerToBook && workerToBook._id ? workerToBook.lastName : "this worker"}
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <Label>1. Choose the service you'd like</Label>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Duration</th>
                                        <th scope="col">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workerServices && workerServices.length ? workerServices.map((service, index) => {
                                        return <tr onClick={() => setSelectedService(service)} className={`c-pointer ${service._id === selectedService?._id ? "selected-service" : ""}`} key={index}>
                                            <td>{service.name}</td>
                                            <td>{service.description}</td>
                                            <td>{service.duration} h</td>
                                            <td>{service.price} RON</td>
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
                    <Row>
                        <Col>
                            <Label>2. Select the date that you're available on</Label>
                            {selectServiceError ? <h4 className="text-danger font-weigth-400">{selectServiceError}</h4> : ""}
                            <Input
                                type="date"
                                value={selectedDate ? selectedDate : ""}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => {
                                    if (!selectedService) {
                                        return setServiceError("Select the service first.")
                                    }
                                    setSelectedDate(e.target.value)
                                }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <WorkerAvailableHours worker={workerToBook} selectedDate={selectedDate} selectedService={selectedService} selectedStartTime={selectedStartTime} setSelectedStartTime={setSelectedStartTime} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Label>2. Select how you want to pay the service</Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup check>
                                <Label check>
                                    <Input type="radio" name="paymentOption" onClick={() => setPaid("card")} />{' '}
                                    Pay by Card (in person)
                                </Label>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup check>
                                <Label check>
                                    <Input type="radio" name="paymentOption" onClick={() => setPaid("cash")} />{' '}
                                    Pay Cash (in person)
                                </Label>
                            </FormGroup>
                        </Col>
                    </Row>

                </ModalBody>
                <ModalFooter className="px-1">
                    <Row className="w-100 align-items-center">
                        <Col className="text-left">
                            <p className="mb-0 c-pointer font-weight-600 text-sm" onClick={toggleModalBook}>Cancel</p>
                        </Col>
                        <Col className="text-right text-nowrap">
                            {bookError ? <h4 className="text-danger font-weight-400 text-right">{bookError}</h4> : null}
                            {showSeeOrdersButton ? (
                                <Button color="success" onClick={() => {
                                    navigate("/admin/my-orders")
                                }}>
                                    See my orders
                                </Button>
                            ) : (
                                <Button outline color="primary" onClick={createOrder} disabled={bookError || selectServiceError ? true : false}>
                                    Book worker
                                </Button>
                            )}
                        </Col>
                    </Row>
                </ModalFooter>
            </Modal>
        </>
    )
}

const WorkerAvailableHours = ({ worker, selectedDate, selectedService, setSelectedStartTime, selectedStartTime }) => {

    const [schedule, setSchedule] = useState([])

    useEffect(() => {
        if (selectedDate && selectedService && selectedService._id) {
            getScheduleForADay()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, selectedService])


    const getScheduleForADay = async () => {
        try {
            const data = {
                date: selectedDate,
                day: getDayName(selectedDate),
                serviceId: selectedService._id
            }
            console.log(data)
            const response = await WorkerApi.GetScheduleForADay(data, worker._id)
            console.log(response)
            const scheduleArr = response.data;
            let parsedSchedule = []
            if (scheduleArr?.length) {
                parsedSchedule = scheduleArr.map((hour) => ({
                    value: hour,
                    label: hour,
                }));
            }
            setSchedule(parsedSchedule)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Row className="mt-3">
            <Col xl="12">
                <Card className="mb-3">
                    <CardBody>
                        <CardTitle tag="h5" className="text-center">
                            {selectedDate ? `Available Hours on ${getDayName(selectedDate)}` : "Select a date"}

                        </CardTitle>
                        <Row className="align-items-center justify-content-center">
                            <Col xl="6" lg="6" md="6" sm="12" xs="12">
                                {schedule.length > 0 ? (
                                    <Select
                                        onChange={(e) => setSelectedStartTime(e)}
                                        placeholder="Start time"
                                        type="select"
                                        value={selectedStartTime ?? schedule[0]}
                                        defaultValue={selectedStartTime ?? schedule[0]}
                                        options={schedule}
                                    />
                                ) : (
                                    <p className="text-center">No available hours on this day.</p>
                                )}
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};