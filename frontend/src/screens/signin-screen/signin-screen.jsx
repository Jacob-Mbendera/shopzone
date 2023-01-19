import './signin-screen.styles.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import {Link, useLocation, useNavigate } from'react-router-dom';
import {Helmet } from 'react-helmet-async';
import Axios from 'axios';
import { useState } from 'react';
import { useContext } from 'react';
import { Store } from '../../context/store.context';
import { useEffect } from 'react';
import {toast} from 'react-toastify';
import { getError } from '../../utils/errors.utils';

const SigninScreen = () => {

    //From cart.screen, navigate('/signin?redirect=/shipping'); //redirect to signin first then shipping
    const { search } = useLocation();
    const redirectUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectUrl ? redirectUrl : '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const{ state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;
    const navigate = useNavigate();

    const submitHandler = async(e) =>{
        e.preventDefault();

        try{
            //ajax request to backback for an API we created /api/users/signin/
            const {data} = await Axios.post('/api/users/signin', { email, password});
            ctxDispatch({ type: "SIGN_IN_USER", payload: data });
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate(redirect || '/');

        } catch(err){
            toast.error(getError(err));
        }

    }

    useEffect( ()=>{
        //if userInfo exists redirect user to redirect variable instead of taking you to login page
        if(userInfo){
            navigate(redirect);
        }
    },[navigate, redirect,userInfo]); //make sure all the required/used variables in useEffect are put in the array
    return(
        <Container className="small-container"> 

            <Helmet>
                <title>Sign In</title>
            </Helmet>

            <Form onSubmit={submitHandler}>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
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