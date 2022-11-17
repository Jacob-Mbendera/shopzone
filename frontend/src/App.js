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

function App() {

  const {state} = useContext(Store);
  const {cart} = state;

  return (
    <BrowserRouter>
      <div>
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
