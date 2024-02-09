import { Link } from 'react-router-dom';
const NotFoundPage = () => {
    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <h1 className="display-4">404 - Page Not Found</h1>
            <p className="lead">Oops! Looks like you got lost.</p>
            <Link to="admin/index" className="btn btn-primary">Go back to home</Link>
        </div>
    );
}


export default NotFoundPage;
