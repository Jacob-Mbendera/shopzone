import './signin-screen.styles.scss';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import {Link, useLocation } from'react-router-dom';
import {Helmet } from 'react-helmet-async';


const SigninScreen = () => {

    const { search } = useLocation();
    const redirectUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectUrl ? redirectUrl : '/';

    return(
        <Container className="small-container"> 

            <Helmet>
                <title>Sign In</title>
            </Helmet>

            <Form>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required/>
                </Form.Group>

                <div className="mb-3">
                    <Button type="submit">Sign In</Button>
                </div>

                <div className="mb-3">
                     New User ?
                    <Link to={`/signup?redirect=${redirect}`}>Create account</Link>
                </div>
            </Form>

        </Container>
    )

}


export default SigninScreen;