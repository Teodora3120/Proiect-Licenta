import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Container,
    Row,
    Col,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    Label,
    CardFooter,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { useUserContext } from "context/UserContext";
import Select from "react-select";
import WorkerApi from "api/worker";
import AuthApi from "api/auth";

const WSchedule = () => {
    const [activeTab, setActiveTab] = useState("Monday");
    const [scheduleChanges, setScheduleChanges] = useState(false);
    const [schedule, setSchedule] = useState([
        {
            dayOfWeek: "Monday",
            startTime: "",
            endTime: "",
        },
        {
            dayOfWeek: "Tuesday",
            startTime: "",
            endTime: "",
        },
        {
            dayOfWeek: "Wednesday",
            startTime: "",
            endTime: "",
        },
        {
            dayOfWeek: "Thursday",
            startTime: "",
            endTime: "",
        },
        {
            dayOfWeek: "Friday",
            startTime: "",
            endTime: "",
        },
        {
            dayOfWeek: "Saturday",
            startTime: "",
            endTime: "",
        },
        {
            dayOfWeek: "Sunday",
            startTime: "",
            endTime: "",
        },
    ]);
    const { user } = useUserContext();
    const [validateError, setValidateError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await getUser()
        }
        if (user && user._id) {
            fetchData();
        }
        //eslint-disable-next-line
    }, [user])

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    const updateSchedule = (day, target, value) => {
        const updatedSchedule = schedule.map((item) =>
            item.dayOfWeek === day
                ? {
                    ...item,
                    [target]: value,
                }
                : item
        );
        setSchedule(updatedSchedule);
        validateSchedule(updatedSchedule);
    };

    const validateSchedule = (updatedSchedule) => {
        const isValid = updatedSchedule.every((day) => {
            if (day.startTime && day.endTime) {
                const startTime = day.startTime.split(":").map(Number);
                const endTime = day.endTime.split(":").map(Number);
                return startTime[0] < endTime[0] || (startTime[0] === endTime[0] && startTime[1] < endTime[1]);
            }
            return true;
        });
        setValidateError(!isValid);
    };

    const hourOptions = generateHourOptions();

    function generateHourOptions() {
        const options = [];
        for (let hour = 6; hour <= 22; hour++) {
            const formattedHour = hour.toString().padStart(2, "0") + ":00";
            options.push({ value: formattedHour, label: formattedHour });
        }
        return options;
    }

    const sendSchedule = async () => {
        try {
            const data = {
                schedule: schedule
            }
            await WorkerApi.SendSchedule(user._id, data)
            await getUser();
            setScheduleChanges(true)

            setTimeout(() => {
                setScheduleChanges(false);
            }, 5000);
        } catch (error) {
            console.log(error)
        }
    }

    const getUser = async () => {
        try {
            const response = await AuthApi.GetUserById(user._id)
            const newUser = response.data
            if (newUser.schedule.length) {
                setSchedule(newUser.schedule)
            }
            console.log(newUser)
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
                                <Nav tabs>
                                    {schedule.map((day, index) => (
                                        <NavItem key={index}>
                                            <NavLink
                                                className={
                                                    activeTab === day.dayOfWeek
                                                        ? "active bg-primary text-white c-pointer"
                                                        : "c-pointer"
                                                }
                                                onClick={() => toggleTab(day.dayOfWeek)}
                                            >
                                                {day.dayOfWeek}
                                            </NavLink>
                                        </NavItem>
                                    ))}
                                </Nav>
                            </CardHeader>
                            <Card xl="8" lg="8" md="8" sm="12" xs="12">
                                <TabContent activeTab={activeTab}>
                                    {schedule.map((day, index) => (
                                        <TabPane
                                            key={index}
                                            tabId={day.dayOfWeek}
                                            className="bg-secondary shadow"
                                        >
                                            <CardBody>
                                                <Row>
                                                    <Col className="text-center">
                                                        <h2 className="mt-2">{day.dayOfWeek}</h2>
                                                        <Row className="align-items-center justify-content-center">
                                                            <Col xl="3" lg="3" md="3" sm="6" xs="6" className="mb-3">
                                                                <Label>Start time</Label>
                                                                <Select
                                                                    value={hourOptions.find((option) => option.value === day.startTime)}
                                                                    options={hourOptions}
                                                                    onChange={(selectedOption) =>
                                                                        updateSchedule(day.dayOfWeek, "startTime", selectedOption.value)
                                                                    }
                                                                    placeholder="Start"
                                                                />
                                                            </Col>
                                                            <Col xl="3" lg="3" md="3" sm="6" xs="6" className="mb-3">
                                                                <Label>End time</Label>
                                                                <Select
                                                                    value={hourOptions.find((option) => option.value === day.endTime)}
                                                                    options={hourOptions}
                                                                    onChange={(selectedOption) =>
                                                                        updateSchedule(day.dayOfWeek, "endTime", selectedOption.value)
                                                                    }
                                                                    placeholder="End"
                                                                />
                                                            </Col>
                                                        </Row>
                                                        {validateError ? (
                                                            <p className="text-danger">Start hour must be before the end one.</p>
                                                        ) : null}
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </TabPane>
                                    ))}
                                </TabContent>
                                <CardFooter className="bg-secondary">
                                    <Row>
                                        <Col className="text-left">
                                            {scheduleChanges ? <h4 className="font-weight-400 text-nowrap text-success mb-0">Schedule changes saved successfully</h4> : null}
                                        </Col>
                                        <Col className="text-right">
                                            <Button color="primary" disabled={validateError} onClick={sendSchedule}>
                                                Save changes
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardFooter>
                            </Card>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default WSchedule;
