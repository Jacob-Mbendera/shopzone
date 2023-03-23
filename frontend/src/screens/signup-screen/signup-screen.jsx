import './signup-screen.styles.scss';
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

const SignupScreen = () => {

    //From cart.screen, navigate('/signin?redirect=/shipping'); //redirect to signin first then shipping
    const { search } = useLocation();
    const redirectUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectUrl ? redirectUrl : '/';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [comfirmPassword, setComfirmPassword] = useState('');

    const{ state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;
    const navigate = useNavigate();

    const submitHandler = async(e) =>{
        e.preventDefault();

        if(password !== comfirmPassword){
            toast.error("passwords do not match");
            return
        }

        try{
            const { data } = await Axios.post('/api/users/signup', { name, email, password});   
            ctxDispatch({ type: 'SIGN_IN_USER', payload: data })
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
                <title>Sign Up</title>
            </Helmet>

            <Form onSubmit={submitHandler}>

                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>name</Form.Label>
                    <Form.Control type="name" required onChange={(e) => setName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="comfirmPassword">
                    <Form.Label>Comfirm Password</Form.Label>
                    <Form.Control type="comfirmPassword" required onChange={(e) => setComfirmPassword(e.target.value)} />
                </Form.Group>

                <div className="mb-3">
                    <Button type="submit" variant='dark'>Sign Up</Button>
                </div>

                <div className="mb-3">
                     Already have an account?
                    <Link to={`/signin?redirect=${redirect}`}>Sign-in</Link>
                </div>
            </Form>

        </Container>
    )

}


export default SignupScreen;