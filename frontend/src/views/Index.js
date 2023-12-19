import {
  Container
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { useUserContext } from "context/UserContext";
import CustomerDashboard from "./examples/CustomerDashboard";
import WorkerDashboard from "./examples/WorkerDashboard";
import AdminData from "./examples/AdminData";


const Index = () => {

  const { user } = useUserContext();

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {user.type === "customer" ? <CustomerDashboard /> : user.type === "worker" ? <WorkerDashboard /> : user.type === "admin" ? <AdminData /> : null}
      </Container>
    </>
  );
};

export default Index;
