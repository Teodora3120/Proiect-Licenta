import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    FormGroup,
    InputGroup,
    Input,
    Container,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Label,
    CardFooter,
} from "reactstrap";
import Header from "components/Headers/Header";
import SupportQuestionApi from "api/support_question";
import { useUserContext } from "context/UserContext";

const Support = () => {
    const [faqData, setFaqData] = useState([]);
    const [adminData, setAdminData] = useState([]);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportDescription, setReportDescription] = useState("");
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const { user } = useUserContext();

    const toggleReportModal = () => setReportModalOpen(!reportModalOpen);

    useEffect(() => {
        const fetchData = async () => {
            await getAllQuestions();
        }
        fetchData();

        if (user.type !== "admin") {
            const answeredQuestions = questions
                .filter((question) => question.response.trim() !== "")
                .map((question) => ({
                    question: question.question,
                    response: question.response,
                    createdAt: question.createdAt,
                    updatedAt: question.updatedAt,
                    isOpen: false,
                }));
            setFaqData(answeredQuestions);
        } else {
            const answeredQuestions = questions
                .map((question) => ({
                    question: question.question,
                    response: question.response,
                    createdAt: question.createdAt,
                    updatedAt: question.updatedAt,
                    isOpen: false,
                }));
            setAdminData(answeredQuestions);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const submitReport = async () => {
        try {
            setLoading(true); // Set loading to true when submitting
            const data = {
                userId: user._id,
                userEmail: user.email,
                question: reportDescription,
            };
            const response = await SupportQuestionApi.CreateSupportQuestion(data);
            console.log(response);
            getAllQuestions();
            setSuccessMessage("Question submitted successfully.");

            // Clear the success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // Set loading to false after submission
            toggleReportModal();
        }
    };

    const getAllQuestions = async () => {
        try {
            const response = await SupportQuestionApi.GetAllQuestions();
            console.log(response)
            setQuestions(response.data)
        } catch (error) {
            console.log(error)
        }
    };

    const toggleAnswer = (index) => {
        setFaqData((prevFaqData) => {
            const updatedFaqData = [...prevFaqData];
            updatedFaqData[index].isOpen = !updatedFaqData[index].isOpen;
            return updatedFaqData;
        });
    };



    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <Col>
                        {user.type !== "admin" ? (
                            <>
                                <Card>
                                    <CardHeader>
                                        <h2>Frequently Asked Questions</h2>
                                    </CardHeader>
                                    <CardBody>
                                        {faqData.length ? faqData.map((faq, index) => (
                                            <div key={index} className="mb-4">
                                                <div
                                                    className="font-weight-bold"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => toggleAnswer(index)}
                                                >
                                                    Question {index}: {faq.question}
                                                </div>
                                                {faq.isOpen && <div className="mt-2">Answer {index}: {faq.response}</div>}
                                            </div>
                                        )) :
                                            <div>
                                                <h4 className="text-muted text-left">There are no questions yet.</h4>
                                            </div>}
                                    </CardBody>
                                </Card>

                                <Card className="mt-5">
                                    <CardHeader>
                                        <h2>Report a Problem</h2>
                                    </CardHeader>
                                    <CardBody>
                                        <FormGroup>
                                            <Label for="reportDescription">Description of the problem:</Label>
                                            <InputGroup>
                                                <Input
                                                    type="textarea"
                                                    id="reportDescription"
                                                    placeholder="Describe the problem you're experiencing..."
                                                    value={reportDescription}
                                                    onChange={(e) => setReportDescription(e.target.value)}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                    </CardBody>
                                    <CardFooter className="text-right">
                                        {successMessage && <div className="text-success mb-2">{successMessage}</div>}
                                        <Button color="primary" onClick={toggleReportModal} disabled={loading}>
                                            {loading ? "Submitting..." : "Submit Report"}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </>
                        ) : (
                            <>
                                <Card>
                                    <CardHeader>
                                        <h2>Asked Questions</h2>
                                    </CardHeader>
                                    <CardBody>
                                        {adminData.length ? faqData.map((faq, index) => (
                                            <div key={index} className="mb-4">
                                                <div
                                                    className="font-weight-bold"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => toggleAnswer(index)}
                                                >
                                                    Question {index}: {faq.question}
                                                </div>
                                                {faq.isOpen && <div className="mt-2">Answer {index}: {faq.response}</div>}
                                            </div>
                                        )) :
                                            <div>
                                                <h4 className="text-muted text-left">There are no questions yet.</h4>
                                            </div>}
                                    </CardBody>
                                </Card>
                            </>
                        )}

                    </Col>
                </Row>
            </Container>

            {/* Problem Report Modal */}
            <Modal isOpen={reportModalOpen} toggle={toggleReportModal}>
                <ModalHeader toggle={toggleReportModal}>Confirm Submission</ModalHeader>
                <ModalBody>
                    Are you sure you want to submit the following problem report or question?
                    <div className="mt-3">Description: {reportDescription}</div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={submitReport} disabled={loading}>
                        Confirm
                    </Button>{" "}
                    <Button color="secondary" onClick={toggleReportModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default Support;
