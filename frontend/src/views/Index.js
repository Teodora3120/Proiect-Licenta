import { useEffect, useState } from "react";
import Select from 'react-select'
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Label,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import domainsJson from '../utils/domains.json'
import { useUserContext } from "context/UserContext";
import WorkerApi from "api/worker";
import DashboardApi from "api/dashboard";


const Index = () => {
  const [domain, setDomain] = useState("")
  const [errorDomain, setErrorDomain] = useState("")
  const [service, setService] = useState({})
  const [services, setServices] = useState([])
  const { user } = useUserContext();

  useEffect(() => {
    const fetchData = async () => {
      await getServices()
    }
    if (user && user._id) {
      fetchData();
    }
    //eslint-disable-next-line
  }, [user])


  const getServices = async () => {
    try {
      const response = await DashboardApi.GetAllServices()
      console.log(response.data)
      setServices(response.data)
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col>
                    <h3>Search for services</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <Label>Domain</Label>
                    <Select
                      options={
                        domainsJson.map((domainObj) => {
                          return { value: domainObj.id, label: domainObj.name }
                        })
                      }
                      defaultValue={domain}
                      onChange={(e) => console.log(e)}
                      isClearable
                    />
                  </Col>
                  <Col>
                    <Label>Service</Label>
                    <Select
                      options={
                        services ? services.map((service) => {
                          return { value: service._id, label: service.name }
                        })
                          : []
                      }
                      defaultValue={domain}
                      onChange={(e) => console.log(e)}
                      isClearable
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
