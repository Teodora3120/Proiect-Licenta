import React, { useState } from "react";
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
    CardFooter
} from "reactstrap";
import Header from "components/Headers/Header";

const Support = () => {
    const [faqData, setFaqData] = useState([
        {
            question: "Question 1: What is Lorem Ipsum?",
            answer: "Answer 1: Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        },
        {
            question: "Question 2: How can I reset my password?",
            answer: "Answer 2: You can reset your password by visiting the 'Forgot Password' page and following the instructions.",
        },
        // Add more FAQ items as needed
    ]);

    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportDescription, setReportDescription] = useState("");

    const toggleReportModal = () => setReportModalOpen(!reportModalOpen);

    const submitReport = () => {
        // Handle the submission of the problem report
        console.log("Report submitted:", reportDescription);
        // You can add your logic here to handle the report submission
        // For now, let's just close the modal
        toggleReportModal();
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
                                {faqData.map((faq, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="font-weight-bold" style={{ cursor: "pointer" }}>
                                            {faq.question}
                                        </div>
                                        <div className="mt-2">{faq.answer}</div>
                                    </div>
                                ))}
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
                                <Button color="primary" onClick={toggleReportModal}>
                                    Submit Report
                                </Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Problem Report Modal */}
            <Modal isOpen={reportModalOpen} toggle={toggleReportModal}>
                <ModalHeader toggle={toggleReportModal}>Confirm Submission</ModalHeader>
                <ModalBody>
                    Are you sure you want to submit the following problem report?
                    <div className="mt-3">Description: {reportDescription}</div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={submitReport}>
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
