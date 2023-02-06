/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import { Container, Row, Col } from 'reactstrap'

const UserHeader = (props) => {
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: '300px',
          backgroundImage:
            'url(' + require('../../assets/img/theme/profile-cover.jpg') + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white ws-0">Hello {props.firstName + " " + props.lastName}</h1>
              <p className="text-white mt-0 mb-5">
                This is your profile page. You can edit your information here.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default UserHeader
