import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/home-screen/home.screen';
import ProductScreen from './screens/product-screen/product.screen';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import {LinkContainer} from 'react-router-bootstrap';
import Badge from 'react-bootstrap/esm/Badge';
import Nav from 'react-bootstrap/Nav';
import { useContext, useEffect, useState } from 'react';
import { Store } from './context/store.context';
import CartScreen from './screens/cart-screen/cart.screen';
import SigninScreen from './screens/signin-screen/signin-screen';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingScreen from './screens/shipping-screen/shipping.screen';
import SignupScreen from './screens/signup-screen/signup-screen';
import PaymentMethod from './screens/payment-method/payment-method';
import OrderReview from './screens/order-review/order-review';
import OrderScreen from './screens/order-screen/order-screen';
import OrderHistory from './screens/order-history/order-history';
import UserProfile from './screens/user-profile-screen/user-profile';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { getError } from './utils/errors.utils';
import SearchBox from './components/search-box/search-box';
import SearchScreen from './screens/search-screen/search-screen';

function App() {


  const {state, dispatch: ctxDispatch} = useContext(Store);
  const {cart, userInfo} = state;

const signoutHandler = () =>{
  try{
    ctxDispatch({ type: "SIGN_OUT" });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href=('/signin');
  } catch(err){
    
  }
}
const [sideBarIsOpen,setSideBarIsOpen] = useState(false);
const [categories,setCategories] = useState([]);

useEffect(()=>{
  const fetchCategories = async()=>{
    try{  
      const { data } = await axios.get('/api/products/categories');
      setCategories(data);
    } catch(err){
        toast.error(getError(err));
    }
  
    }
    fetchCategories();
    
},[])
return (
    <BrowserRouter>
      <div className={   sideBarIsOpen ? "d-flex flex-column site-container active-container" : "d-flex flex-column site-container"}>
        <ToastContainer position="top-right" limit={1} />
        <header> 
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button variant="dark" onClick={()=> setSideBarIsOpen(!sideBarIsOpen)}><i className="fas fa-bars"></i> </Button>
              <LinkContainer to="/">
                <Navbar.Brand>ShopZone</Navbar.Brand>
              </LinkContainer>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav" >
                    <SearchBox />
                  <Nav className="me-auto w-100 justify-content-end">
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
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div className={sideBarIsOpen ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column" : "side-navbar d-flex justify-content-between flex-wrap flex-column"}>
            <Nav className="flex-column text-white w-100 p-2">
              <Nav.Item>
                <strong>Categories</strong>
              </Nav.Item>
              {
                
                categories.map((category) =>(
                  <Nav.Item key={category}>
                    <LinkContainer to={`/search/category/=${category}`} onClick={()=> setSideBarIsOpen(false)}>
                      <Nav.Link>{category}</Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                ))
              }
            </Nav>
        </div>
        <main> 
          <Container className='d-flex flex-column site-container mt-3'>
            <Routes>
              <Route path='/product/:slug' element={ <ProductScreen />} /> 
              <Route path='/' element ={ <HomeScreen />} />
              <Route path='/cart' element={<CartScreen />} />
              <Route path='/signin' element={<SigninScreen />} />
              <Route path='/signup' element={<SignupScreen />} />
              <Route path='/shipping' element={<ShippingScreen />} />
              <Route path='/payment' element={<PaymentMethod />} />
              <Route path='/order' element={<OrderReview />} />
              <Route path='/order/:id' element={<OrderScreen />} />
              <Route path='/orderhistory' element={<OrderHistory />} />
              <Route path='/profile' element={<UserProfile/>} />
              <Route path='/search' element={<SearchScreen />} />
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
