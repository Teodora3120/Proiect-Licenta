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
    PaginationLink
} from "reactstrap";
import ServiceApi from "api/service";
import OrderApi from "api/order";
import Header from "components/Headers/Header";
import { useUserContext } from "context/UserContext";
import moment from "moment";
import WorkerApi from "api/worker";
import { Rating } from 'react-simple-star-rating'
import RatingApi from "api/rating";



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

const CustomerOrders = () => {
    const [orders, setOrders] = useState([])
    const [services, setServices] = useState([])
    const [workers, setWorkers] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const { user } = useUserContext();
    const itemsPerPage = 10;

    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        if (user._id) {
            const fetchData = async () => {
                await getOrders()
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
                                                {orders && orders.length ?
                                                    orders.sort((a, b) => new Date(b.date) - new Date(a.date))
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
                                                                <td>{worker.firstName} {worker.lastName}</td>
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
        </>
    )
}

export default CustomerOrders;