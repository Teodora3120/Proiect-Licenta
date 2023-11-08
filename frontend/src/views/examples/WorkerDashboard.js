import { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Table,
} from "reactstrap";
import { useUserContext } from "context/UserContext";
import { useNavigate } from "react-router-dom";
import ServiceApi from "api/service";
import WorkerApi from "api/worker";
import Select from 'react-select'
import OrderApi from "api/order";
import CustomerApi from "api/customer";
import moment from "moment";


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

const WorkerDashboard = () => {
    const [orders, setOrders] = useState([])
    const [services, setServices] = useState([])
    const [customers, setCustomers] = useState([])
    const { user } = useUserContext();


    useEffect(() => {
        if (user._id) {
            const fetchData = async () => {
                await getOrders()
                await getServices()
                await getAllCustomers()
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

    const getServices = async () => {
        try {
            const response = await ServiceApi.GetAllServices(user._id)
            setServices(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllCustomers = async () => {
        try {
            const response = await CustomerApi.GetAllCustomers()
            setCustomers(response.data)
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


    return (<>
        <Row>
            <Col>
                <Card className="shadow">
                    <CardHeader>
                        <Row>
                            <Col>
                                <h3>My Orders</h3>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-dark">
                                        <tr>
                                            <th scope="col" className="text-white">Customer</th>
                                            <th scope="col" className="text-white">Service</th>
                                            <th scope="col" className="text-white">Date</th>
                                            <th scope="col" className="text-white">Price</th>
                                            <th scope="col" className="text-white">Status</th>
                                            <th scope="col" className="text-white">Contact info</th>
                                            <th scope="col" className="text-white">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders && orders.length ? orders.map((order, index) => {
                                            const service = services?.length ? services.find((serviceObj) => {
                                                return serviceObj._id === order.serviceId
                                            }) : {}
                                            const customer = customers?.length ? customers.find((customerObj) => {
                                                return customerObj._id === order.customerId
                                            }) : {}
                                            return <tr key={index}>
                                                <td>{customer.firstName} {customer.lastName}</td>
                                                <td>{service.name}</td>
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
                                                    <h6>{customer.email}</h6>
                                                    <h6>+{customer.telephoneNumber}</h6>
                                                    {customer.telephoneNumer}
                                                </td>
                                                <td>
                                                    <Button color="danger" size="sm" disabled={!isAtLeastOneDayDifference} onClick={() => deleteOrder(order._id, user._id)}>Cancel</Button>
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
    </>)
}


export default WorkerDashboard