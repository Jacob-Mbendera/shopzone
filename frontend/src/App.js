import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/home-screen/home.screen';
import ProductScreen from './screens/product-screen/product.screen';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import {LinkContainer} from 'react-router-bootstrap';
import Nav from 'react-bootstrap/Nav';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import SearchBox from './components/search-box/search-box';
import CartScreen from './screens/cart-screen/cart.screen';
import  Badge from 'react-bootstrap/Badge';
import { useSelector } from 'react-redux';

function App() {

  const cart = useSelector(state => state.cart);

useEffect(()=>{
},[])
return (
    <BrowserRouter>
      <div className={  "d-flex flex-column site-container"}>
        <header> 
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button variant="dark" ><i className="fas fa-bars"></i> </Button>
              <LinkContainer to="/">
                <Navbar.Brand>ShopZone</Navbar.Brand>
              </LinkContainer>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav" >
                    <SearchBox />
                  <Nav className="me-auto w-100 justify-content-end">

                      <Link to={"/cart"} className='nav-link'>
                        Cart{
                          cart.cartItems.length > 0  &&(
                            <Badge pill bg="danger">
                                {cart.cartItems.reduce((accum,currItem) => accum + currItem.qty, 0)}
                            </Badge>
                          )
                        }
                      </Link>
                      <Link to={'/signin'} className="nav-link">
                          Sign In
                      </Link>
                    
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main> 
          <Container className='d-flex flex-column site-container mt-3'>
            <Routes>
              <Route path='/' element ={ <HomeScreen />} /> 
              <Route path='/product/:id' element={ <ProductScreen />} /> 
              <Route path='/cart/:productId?' element={ <CartScreen />} /> 
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
