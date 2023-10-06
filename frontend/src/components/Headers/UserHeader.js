import { Button, Container, Row, Col } from "reactstrap";
import { useUserContext } from "context/UserContext";
import { useEffect, useState } from "react";

const UserHeader = () => {
  const [fullName, setFullName] = useState("")
  const { user } = useUserContext()

  useEffect(() => {
    if (user) {
      setFullName(user.firstName + " " + user.lastName)
    }
  }, [user])
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "600px",
          backgroundImage:
            "url(" + require("../../assets/img/brand/my-profile-bg-image.jpg") + ")",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white">Hello {fullName}</h1>
              <p className="text-white mt-0 mb-5">
                This is your profile page. You can see your account details (and edit some of them),
                or how many bookings did you have and other helpful information.
              </p>
              <Button
                color="info"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                Edit profile
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserHeader;
