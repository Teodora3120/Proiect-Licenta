/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
// react component that copies the given text inside your clipboard
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  CardFooter,
} from 'reactstrap'
import 'react-modern-calendar-datepicker/lib/DatePicker.css'
import { Calendar } from 'react-modern-calendar-datepicker'
import Select from 'react-select'
import DoctorApi from 'api/doctor'
// core components
import Header from 'components/Headers/Header.js'
import Swal from 'sweetalert2'
import SpecialitiesApi from 'api/specialities'
import AppointmentApi from 'api/appointments'
import { useUserContext } from 'context/UserContext'
import { useHistory } from 'react-router-dom'

function getDayName(date) {
  const locale = 'en-US'
  return date.toLocaleDateString(locale, { weekday: 'long' })
}

const CreateAppointment = () => {
  const [speciality, setSpeciality] = useState('')
  const [specialities, setSpecialities] = useState([])
  const [error, setError] = useState('')
  const [doctors, setDoctors] = useState([])
  const [doctor, setDoctor] = useState({})
  const [scheduleIntervals, setScheduleIntervals] = useState([])
  const [appointmentInterval, setAppointmentInterval] = useState({})
  const [appointmentDay, setAppointmentDay] = useState({})
  const [appointmentDayName, setAppointmentDayName] = useState('')
  const { user } = useUserContext()
  const history = useHistory()
  useEffect(() => {
    const fetchData = async () => {
      await getSpecialities()
    }
    fetchData()
  }, [])

  const getSpecialities = async () => {
    try {
      const response = await SpecialitiesApi.GetSpecialities()
      setSpecialities(response.data)
    } catch (err) {
      setError("Error: Couldn't get the speacialities.")
    }
  }

  const getDoctors = async () => {
    if (!speciality) {
      return
    }
    try {
      const response = await DoctorApi.GetDoctorsBySpeciality(speciality)
      setDoctors(response.data)
    } catch (err) {
      setError("Error: Couldn't get the doctors.")
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getDoctors()
    }
    fetchData()
  }, [speciality])

  const getScheduleIntervals = async (data) => {
    try {
      const response = await DoctorApi.GetAvailableAppointmentSchedule(
        doctor.id,
        {"date": data.year + '-' + data.month + '-' + data.day},
      )
      console.log(response.data)
      setScheduleIntervals(response.data)
      setAppointmentDay(data)
      const newDate = data.year + '-' + data.month + '-' + data.day
      setAppointmentDayName(getDayName(new Date(newDate)))
    } catch (error) {
      console.log(error)
    }
  }
  const redirectToMyAppointments= async () =>{
    await Swal.fire({
      title: 'Verify your appointment',
      icon: 'info',
      confirmButtonText: 'Check',
    }).then( async () => {
      return history.push("/admin/patient-appointment")
    })
  }
  const createAppointmentPopup = async () => {
    await Swal.fire({
      title: 'Confirm appointment',
      text: `You will have an appointment with ${doctor.firstName} ${doctor.lastName} on ${appointmentDayName}, ${appointmentDay.day}/${appointmentDay.month}/${appointmentDay.year} at ${appointmentInterval.startTime}.`,
      icon: 'info',
      confirmButtonText: 'Create appointment',
      showCancelButton: true,
      reverseButtons: true,
    }).then(async (status) => {
      if (!status.isConfirmed) {
        return Swal.close()
      }
      try {
        let month = appointmentDay.month;
        let day = appointmentDay.day;
        let year = appointmentDay.year;
        if(month < 10){
          month = "0" + appointmentDay.month;
        }
        if(day < 10){
          day = "0" + appointmentDay.day;
        }
          const response = await AppointmentApi.CreateAppointment(user.id, doctor.id, {
            date: `${year}-${month}-${day}`,
            startTime: appointmentInterval.startTime,
            endTime: appointmentInterval.endTime,
          })
          console.log(response) 
        redirectToMyAppointments()
      } catch (error) {
        console.log(error)
        return setError('There has been an error.')
      }
    })
  }

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Create an Appointment</h3>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col
                    lg="6"
                    md="12"
                    sm="12"
                    xs="12"
                    className="text-left"
                    style={{ zIndex: '100' }}
                  >
                    <h3>Select a speciality</h3>
                    <Select
                      onChange={(spec, action) => {
                        if (action.action === 'select-option' && spec) {
                          setSpeciality(spec.value)
                        } else if (action.action === 'clear') {
                          setDoctors([])
                          setDoctor({})
                          setScheduleIntervals([])
                          setAppointmentDay({})
                          setAppointmentInterval({})
                          setAppointmentDayName('')
                          setError('')
                        }
                      }}
                      defaultValue={null}
                      isSearchable
                      isClearable
                      name="speciality"
                      options={specialities.map((item) => {
                        return { label: item.name, value: item.id }
                      })}
                      className="basic-single"
                      classNamePrefix="select"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {doctors?.length ? (
                      <h3 className="mt-3">Choose your Doctor</h3>
                    ) : null}
                    <Row>
                      {doctors && doctors.length ? (
                        doctors.map((doc, index) => {
                          return (
                            <Col
                              className="text-left mb-3"
                              xl="3"
                              lg="4"
                              md="4"
                              sm="6"
                              xs="6"
                              key={index}
                            >
                              <Card
                                className={`shadow ${
                                  doc.id === doctor.id
                                    ? 'border border-primary'
                                    : ''
                                } `}
                              >
                                <CardBody>
                                  <Row className="align-items-center">
                                    <Col className="text-center">
                                      <img
                                        className="rounded-circle avatar-lg"
                                        src={
                                          doc.profilePhoto
                                            ? doc.profilePhoto
                                            : require('assets/img/dashboard/default-avatar.jpg')
                                        }
                                        alt="avatar"
                                      />
                                      <h3 className="mb-0 mt-1">
                                        {doc.firstName} {doc.lastName}
                                      </h3>
                                      <h5 className="text-muted font-weight-400 mb-0 mt-2">
                                        {doc.speciality}
                                      </h5>
                                      <h3 className="mb-0 text-success">
                                        $
                                        {doc.appointmentPrice}
                                      </h3>
                                      <Button
                                        color="primary"
                                        className="text-center mt-3"
                                        onClick={() => setDoctor(doc)}
                                      >
                                        Choose
                                      </Button>
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Card>
                            </Col>
                          )
                        })
                      ) : speciality ? (
                        <Col>
                          <p className="text-sm mt-2">
                            No doctors found for this speciality.
                          </p>
                        </Col>
                      ) : null}
                    </Row>
                  </Col>
                </Row>
                <Row className={`${doctor?.id ? 'd-initial' : 'd-none'}`}>
                  <Col
                    lg="6"
                    md="12"
                    sm="12"
                    xs="12"
                    className="text-left mt-3"
                  >
                    <h3>Select Date</h3>
                    <Calendar
                      calendarClassName="w-100"
                      value={null}
                      onChange={(value) => getScheduleIntervals(value)}
                      shouldHighlightWeekends
                    />
                  </Col>
                  <Col lg="6" md="12" sm="12" xs="12">
                      <h3 className="mt-3">Choose a time range</h3>
                      {!scheduleIntervals.length ? <p className='mt-0 text-sm'>Please select a date first.</p> : null}
                    <Row>
                      {scheduleIntervals && scheduleIntervals.length
                        ? scheduleIntervals.map((interval, index) => {
                            return (
                              <Col
                                className="text-left mb-3"
                                xl="3"
                                lg="4"
                                md="4"
                                sm="6"
                                xs="6"
                                key={index}
                              >
                                <Card
                                  className={`c-pointer shadow ${
                                    appointmentInterval.startTime ===
                                    interval.startTime
                                      ? 'border border-primary'
                                      : ''
                                  }`}
                                  onClick={() =>
                                    setAppointmentInterval({
                                      startTime: interval.startTime,
                                      endTime: interval.endTime,
                                    })
                                  }
                                >
                                  <CardBody>
                                    <div>
                                      {interval.startTime} - {interval.endTime}
                                    </div>
                                  </CardBody>
                                </Card>
                              </Col>
                            )
                          })
                        : null}
                    </Row>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter className="border-0 pt-0">
                <Row>
                  <Col className="text-right d-flex align-items-center justify-content-end">
                  {error ? (
                    <h4 className="text-center text-danger mt-3 mr-2 font-weight-400">
                      {error}
                    </h4>
                  ) : null}
                    <Button
                      color="primary btn-lg"
                      disabled={
                        doctor &&
                        doctor.id &&
                        appointmentInterval.startTime &&
                        appointmentDay.year
                          ? false
                          : true
                      }
                      onClick={createAppointmentPopup}
                    >
                      Create Appointment
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

export default CreateAppointment
