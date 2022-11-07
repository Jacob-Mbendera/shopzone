import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/home-screen/home-screen';
import ProductScreen from './screens/product-screen/product-screen';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import {LinkContainer} from 'react-router-bootstrap';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header> 
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>ShopZone</Navbar.Brand>
              </LinkContainer>
            </Container>
          </Navbar>
        </header>

        <main> 
          <Container className='d-flex flex-column site-container mt-3'>
            <Routes>
              <Route path='/product/:slug' element={ <ProductScreen />} /> 
              <Route path='/' element ={ <HomeScreen />} />
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
