import { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Table,
    Container,
    Pagination,
    PaginationItem,
    PaginationLink,
    Modal,
    ModalHeader,
    ModalBody,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle
} from "reactstrap";
import ServiceApi from "api/service";
import OrderApi from "api/order";
import Header from "components/Headers/Header";
import { useUserContext } from "context/UserContext";
import moment from "moment";
import WorkerApi from "api/worker";
import { Rating } from 'react-simple-star-rating'
import RatingApi from "api/rating";
import citiesJson from '../../utils/cities.json'
import domainsJson from '../../utils/domains.json'


function renderRatingStars(rating) {
    const stars = [];

    const integerPart = Math.floor(rating);
    const fractionalPart = rating - integerPart;

    if (fractionalPart > 0.9) {
        for (let i = 0; i < Math.ceil(rating); i++) {
            stars.push(<i className="fa-solid fa-star text-yellow" key={i} />);
        }
    } else if (fractionalPart > 0 && fractionalPart < 9) {
        for (let i = 0; i < integerPart; i++) {
            stars.push(<i className="fa-solid fa-star text-yellow" key={i} />);
        }

        stars.push(<i className="fa-regular fa-star-half-stroke text-yellow" key={integerPart} />);

    } else {
        for (let i = 0; i < integerPart; i++) {
            stars.push(<i className="fa-solid fa-star text-yellow" key={i} />);
        }
    }
    const remainingStars = 5 - stars.length;

    for (let i = 0; i < remainingStars; i++) {
        stars.push(<i className="fa-solid fa-star text-light" key={integerPart + i + 1} />);
    }

    return stars;
}

function formatDate(inputDate) {
    const parsedDate = moment(inputDate);
    const formattedDate = parsedDate.format('Do [of] MMMM YYYY');

    return formattedDate;
}


