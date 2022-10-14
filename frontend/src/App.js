import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/home-screen/home-screen';
import ProductScreen from './screens/product-screen/product-screen';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <Link to="/">ShopZone</Link>
        </header>

        <main> 
          <Routes>
            <Route path='/product/:slug' element={ <ProductScreen />} /> 
            <Route path='/' element ={ <HomeScreen />} />
          </Routes> 
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
