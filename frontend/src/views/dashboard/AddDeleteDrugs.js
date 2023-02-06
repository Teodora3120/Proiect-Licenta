import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
    CardBody,
    Table,
    Input,
    Label
} from 'reactstrap'
// core components
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import Header from 'components/Headers/Header'
import { useUserContext } from "context/UserContext";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import DrugApi from 'api/drug';
const ReactSwal = withReactContent(Swal)

const AddDeleteDrugs = () => {

    const { user } = useUserContext()
    const [drugs, setDrugs] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            await getDrugsByDoctorId()
        }
        fetchData()
    }, [])

    const getDrugsByDoctorId = async () => {
        try {
            const response = await DrugApi.GetDrugsByDoctorId(user.id)
            setDrugs(response.data)
            console.log(response.data)
        } catch (error) {
            console.log(error)
            setError("Error: Couldn't get the drugs list.")
        }
    }

    const addDrug = async (doctor) => {
        ReactSwal.fire({
            showCancelButton: false,
            showCloseButton: false,
            showConfirmButton: false,
            html: <AddDrug doctor={doctor} fetch={getDrugsByDoctorId} close={ReactSwal.close} />
        })
    }
    const deleteDrug = async (doctor) => {
        ReactSwal.fire({
            showCancelButton: false,
            showCloseButton: false,
            showConfirmButton: false,
            html: <DeleteDrug doctor={doctor} fetch={getDrugsByDoctorId} close={ReactSwal.close} />
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
                                            Add or Delete a drug
                                        </h3>
                                    </Col>
                                    <Col className='text-right'>
                                        <Button color="info" className='text-left' onClick={() => addDrug({ doctorId: user.id })}>Add</Button>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                <Table className="align-items-center table-flush" responsive>
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">Name</th>
                                                <th scope="col">Description</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {error ? <tr><td><h4 className='text-left text-muted'>Sorry, we couldn't get the appointments list.</h4></td></tr> : null}
                                            {drugs.map((drug, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">
                                                            <span className="mb-0 text-sm">
                                                                {drug.name}
                                                            </span>
                                                        </th>
                                                        <td>
                                                            <span className="mb-0 text-sm">
                                                               {drug.description}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="mb-0 text-sm">
                                                                $ {drug.price}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="mb-0 text-sm">
                                                                {drug.quantity}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <Button size='sm' color="danger" className='text-center' onClick={() => deleteDrug({ doctorId: user.id , drugId: drug.id})}>Delete</Button>
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

export default AddDeleteDrugs

const AddDrug = (props) => {
    const [error, setError] = useState("")
    const [drugName, setDrugName] = useState("")
    const [drugDescription, setDrugDescription] = useState("")
    const [drugPrice, setDrugPrice] = useState(0)
    const [drugQuantity, setDrugQuantity] = useState(0)
 
    const addDrug = async () => {
        try {
            if(drugName && drugDescription && drugPrice > 0 && drugQuantity > 1){
                const data = {
                    name: drugName,
                    description: drugDescription,
                    price: drugPrice,
                    quantity: drugQuantity
                }
                console.log(data)
                const response = await DrugApi.AddDrug(props.doctor.doctorId, [data])
                console.log(response.data)
                await props.fetch();
                props.close()
            } else{
                setError("All fields are required.")
            }
        } catch (error) {
            console.log(error)
            setError("Error: Couldn't add this drug.")
        }
    }
    return <>
        <Row>
            <Col>
                <Row className='align-items-center mb-1'>
                    <Col className='text-left'>
                        <h3>Add Drug</h3>
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
                            Name*
                        </Label>
                        <Input
                            defaultValue=""
                            placeholder="Write a name..."
                            type="text"
                            maxLength={40}
                            onChange={(e) => setDrugName(e.target.value)}
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
                            onChange={(e) => setDrugDescription(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row className='mb-2'>
                    <Col className='text-left'>
                        <Label
                            className='text-sm'
                        >
                            Price*
                        </Label>
                        <Input
                            defaultValue=""
                            placeholder="Write a price..."
                            type="number"
                            max={500}
                            onChange={(e) => setDrugPrice(Number(e.target.value))}
                        />
                    </Col>
                </Row>
                <Row className='mb-2'>
                    <Col className='text-left'>
                        <Label
                            className='text-sm'
                        >
                            Quantity*
                        </Label>
                        <Input
                            defaultValue=""
                            placeholder="Write a quantity..."
                            type="text"
                            max={100}
                            onChange={(e) => setDrugQuantity(Number(e.target.value))}
                        />
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col>
                        <Button className='text-center' color="primary" onClick={addDrug}>Add Drug</Button>
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

const DeleteDrug = (props) => {
    const [error, setError] = useState("")

    const deleteDrug = async () => {
        try {
            const response = DrugApi.DeleteDrug(props.doctor.drugId)
            console.log(response.data)
            await props.fetch();
            props.close()
        } catch (error) {
            setError("Error: Couldn't add this drug.")
        }
    }

    return <>
        <Row>
            <Col>
                <Row className='align-items-center mb-1'>
                    <Col className='text-left'>
                        <h3>Delete drug</h3>
                    </Col>
                    <Col className='text-right' xs="2">
                        <button aria-label="Close" className='close' data-dismiss="modal" type='button' onClick={props.close}>
                            <span aria-hidden={true}>x</span>
                        </button>
                    </Col>
                </Row>
                <hr className='mt-3' />
                <Row>
                    <Col>
                        <h3>Confirm that you want to delete this drug</h3>
                    </Col>
                </Row>
                <Row className='mt-2'>
                    <Col>
                        <Button className='text-center' color="primary" onClick={deleteDrug}>Delete Drug</Button>
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

