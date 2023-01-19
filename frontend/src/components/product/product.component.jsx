import './product.styles.css';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Rating from '../rating/rating.component';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../../context/store.context';



const Product = (props) => {
    const {product} = props;
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {
        cart: {cartItems}
    } = state;

const addToCartHandler =async (item) =>{

    const {data} = await axios.get(`/api/products/${item._id}`);
    const existingCartItem = cartItems.find((x) => x._id === product._id);
    const quantity  = existingCartItem ? existingCartItem.quantity + 1 : 1;

    if(data.countInStock < quantity){
        window.alert('Sorry, Product is out of stock');
        return;
    }

    ctxDispatch({ type: 'ADD_CART_ITEM', payload: {...item, quantity}})

}
    return(
    <Card>
        <Link to={`/product/${product.slug}`}>
        <img src={product.image} alt={product.slug}  className="card-img-top"/>
        </Link>

        <Card.Body>
            <Link to={`/product/${product.slug}`}>
                <Card.Title> {product.name}</Card.Title>
            </Link>
            <Rating rating={product.rating} numReviews={product.numReviews} />
            <Card.Text>${product.price}</Card.Text>
            {
            product.countInStock === 0 ? 
            <Button variant="light" disabled>Count of Stock</Button>:
            <Button className='cart-button' onClick={() => addToCartHandler(product)}>Add to Cart</Button>
             }
        </Card.Body> 
    </Card>
    )
 
}

    export default Product;
