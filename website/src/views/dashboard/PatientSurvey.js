/* eslint-disable react-hooks/exhaustive-deps */
import Header from 'components/Headers/Header'
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  CardFooter,
  Row,
  Col,
} from 'reactstrap'
import { useUserContext } from 'context/UserContext'
import { useState, useEffect } from 'react'
import SurveyApi from 'api/survey'

const answers = ['Yes', 'No', "I don't know"]

const PatientSurvey = () => {
  const { user } = useUserContext()
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  let timeout

  const handleQuestionAnswer = (e, index) => {
    e.persist()
    setQuestions((current) =>
      current.map((obj) => {
        if (questions.indexOf(obj) === index) {
          return { ...obj, answer: e.target.value }
        }

        return obj
      }),
    )
  }

  useEffect(() => {
    const fetchData = async () => {
        await getQuestions()
    }
    fetchData()
}, [])

 const getQuestions = async () => {
  try{
    const response = await SurveyApi.GetQuestions(user.id);
    setQuestions(response.data)
  }catch(error){
    console.log(error)
  }
 }

const sendSurvey = async () => {
  try{
    await SurveyApi.SendSurvey({patientId: user.id, questionList: questions})
    setSuccess(true)
    timeout = setTimeout(() => {
      setSuccess(false)
    }, 2000)
  }catch(error){
    setError("Server error.")
  }
}

useEffect(() => {
  return () => {
    clearTimeout(timeout)
  }
}, [])

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Complete Survey</h3>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <h3>
                      Please answer all questions by checking the right answer
                      for you.
                    </h3>
                  </Col>
                </Row>
                {questions && questions.length
                  ? questions.map((question, index) => {
                      return (
                        <Row key={index} className="mt-3">
                          <Col>
                            <h3 className="font-weight-400">
                              {question.questionBody}
                            </h3>
                            <Row className="text-left">
                              {answers.map((answer, answerIndex) => {
                                return (
                                  <Col key={answerIndex}>
                                    <label className="mb-0 ws-0">
                                      <input
                                        onChange={(e) =>
                                          handleQuestionAnswer(e, index)
                                        }
                                        type="radio"
                                        checked={question.answer === answer}
                                        className="mr-2 mb-0"
                                        name={`answers-${index}`}
                                        value={answer}
                                      />
                                      {answer}
                                    </label>
                                  </Col>
                                )
                              })}
                            </Row>
                          </Col>
                        </Row>
                      )
                    })
                  : null}
              </CardBody>
              <CardFooter className="border-0 pt-0">
                <Row>
                  <Col className="text-right  d-flex align-items-center justify-content-end">
                  <h3
                      style={{ transition: '.2s all' }}
                      className={`text-right text-success mb-0 mr-3 font-weight-600 ${success ? 'd-initial' : 'd-none'
                        }`}
                    >
                      Survey sent successfully!
                    </h3>
                  {error ? (
                      <h4 className="text-right text-danger mb-0 mr-3 font-weight-400">
                        {error}
                      </h4>
                    ) : null}
                    <Button color="primary" className="btn btn-lg" onClick={sendSurvey}>
                      Save survey
                    </Button>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default PatientSurvey
