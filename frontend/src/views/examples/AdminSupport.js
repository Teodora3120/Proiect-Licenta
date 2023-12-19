import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Nav,
    NavItem,
    NavLink,
    Row,
    Col,
    FormGroup,
    InputGroup,
    Input,
    Container,
} from "reactstrap";
import Header from "components/Headers/Header";
import SupportQuestionApi from "api/support_question";
import { useUserContext } from "context/UserContext";
import moment from "moment";

const AdminSupport = () => {
    const [adminData, setAdminData] = useState([]);
    const [questionAnswer, setQuestionAnswer] = useState("");
    const [questionEditableAnswer, setQuestionEditableAnswer] = useState("");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const { user } = useUserContext();

    useEffect(() => {
        const fetchData = async () => {
            await getAllQuestions();
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const getAllQuestions = async () => {
        try {
            const response = await SupportQuestionApi.GetAllQuestions();
            const questionsArr = response.data;
            const answeredQuestions = questionsArr
                .map((question) => ({
                    ...question,
                    isOpen: false,
                }));
            setAdminData(answeredQuestions);
            setQuestions(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const adminAnswer = async (question) => {
        try {
            setLoading(true);
            const data = {
                questionId: question._id,
                answer: questionAnswer,
            };
            await SupportQuestionApi.AnswerSupportQuestion(data);
            getAllQuestions();
            setSuccessMessage("Answer submitted successfully.");
            setTimeout(() => {
                setSuccessMessage("");
                filterQuestions("all")

            }, 2000);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    const adminEditAnswer = async (question) => {
        try {
            setLoading(true);
            const data = {
                questionId: question._id,
                answer: questionEditableAnswer,
            };
            await SupportQuestionApi.EditAnswerSupportQuestion(data);
            getAllQuestions();
            setSuccessMessage("Answer submitted successfully.");
            setTimeout(() => {
                setSuccessMessage("");
                filterQuestions("all")
            }, 2000);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAnswerAdmin = (index) => {
        setAdminData((prevAdminData) => {
            const updatedAdminData = [...prevAdminData];
            updatedAdminData[index].isOpen = !updatedAdminData[index].isOpen;
            return updatedAdminData;
        });
    };

    const filterQuestions = (status) => {
        if (status === "answered") {
            const answeredQuestions = questions.filter((question) => question.answer);
            setAdminData(answeredQuestions);
        } else if (status === "unanswered") {
            const unansweredQuestions = questions.filter((question) => !question.answer);
            setAdminData(unansweredQuestions);
        } else {
            setAdminData(questions);
        }
        setActiveTab(status);
    };

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            className={activeTab === "all" ? "active" : ""}
                                            onClick={() => filterQuestions("all")}
                                        >
                                            All Questions
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={activeTab === "answered" ? "active" : ""}
                                            onClick={() => filterQuestions("answered")}
                                        >
                                            Answered Questions
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={activeTab === "unanswered" ? "active" : ""}
                                            onClick={() => filterQuestions("unanswered")}
                                        >
                                            Unanswered Questions
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </CardHeader>
                            <CardBody>
                                {adminData.length ? (
                                    adminData.map((question, index) => {
                                        const questionText = `Question ${index + 1}: ${question.question}`;
                                        return (
                                            <div key={index} className="mb-4">
                                                <div
                                                    className="font-weight-bold"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => toggleAnswerAdmin(index)}
                                                >
                                                    {questionText}
                                                </div>
                                                <small className="text-muted text-right">Created on {moment(question.createdAt).format('MMMM D, YYYY [at] h:mm A')}</small>
                                                {question.isOpen && question.answer ? (
                                                    <Card className="mt-2">
                                                        <CardBody>
                                                            <FormGroup>
                                                                <InputGroup>
                                                                    <Input
                                                                        type="textarea"
                                                                        id="reportDescription"
                                                                        placeholder="Answer to the above question..."
                                                                        defaultValue={questionEditableAnswer ? questionEditableAnswer : question.answer}
                                                                        onChange={(e) =>
                                                                            setQuestionEditableAnswer(e.target.value)
                                                                        }
                                                                    />
                                                                </InputGroup>
                                                                <small className="text-muted text-right">Updated on {moment(question.updatedAt).format('MMMM D, YYYY [at] h:mm A')}</small>
                                                            </FormGroup>
                                                            <div className="text-right">
                                                                {successMessage && <div className="text-success mb-2">{successMessage}</div>}
                                                                <Button
                                                                    color="primary"
                                                                    size="sm"
                                                                    onClick={() => adminEditAnswer(question)}
                                                                    disabled={loading}
                                                                >
                                                                    Edit response
                                                                </Button>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                ) : question.isOpen && !question.answer ? (
                                                    <Card className="mt-2">
                                                        <CardBody>
                                                            <FormGroup>
                                                                <InputGroup>
                                                                    <Input
                                                                        type="textarea"
                                                                        id="reportDescription"
                                                                        placeholder="Answer to the above question..."
                                                                        value={questionAnswer}
                                                                        onChange={(e) =>
                                                                            setQuestionAnswer(e.target.value)
                                                                        }
                                                                    />
                                                                </InputGroup>
                                                                <small className="text-muted text-right">Updated on {moment(question.updatedAt).format('MMMM D, YYYY [at] h:mm A')}</small>
                                                            </FormGroup>
                                                            <div className="text-right">
                                                                {successMessage && <div className="text-success mb-2">{successMessage}</div>}
                                                                <Button
                                                                    color="primary"
                                                                    size="sm"
                                                                    onClick={() => adminAnswer(question)}
                                                                    disabled={loading}
                                                                >
                                                                    Answer
                                                                </Button>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                ) : null}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div>
                                        <h4 className="text-muted text-left">
                                            There are no questions yet.
                                        </h4>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminSupport;
