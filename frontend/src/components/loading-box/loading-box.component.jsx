import Spinner from 'react-bootstrap/Spinner'
const LoadingBox = () =>{

    return (
        <Spinner animation="border" role="status">
            <span className="visually-hidden">
                Loading...please wait.
            </span>
        </Spinner>
    )
}

export default LoadingBox;