const ordersTimeRange = [
    {
        time: 0,
        title: "All"
    },
    {
        time: 1,
        title: "Last month"
    },
    {
        time: 3,
        title: "Last 3 months"
    },
    {
        time: 6,
        title: "Last 6 months"
    },
    {
        time: 12,
        title: "Last year"
    }, {
        time: 24,
        title: "Last two years"
    }
]
const CustomerOrders = () => {
    const [orders, setOrders] = useState([])
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [services, setServices] = useState([])
    const [workers, setWorkers] = useState([])
    const [workerModalOpen, setWorkerModalOpen] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDuration, setSelectedDuration] = useState(ordersTimeRange[0]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user } = useUserContext();
    const itemsPerPage = 8;

    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleSelectDuration = (duration) => {
        setSelectedDuration(duration);
        setDropdownOpen(false);
        filterOrdersByDuration(duration);
    };

    const filterOrdersByDuration = (duration) => {
        const today = moment();
        const filteredOrdersArr = orders.filter((order) => {
            const orderDate = moment(order.date);
            switch (duration.time) {
                case 0: // All
                    return true;
                default:
                    return orderDate.isAfter(today.clone().subtract(duration.time, 'months'));
            }
        });
        setFilteredOrders(filteredOrdersArr);
    };


    const handleWorkerClick = (worker) => {
        setSelectedWorker(worker);
        setWorkerModalOpen(true);
    };

    useEffect(() => {
        if (user._id) {
            const fetchData = async () => {
                await getOrders();
                await getAllServices()
                await getAllWorkers()
            }
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const getOrders = async () => {
        try {
            const response = await OrderApi.GetOrders(user._id)
            setOrders(response.data)
            setFilteredOrders(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    const getAllServices = async (workerId) => {
        try {
            const response = await ServiceApi.GetAllServices()
            setServices(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllWorkers = async () => {
        try {
            const response = await WorkerApi.GetAllWorkers()
            setWorkers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const cancelOrder = async (orderId, userId) => {
        try {
            await OrderApi.UpdateOrder({
                orderId,
                userId,
                status: 'Canceled'
            });
            getOrders();
        } catch (error) {
            console.log(error)
        }
    }

    const handleRating = async (rate, worker, order) => {
        try {
            const data = {
                workerId: worker._id,
                customerId: user._id,
                orderId: order._id,
                stars: rate
            }

            await RatingApi.CreateRating(data)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <Row>
                                    <Col>
                                        <h2>My orders</h2>
                                    </Col>
                                    <Col className="text-right mr-2">
                                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} direction="left">
                                            <DropdownToggle caret>
                                                {selectedDuration.title}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                {ordersTimeRange.map((orderTimeRange) => {
                                                    return <DropdownItem
                                                        onClick={() => handleSelectDuration(orderTimeRange)}>{orderTimeRange.title}</DropdownItem>

                                                })}

                                            </DropdownMenu>
                                        </Dropdown>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <Table className="align-items-center table-flush" responsive>
                                            <thead className="thead-light">
                                                <tr>
                                                    <th scope="col">Service name</th>
                                                    <th scope="col">Worker</th>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Price</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Contact info</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredOrders && filteredOrders.length ?
                                                    filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date))
                                                        .slice(startIndex, endIndex)
                                                        .map((order, index) => {
                                                            const service = services?.length ? services.find((serviceObj) => {
                                                                return serviceObj._id === order.serviceId
                                                            }) : {}
                                                            const worker = workers?.length ? workers.find((workerObj) => {
                                                                return workerObj._id === order.workerId
                                                            }) : {}
                                                            return <tr key={index}>
                                                                <td>{service.name}</td>
                                                                <td data-toggle="tooltip" data-placement="top" title={`See ${worker.firstName}'s profile`}>
                                                                    <span
                                                                        style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                                                                        onClick={() => handleWorkerClick(worker)}
                                                                    >
                                                                        {worker.firstName} {worker.lastName}
                                                                    </span>
                                                                </td>
                                                                <td>{formatDate(order.date)}, {order.start} </td>
                                                                <td>{service.price} RON</td>
                                                                <td>
                                                                    <span className={`${order.status === 'Completed' ? 'text-success' :
                                                                        order.status === 'Canceled' ? 'text-danger' : ''
                                                                        }`}>
                                                                        {order.status}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <h6>{worker.email}</h6>
                                                                    <h6>+{worker.telephoneNumber}</h6>
                                                                    {worker.telephoneNumer}
                                                                </td>
                                                                <td>
                                                                    {order.status === 'On going' ? (
                                                                        <Button color="danger" size="sm" onClick={() => cancelOrder(order._id, user._id)}>
                                                                            Cancel
                                                                        </Button>
                                                                    ) : order.status === 'Completed' ? (
                                                                        order.rating ? (
                                                                            <h4>{renderRatingStars(order.rating)}</h4>
                                                                        ) : (
                                                                            <Rating onClick={(e) => handleRating(e, worker, order)} size="20" />
                                                                        )
                                                                    ) : (
                                                                        '-'
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        }) :
                                                    <tr>
                                                        <td>
                                                            <h4 className="font-weight-400 mt-2">There are no orders to display.</h4>
                                                        </td>
                                                    </tr>}

                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="d-flex justify-content-center align-items-center">
                                        <Pagination className="mt-3">
                                            <PaginationItem disabled={currentPage === 1}>
                                                <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                                            </PaginationItem>
                                            {[...Array(totalPages)].map((_, index) => (
                                                <PaginationItem key={index} active={currentPage === index + 1}>
                                                    <PaginationLink onClick={() => handlePageChange(index + 1)}>
                                                        {index + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                            <PaginationItem disabled={currentPage === totalPages}>
                                                <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                                            </PaginationItem>
                                        </Pagination>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            {selectedWorker && (
                <WorkerDetailsModal
                    isOpen={workerModalOpen}
                    toggle={() => setWorkerModalOpen(!workerModalOpen)}
                    worker={selectedWorker}
                />
            )}
        </>
    )
}

const WorkerDetailsModal = ({ isOpen, toggle, worker }) => {

    const [workerPastOrders, setWorkerPastOrders] = useState(0);
    const [workerFutureOrders, setWorkerFutureOrders] = useState(0);
    const [workerReviews, setWorkerReviews] = useState(0);
    const [workerRating, setWorkerRating] = useState(0);
    const [domain, setDomain] = useState("")
    const [city, setCity] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            await getUserOrders();
            await getWorkerRatings();
        }
        if (worker && worker._id) {
            fetchData();
        }
        //eslint-disable-next-line
    }, [worker])

    useEffect(() => {
        if (citiesJson) {
            const cityObj = citiesJson.find((city) => {
                return city.id === Number(worker?.city)
            })
            if (cityObj) {
                setCity(cityObj.name)
            }
        }
        if (domainsJson) {
            setDomain(domainsJson[worker?.domain - 1])
        }
        //eslint-disable-next-line
    }, [worker, citiesJson])

    const getWorkerRatings = async () => {
        try {
            const response = await RatingApi.GetWorkerRating(worker._id);
            setWorkerReviews(response.data?.reviews)
            setWorkerRating(response.data?.rating)
        } catch (error) {
            console.log(error)
        }
    }

    const getUserOrders = async () => {
        try {
            const response = await OrderApi.GetOrders(worker._id);
            const orders = response.data;

            const today = moment();

            const formattedDate = today.format('YYYY-MM-DD');

            const pastOrdersArr = [];
            const futureOrdersArr = [];

            orders.forEach((order) => {
                const orderDate = moment(order.date)

                if (orderDate.isBefore(formattedDate, 'day')) {
                    pastOrdersArr.push(order);
                } else {
                    futureOrdersArr.push(order);
                }
            });

            setWorkerPastOrders(pastOrdersArr?.length);
            setWorkerFutureOrders(futureOrdersArr?.length);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle} className="bg-secondary">
                <h4>{worker.firstName}'s profile</h4>
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col className="">
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
                                                <span className="heading">{workerPastOrders ? workerPastOrders : 0}</span>
                                                <span className="description text-nowrap">Past bookings</span>
                                            </div>
                                            <div>
                                                <span className="heading">{workerReviews}</span>
                                                <span className="description">Reviews</span>
                                            </div>
                                            <div>
                                                <span className="heading">{workerFutureOrders ? workerFutureOrders : 0}</span>
                                                <span className="description text-nowrap">Coming booking</span>
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <Row>
                                    <Col className="text-center mb-4">
                                        <div className="mb--2">
                                            <h3>{worker.firstName}'s rating</h3>
                                            {renderRatingStars(workerRating)}
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center">

                                        </div>
                                    </Col>
                                </Row>
                                <div className="text-center">
                                    <div className="h5 font-weight-300">
                                        <i className="fa-solid fa-location-dot mr-2" />
                                        {city}, Romania
                                    </div>
                                    <div className="h5 font-weight-300">
                                        <i className="fa-solid fa-cake-candles mr-2" />
                                        {worker.dateOfBirth}
                                    </div>
                                    <div className="h5 mt-4">
                                        <i className="ni business_briefcase-24 mr-2" />
                                        {domain.name ? domain.name : "Unknown Domain"}
                                    </div>
                                    <div className="h5 mt-4">
                                        <i className="fa-solid fa-phone mr-2" />
                                        {worker.telephoneNumber ? "+" + worker.telephoneNumber : "Unknown telephone  number"}
                                    </div>
                                    <hr className="my-4" />
                                    <p>
                                        {worker.description ? worker.description : "No description"}
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    );
};


export default CustomerOrders;