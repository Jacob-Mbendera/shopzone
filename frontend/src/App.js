import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/home-screen/home.screen';
import ProductScreen from './screens/product-screen/product.screen';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import {LinkContainer} from 'react-router-bootstrap';
import Badge from 'react-bootstrap/esm/Badge';
import Nav from 'react-bootstrap/Nav';
import { useContext } from 'react';
import { Store } from './context/store.context';
import CartScreen from './screens/cart-screen/cart.screen';
import SigninScreen from './screens/signin-screen/signin-screen';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const {state, dispatch: ctxDispatch} = useContext(Store);
  const {cart, userInfo} = state;

const signoutHandler = () =>{
  try{
    ctxDispatch({ type: "SIGN_OUT" })
    localStorage.removeItem('userInfo')
  } catch(err){
    
  }
}
  return (
    <BrowserRouter>
      <div className='d-flex flex-column site-container'>
        <ToastContainer position="top-right" limit={1} />
        <header> 
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>ShopZone</Navbar.Brand>
              </LinkContainer>

                  <Nav className="me-auto">
                  <Link to="cart" className='nav-link'>
                    Cart{
                      cart.cartItems.length > 0  &&(
                        <Badge pill bg="danger">
                            {cart.cartItems.reduce((accum,currItem) => accum + currItem.quantity, 0)}
                        </Badge>
                      )
                    }
                  </Link>

                  {
                    userInfo ? (
                      <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                        <LinkContainer to={'/profile'}>
                            <NavDropdown.Item>User Profile </NavDropdown.Item>
                        </LinkContainer>
                          
                        <LinkContainer to={'/orderhistory'}>
                            <NavDropdown.Item>Order History </NavDropdown.Item>
                        </LinkContainer>

                        <NavDropdown.Divider />
                        <Link to={'#signout'} className="dropdown-item" onClick={signoutHandler}>
                          Signout
                        </Link>
                      </NavDropdown>
                    ) : (
                      <Link to={'/signin'} className="nav-link">
                          Sign In
                      </Link>


                    )}
                </Nav>

            </Container>
          </Navbar>
        </header>

        <main> 
          <Container className='d-flex flex-column site-container mt-3'>
            <Routes>
              <Route path='/product/:slug' element={ <ProductScreen />} /> 
              <Route path='/' element ={ <HomeScreen />} />
              <Route path='/cart' element={<CartScreen />} />
              <Route path='/signin' element={<SigninScreen />} />
            </Routes> 
          </Container>
        </main>

        <footer>
          <div className='text-center'> All rigthts reserved </div>
        </footer>

      </div>
    </BrowserRouter>
  );
}

export default App;
