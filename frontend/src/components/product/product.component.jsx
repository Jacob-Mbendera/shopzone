import './product.styles.css';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Rating from '../rating/rating.component';

const Product = (props) => {
    const {product} = props;
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
            <Button variant="light" disabled>Out of Stock</Button>:
            <Button className='cart-button' >Add to Cart</Button>
             }
        </Card.Body> 
    </Card>
    )
 
}

    export default Product;
