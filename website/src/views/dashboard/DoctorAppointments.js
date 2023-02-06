import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Table,
    Button,
    Input,
    Label
} from 'reactstrap'
// core components
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import Header from 'components/Headers/Header'
import { useUserContext } from "context/UserContext";
import AppointmentApi from 'api/appointments';
import DrugApi from 'api/drug';
import PrescriptionApi from 'api/prescription';
import moment from 'moment';
import Swal from 'sweetalert2'
import Select from 'react-select'
import withReactContent from 'sweetalert2-react-content'
const ReactSwal = withReactContent(Swal)

const DoctorAppointments = () => {

    const [error, setError] = useState('')
    const [appointments, setAppointments] = useState([])
    const { user } = useUserContext()

    useEffect(() => {
        const fetchData = async () => {
            await getAppointments()
        }
        fetchData()
    }, [])

    useEffect(() => {
        appointments.sort((a, b) => new Date(...a.date.split('-').reverse()) - new Date(...b.date.split('-').reverse()));
        appointments.sort((a, b) => a.date.split(":") - b.date.split(":"));
    }, [])

    const getAppointments = async () => {
        try {
            const response = await AppointmentApi.GetDoctorAppointments(user.id)
            setAppointments(response.data)
        } catch (error) {
            console.log(error)
            setError("Error: Couldn't get the appointments.")
        }
    }

    const createPrescription = async (patient) => {
        // console.log(user.id)
        ReactSwal.fire({
            showCancelButton: false,
            showCloseButton: false,
            showConfirmButton: false,
            html: <Prescription patient={patient} close={ReactSwal.close} />
        })
    }

    return (
        <>
            <Header />
            {/* Page content */}
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <Col>
                        <Card className="shadow">
                            <CardHeader>
                                <Row className="align-items-center">
                                    <Col lg="8" md="8" sm="12" xs="12" className="text-left">
                                        <h3 className="mb-0">
                                            View your appointments
                                        </h3>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Table className="align-items-center table-flush" responsive>
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">Date</th>
                                                <th scope="col">Time</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Prescription</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {error ? <tr><td><h4 className='text-left text-muted'>Sorry, we couldn't get the appointments list.</h4></td></tr> : null}
                                            {appointments.map((appointment, index) => {
                                                console.log(appointment)
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">
                                                            <span className="mb-0 text-sm">
                                                                {moment(appointment.date).diff(new Date().toISOString().slice(0, 10), 'day') === 0 ? "Today" : moment(appointment.date).diff(new Date().toISOString().slice(0, 10), 'day') === 1 ? "Tomorrow" : appointment.date}
                                                            </span>
                                                        </th>
                                                        <td>
                                                            <span className="mb-0 text-sm">
                                                                {appointment.startTime} - {appointment.endTime}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="mb-0 text-sm">
                                                                {appointment.patientFirstName} {appointment.patientLastName}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="mb-0 text-sm">
                                                                {appointment.email}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <Button size='sm' color="info" className='text-center' onClick={() => createPrescription({ firstName: appointment.patientFirstName, lastName: appointment.patientLastName, email: appointment.email, appointmentId: appointment.id, userId: user.id })}>Prescription</Button>
                                                        </td>
                                                    </tr>)
                                            })}
                                        </tbody>
                                    </Table>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default DoctorAppointments


const Prescription = (props) => {
    const [diagnostic, setDiagnostic] = useState("")
    const [description, setDescription] = useState("")
    const [drugs, setDrugs] = useState([])
    const [error, setError] = useState("")
    const [chosenDrugs, setChosenDrugs] = useState([])
    const [drugsArray, setDrugsArray] = useState([])
    const [procedureName, setProcedureName] = useState("")
    const [procedureDescription, setProcedureDescription] = useState("")
    const [procedurePrice, setProcedurePrice] = useState(0)
    const { user } = useUserContext()


    useEffect(() => {
        const fetchData = async () => {
            await getDrugs()
        }
        fetchData()
    }, [user])

    const getDrugs = async () => {
        try {
            const response = await DrugApi.GetDrugsByDoctorId(props.patient.userId)
            setDrugs(response.data)
        } catch (err) {
            setError("Error: Couldn't get the drug list.")
        }
    }

    const setDrugsArrayFunction = (chosenDrugs) =>{
        const drugsArray1 = chosenDrugs.map((drug, index) => {
            return { drugId: drug.value, quantity: 0 }
        })
        console.log("drugsArray1", drugsArray1)
        setDrugsArray(drugsArray1)
    }

    
  const handleQuantityOfDrugs = (index, e) => {
    e.persist()
    setDrugsArray((current) =>
      current.map((obj) => {
        if (drugsArray.indexOf(obj) === index) {
          return { ...obj, quantity: e.target.value }
        }

        return obj
      }),
    )
  }

    const verifyFields = () => {
        if (
            !diagnostic ||
            !description
        ) {
            setError('You must fill in diagnostic and description fields.')
            return true
        }
        return false
    }

    const sendPrescription = async () => {
        try {
            if (verifyFields()) {
                return
            }
            let data = {
                name: diagnostic,
                description: description,
            }
            if(drugsArray?.length){
                data.drugs = drugsArray
            }
            if(procedureDescription && procedureName && procedurePrice){
                data.procedures = [{ name: procedureName, description: procedureDescription, price: procedurePrice }]
            }
            console.log(data, props.patient.appointmentId)
            const response = await PrescriptionApi.CreatePrescription(props.patient.appointmentId, data)
            console.log(response.data)
            props.close()
        } catch (error) {
            setError("Error: Couldn't create the prescription.")
        }
    }
    useEffect(() => {
        console.log(drugsArray)
    }, [drugsArray])
    return <>
        <Row>
            <Col>
                <Row className='align-items-center mb-1'>
                    <Col className='text-left'>
                        <h3>Create prescription</h3>
                    </Col>
                    <Col className='text-right' xs="2">
                        <button aria-label="Close" className='close' data-dismiss="modal" type='button' onClick={props.close}>
                            <span aria-hidden={true}>x</span>
                        </button>
                    </Col>
                </Row>
                <hr className='mt-3' />
                <Row className='mb-2'>
                    <Col className='text-left'>
                        <Label
                            className='text-sm'
                        >
                            Diagnostic*
                        </Label>
                        <Input
                            defaultValue=""
                            placeholder="Write a diagnostic..."
                            type="text"
                            maxLength={40}
                            onChange={(e) => setDiagnostic(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row className='mb-2'>
                    <Col className='text-left'>
                        <Label
                            className='text-sm'
                        >
                            Description*
                        </Label>
                        <Input
                            defaultValue=""
                            placeholder="Write a description..."
                            type="text"
                            maxLength={200}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col className='text-left'>
                        <Label className='text-sm'>Select drugs</Label>
                        <Select
                            onChange={(drugs, action) => {
                                if (action.action === 'select-option') {
                                    setChosenDrugs(drugs)
                                    setDrugsArrayFunction(drugs)
                                } else if (action.action === 'clear') {
                                    setChosenDrugs([])
                                    setDrugsArrayFunction([])
                                    setError('')
                                }
                            }}
                            defaultValue={null}
                            isSearchable
                            isClearable
                            isMulti
                            name="drug-select"
                            options={drugs.map((item) => {
                                return { label: item.name, value: item.id }
                            })}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            size="sm"
                        />
                        {chosenDrugs?.length ? (
                            chosenDrugs.map((drug, index) => {
                                console.log(drug.label)
                                return (
                                    <Row key={index} className="mt-2">
                                        <Col className='text-left'>
                                            <h4>{drug.label}</h4>
                                        </Col>
                                        <Col className='text-left'>
                                            <Label
                                                className='text-sm'
                                            >
                                                Quantity
                                            </Label>
                                            <Input
                                                defaultValue=""
                                                placeholder="Quantity"
                                                type="number"
                                                maxLength={2}
                                                onChange={(e) => handleQuantityOfDrugs(index, e)}
                                            />
                                        </Col>
                                    </Row>
                                )
                            })
                        ) : null}
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='text-left'>
                        <h3>Procedure</h3>
                    </Col>
                </Row>
                <Row>
                    <Col className='text-left'>
                        <Label
                            className='text-sm'
                        >
                            Name
                        </Label>
                        <Input
                            defaultValue=""
                            placeholder="Write a procedure..."
                            type="text"
                            maxLength={40}
                            onChange={(e) => setProcedureName(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col className='text-left'>
                        <Label
                            className='text-sm'
                        >
                            Description
                        </Label>
                        <Input
                            defaultValue=""
                            placeholder="Write a description..."
                            type="text"
                            maxLength={40}
                            onChange={(e) => setProcedureDescription(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col className='text-left'>
                        <Label
                            className='text-sm'
                        >
                            Price
                        </Label>
                        <Input
                            defaultValue=""
                            placeholder="Price"
                            type="number"
                            maxLength={40}
                            onChange={(e) => setProcedurePrice(Number(e.target.value))}
                        />
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col>
                        <Button className='text-center' color="primary" onClick={sendPrescription}>Create</Button>
                        {error ? (
                            <h4 className="text-center text-danger mt-3 mr-2 font-weight-400">
                                {error}
                            </h4>
                        ) : null}
                    </Col>
                </Row>
            </Col>
        </Row>
    </>
}
