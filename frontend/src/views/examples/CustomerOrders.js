import { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Table,
    Container
} from "reactstrap";
import ServiceApi from "api/service";
import Select from 'react-select'
import OrderApi from "api/order";
import Header from "components/Headers/Header";
import { useUserContext } from "context/UserContext";
import moment from "moment";
import WorkerApi from "api/worker";
import { Rating } from 'react-simple-star-rating'


function formatDate(inputDate) {
    // Parse the input date string
    const parsedDate = moment(inputDate);

    // Format the date as "Do of MMMM YYYY"
    const formattedDate = parsedDate.format('Do [of] MMMM YYYY');

    return formattedDate;
}

function isAtLeastOneDayDifference(providedDateStr) {
    const providedDate = moment(providedDateStr);
    const currentDate = moment();
    const dayDifference = currentDate.diff(providedDate, 'days');
    console.log(dayDifference)
    return dayDifference >= 1;
}

const CustomerOrders = () => {
    const [orders, setOrders] = useState([])
    const [services, setServices] = useState([])
    const [workers, setWorkers] = useState([])
    const [rating, setRating] = useState(0)
    const { user } = useUserContext();

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

    const deleteOrder = async (orderId, userId) => {
        try {
            await OrderApi.DeleteOrder(orderId, userId)
            getOrders();
        } catch (error) {
            console.log(error)
        }
    }

    const handleRating = (rate) => {
        setRating(rate)
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
                                                {orders && orders.length ? orders.map((order, index) => {
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
                                                            {isAtLeastOneDayDifference(order.date) ?
                                                                <h5 className="text-success font-weight-400">Done</h5>
                                                                :
                                                                <h5 className="text-info font-weight-400">On going</h5>
                                                            }
                                                        </td>
                                                        <td>
                                                            <h6>{worker.email}</h6>
                                                            <h6>+{worker.telephoneNumber}</h6>
                                                            {worker.telephoneNumer}
                                                            {/* <Button size="sm" color="primary" onClick={}>See more...</Button> */}
                                                        </td>
                                                        <td>
                                                            {isAtLeastOneDayDifference(order.date) ?
                                                                <Rating
                                                                    onClick={handleRating}
                                                                    size={"20"}
                                                                />
                                                                :
                                                                <Button color="danger" size="sm" onClick={() => deleteOrder(order._id, user._id)}>Cancel</Button>
                                                            }
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
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default CustomerOrders;