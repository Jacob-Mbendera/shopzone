import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../../utils/errors.utils';
import './search-screen.styles.scss'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from '../../components/rating/rating.component'
import LoadingBox from '../../components/loading-box/loading-box.component'
import MessageBox from '../../components/message-box/message-box.component'
import Product from '../../components/product/product.component'
import LinkContainer from 'react-router-bootstrap/LinkContainer'


const reducer = (state, action)=>{
    switch(action.type){

        case 'FETCH_REQUEST':
            return{...state, loading: true}

        case 'FETCH_SUCCESS':
            return{
                ...state, 
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                countProducts: action.payload.countProducts,
                loading: false,
            }

        case 'FETCH_FAIL':
            return{
                ...state, 
                error: action.payload,
                loading: false}

        default:
            return state;
    }
}

const prices = [

    {
        name: "$1 to $50",
        value: "1-50",
    },
    {
        name: "$51 to $200",
        value: "51-200",
    },
    {
        name: "$201 to $1000",
        value: "201-1000",
    },
]

const ratings = [

    {
        name: "4stars & up",
        rating: 4,
    },
    {
        name: "3stars & up",
        rating: 3
    },
    {
        name: "2stars & up",
        rating: 2
    },
    {
        name: "1star & up",
        rating: 1
    },
]

const SearchScreen = ()=>{ const navigate = useNavigate();
    const { search } = useLocation();
    const searchParam = new URLSearchParams(search); // /search?category=Shirts
    const category = searchParam.get('category') || 'all';
    const query = searchParam.get('query') || 'all';
    const price = searchParam.get('price') || 'all';
    const rating = searchParam.get('rating') || 'all';
    const order = searchParam.get('order') || 'newest';
    const page = searchParam.get('page') || 1;
  
    const [{ loading, error, products, pages, countProducts }, dispatch] =
      useReducer(reducer, {
        loading: true,
        error: '',
      });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(
            `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
          );
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (err) {
          dispatch({
            type: 'FETCH_FAIL',
            payload: getError(error),
          });
        }
      };
      fetchData();
    }, [category, error, order, page, price, query, rating]);
  
    const [categories, setCategories] = useState([]);
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const { data } = await axios.get(`/api/products/categories`);
          setCategories(data);
        } catch (err) {
          toast.error(getError(err));
        }
      };
      fetchCategories();
    }, [dispatch]);
  
    const getFilterUrl = (filter) => {
      const filterPage = filter.page || page;
      const filterCategory = filter.category || category;
      const filterQuery = filter.query || query;
      const filterRating = filter.rating || rating;
      const filterPrice = filter.price || price;
      const sortOrder = filter.order || order;
      return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
    };
    return (
      <div>
        <Helmet>
          <title>Search Products</title>
        </Helmet>
        <Row>

          <Col md={3}>
            <h3>Department</h3>
            <div>
              <ul>
                <li>
                  <Link
                    to={getFilterUrl({ category: 'all' })} //set category in queryString "all"
                    className={'all' === category ? 'text-bold' : ''} //if categories === all make text bold
                  >
                    Any
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      to={getFilterUrl({ category: c })}
                      className={c === category ? 'text-bold' : ''}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Price</h3>
              <ul>
                <li>
                  <Link
                   to={getFilterUrl({ price: 'all' })}
                    className={'all' === price ? 'text-bold' : ''}
                  >
                    Any
                  </Link>
                </li>
                {prices.map((p) => (
                  <li key={p.value}>
                    <Link
                      to={getFilterUrl({ price: p.value })}
                      className={p.value === price ? 'text-bold' : ''}
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Avg. Customer Review</h3>
              <ul>
                {ratings.map((r) => (
                  <li key={r.name}>
                    <Link
                      to={getFilterUrl({ rating: r.rating })}
                      className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}
                    >
                      <Rating caption={' & up'} rating={r.rating}></Rating>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to={getFilterUrl({ rating: 'all' })}
                    className={rating === 'all' ? 'text-bold' : ''}
                  >
                    <Rating caption={' & up'} rating={0}></Rating>
                  </Link>
                </li>
              </ul>
            </div>
          </Col>


          <Col md={9}>
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <>
                <Row className="justify-content-between mb-3">
                  <Col md={6}>
                    <div>
                      {/* results === 0 show No else show results count */}
                      {countProducts === 0 ? 'No' : countProducts} Results
                       {/* query not equal to all ? append the query etc  */}
                      {query !== 'all' && ' : ' + query}
                      {category !== 'all' && ' : ' + category}
                      {price !== 'all' && ' : Price ' + price}
                      {rating !== 'all' && ' : Rating ' + rating + ' & up'}

                {/* if there is a match; thus the query,category etc are not equal to all, show button to clear all filters n redirect to search screen */}
                      {query !== 'all' ||
                      category !== 'all' ||
                      rating !== 'all' ||
                      price !== 'all' ? (
                        <Button
                          variant="light"
                          onClick={() => navigate('/search')}
                        >
                          <i className="fas fa-times-circle"></i>
                        </Button>
                      ) : null}
                    </div>
                  </Col>
                  <Col className="text-end"> 
                    Sort by{' '}
                    <select
                      value={order}
                      onChange={(e) => {
                        navigate(getFilterUrl({ order: e.target.value }));
                      }}
                    >
                      <option value="newest">Newest Arrivals</option>
                      <option value="lowest">Price: Low to High</option>
                      <option value="highest">Price: High to Low</option>
                      <option value="toprated">Avg. Customer Reviews</option>
                    </select>
                  </Col>
                </Row>

                {products.length === 0 && (
                  <MessageBox>No Product Found</MessageBox>
                )}
  
                <Row>
                  {products.map((product) => (
                    <Col sm={6} lg={4} className="mb-3" key={product._id}>
                      <Product product={product}></Product>
                    </Col>
                  ))}
                </Row>
  
                <div>

                  {/* 1. we have created an arrya from pages
                      2. map each page to <LinkContainer>
                      3. arrays start  from  0 hence x + 1; 0+1  = 1 
                   */}
                  {[...Array(pages).keys()].map((x) => (
                    <LinkContainer
                      key={x + 1}
                      className="mx-1"
                      to={getFilterUrl({ page: x + 1 })}
                    >
                      <Button
                        className={Number(page) === x + 1 ? 'text-bold' : ''}
                        variant="light"
                      >
                        {x + 1}
                      </Button>
                    </LinkContainer>
                  ))}
                </div>
              </>
            )}
          </Col>

        </Row>
      </div>
    );
  }


export default SearchScreen;