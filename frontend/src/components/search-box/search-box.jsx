import './search-box.scss'
import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/esm/Button';

const SearchBox = ()=> {
    const[query, setQuery] = useState('');
    const  navigate = useNavigate();

    const submitHandler = (e)=>{
        e.preventDefault();
        navigate(query ? `/search?=${query}` : '/search')
         
    }
  return (
    <Form className="d-flex me-au" onSubmit={submitHandler}>
        <InputGroup>
            <FormControl
            type="text" 
            name="query" 
            id="query" 
            placeholder ="search categories" 
            aria-label="Search Products" 
            aria-describedby="button-search" 
            onChange={(e)=> setQuery(e.target.value)} />
        </InputGroup>
    <Button type="submi" variant="outline-secondary" id='button-search' > <i className='fas fa-search '></i> </Button>
    </Form>
  )
}


export default SearchBox; 
