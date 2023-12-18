import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Container,
} from "reactstrap";
import OrderApi from "api/order";
import WorkerApi from "api/worker";
import CustomerApi from "api/customer";
import RatingApi from "api/rating";
import SupportQuestionApi from "api/support_question";
import Header from "components/Headers/Header";

const AdminData = () => {
    const [customers, setCustomers] = useState([])
    const [workers, setWorkers] = useState([])
    const [canceledOrders, setCanceledOrders] = useState([])
    const [completedOrders, setCompletedOrders] = useState([])
    const [ongoingOrders, setOngoingOrders] = useState([])
    const [ratings, setRatings] = useState([])
    const [askedQuestions, setAskedQuestions] = useState([])
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            await getCustomers();
            await getWorkers();
            await getOrders();
            await getRatings();
            await getAskedQuestions();
        }

        fetchData();
    }, [])

    useEffect(() => {
        const newData = [
            {
                title: "Customers",
                value: customers.length,
                description: `Number of customers joined`,
                icon: <i className="fa-solid fa-user" />
            },
            {
                title: "Workers",
                value: workers.length,
                description: `Number of workers joined`,
                icon: <i className="fa-solid fa-user-doctor" />
            },
            {
                title: "Ongoing Orders",
                value: ongoingOrders.length,
                description: "Number of ongoing orders",
                icon: <i className="fa-solid fa-clock" />
            },
            {
                title: "Completed Orders",
                value: completedOrders.length,
                description: "Number of completed orders",
                icon: <i className="fa-solid fa-check" />
            },
            {
                title: "Canceled Orders",
                value: canceledOrders.length,
                description: "Number of canceled orders",
                icon: <i className="fa-solid fa-ban" />
            },
            {
                title: "Ratings",
                value: ratings.length,
                description: "Number of ratings received",
                icon: <i className="fa-solid fa-star" />
            },
            {
                title: "Asked Questions",
                value: askedQuestions.length,
                description: "Number of support questions asked",
                icon: <i className="fa-solid fa-question" />
            },
        ];

        setData(newData);
    }, [customers, workers, canceledOrders, completedOrders, ongoingOrders, ratings, askedQuestions]);

    const getCustomers = async () => {
        try {
            const response = await CustomerApi.GetAllCustomers();
            setCustomers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getWorkers = async () => {
        try {
            const response = await WorkerApi.GetAllWorkers();
            setWorkers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getOrders = async () => {
        try {
            const response = await OrderApi.GetAllOrders();
            const ordersArr = response.data;
            const ongoingOrdersArr = ordersArr.filter(order => order.status === "On going");
            setOngoingOrders(ongoingOrdersArr)
            const completedOrdersArr = ordersArr.filter(order => order.status === "Completed");
            setCompletedOrders(completedOrdersArr)
            const canceledOrdersArr = ordersArr.filter(order => order.status === "Canceled");
            setCanceledOrders(canceledOrdersArr)
        } catch (error) {
            console.log(error)
        }
    }

    const getRatings = async () => {
        try {
            const response = await RatingApi.GetRatings();
            setRatings(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getAskedQuestions = async () => {
        try {
            const response = await SupportQuestionApi.GetAllQuestions();
            setAskedQuestions(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    return (<>
        <Header />
        <Container className="mt--7" fluid>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <h2>Schedule Mate Data Analytics</h2>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                {data.length ? data.map((item, index) => {
                                    return <Col className="d-flex" lg="4" xl="4" md="6" sm="12" xs="12" key={index}>
                                        <Card className="flex-fill shadow mb-4">
                                            <CardBody>
                                                <Row>
                                                    <Col>
                                                        <h5 className="card-title text-uppercase text-muted mb-0">{item.title}</h5>
                                                        <span className="h2 font-weight-bold mb-0">{item.value}</span>
                                                    </Col>
                                                    <Col className="col-auto">
                                                        <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                                                            {item.icon}
                                                        </div>
                                                    </Col>
                                                    <p className="mt-3 mb-0 ml-2 text-sm">
                                                        <span className="text-danger mr-2">
                                                            {
                                                                item.value > 0 ?
                                                                    <i className='fa-solid fa-arrow-up text-success'></i>
                                                                    :
                                                                    <i className='fa-solid fa-arrow-down text-danger'></i>
                                                            }
                                                        </span>
                                                        <span className="text-nowrap">{item.description}</span>
                                                    </p>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                }
                                )
                                    :
                                    <h4 className="text-muted text-center">There is no data available yet.</h4>}
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    </>)
}

export default AdminData;