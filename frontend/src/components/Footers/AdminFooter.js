import { Row, Col } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-center">
        <Col xl="12">
          <div className="copyright text-center text-muted">
            © {new Date().getFullYear()}{" "}
            Vestale Ionela-Teodora
          </div>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
