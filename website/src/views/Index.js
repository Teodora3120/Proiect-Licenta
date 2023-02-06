import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
} from 'reactstrap'
// core components
/* eslint-disable react-hooks/exhaustive-deps */

import Header from 'components/Headers/Header'

const Index = () => {

  return (
      <>
          <Header />
          {/* Page content */}
          <Container className="mt--7" fluid>
              {/* Table */}
              <Row>
                  <Col>
                      <Card className="shadow">
                          <CardBody className='text-center'>
                              <h2 className='mb-0'>Welcome, we are happy to have you here.</h2>
                              <img width={1100} height={500} src={require('../assets/img/dashboard/welcome-page-image.png')} alt="dashboard" />
                          </CardBody>
                      </Card>
                  </Col>
              </Row>
          </Container>
      </>
  )
}

export default Index