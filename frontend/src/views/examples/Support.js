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
import moment from "moment";

const Support = () => {
    const [faqData, setFaqData] = useState([]);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportDescription, setReportDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const { user } = useUserContext();

    const toggleReportModal = () => setReportModalOpen(!reportModalOpen);

    useEffect(() => {
        const fetchData = async () => {
            await getAllQuestions();
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const submitReport = async () => {
        try {
            setLoading(true);
            const data = {
                userId: user._id,
                userEmail: user.email,
                userFullname: user.lastname + " " + user.firstame,
                question: reportDescription,
            };
            await SupportQuestionApi.CreateSupportQuestion(data);
            getAllQuestions();
            setSuccessMessage("Question submitted successfully.");

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            toggleReportModal();
        }
    };

    const getAllQuestions = async () => {
        try {
            const response = await SupportQuestionApi.GetAllQuestions();
            const questionsArr = response.data;
            const answeredQuestions = questionsArr
                .filter((question) => question.answer !== "")
                .map((question) => ({
                    ...question,
                    isOpen: false,
                }));
            setFaqData(answeredQuestions);
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
                                            Question {index + 1}: {faq.question}
                                        </div>
                                        {faq.isOpen && <div className="mt-2">{faq.answer}</div>}
                                        <small className="text-muted text-right">Answered on {moment(faq.updatedAt).format('MMMM D, YYYY [at] h:mm A')}</small>
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
                    </Col>
                </Row>
            </Container>

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
