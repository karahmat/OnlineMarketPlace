import { Container, Col, Row, Image, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useState, useReducer, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';

const initialState = {};
  
  const reducer = (state, action) => {
    const { type } = action;
    switch (type) {
      case "update":        
        return {
            ...state,
            [action.payload.field]: action.payload.value
        }          
      default:
        return state;
    }
  }

function EditProductPage() {
    const selectValues = [
        "Computers and Peripherals",
        "Electronics",
        "Food and Beverages",
        "Health and Wellness",
        "Home Appliances",
        "Jewelery",
        "Men's clothing",
        "Sports and Outdoors",
        "Watches",
        "Women's clothing"
      ];

    
    const { shopId, userId, productId } = useParams();
    const userDataClient = useContext(UserContext);
    const [formInputs, dispatch] = useReducer(reducer, initialState);
    const [frontEndErrors, setFrontEndErrors] = useState({});      
    const [formImage, setFormImage] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    
    useEffect(() => {

        const getProductDetails = async() => {
            const response = await fetch(`/api/products/${productId}`);
            const data = await response.json();            
            for (const [key1, value1] of Object.entries(data.data)) {

                dispatch({
                    type: "update",
                    payload: {
                        field: key1,
                        value: value1
                    }
                });
            }
            setFormImage(data.data.image);
        }

        getProductDetails();        

        return function cleanup() { dispatch({}) }
        
    }, [])

    const handleInputChange = (inputEvent) => {
        dispatch({
            type: "update",
            payload: {
                field: inputEvent.target.name,
                value: inputEvent.target.value
            }
        });   
    }

    const handleFileUpload = (e) => {
        e.preventDefault();
        const imageId = e.target.name;
        const file = e.target.files[0];
        setFormImage([...formImage, { file_id: imageId, uploaded_file: file }]);
        
        
        //codes to deal with file upload
        const reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
        }
        reader.addEventListener("load", function () {
        // convert image file to base64 string      
            dispatch({
                type: "update",
                payload: {
                    field: "image",
                    value: reader.result
                }
            });        
        }, false);

        
    }
     
   
    const findFormErrors = () => {        
        const { name, description, category, price, quantity } = formInputs;
        const newErrors = [];        
        // name error
        if ( !name || name === '' ) newErrors.name = 'name cannot be blank!';        
        
        // description error
        if ( !description || description === '' ) newErrors.description = 'description cannot be blank!';     
        
        // category error
        if ( !category || category === '' ) newErrors.category = 'category cannot be blank!';      

        // price error
        if ( !price || price === '' ) newErrors.price = 'price cannot be blank!';   
        
        // quantity error
        if ( !quantity || quantity === '' ) newErrors.quantity = 'quantity cannot be blank!';              
                        
        return newErrors
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFrontEndErrors({});         

        // get our new errors
        const newErrors = findFormErrors()

        if ( Object.keys(newErrors).length > 0 ) {
            // We got errors!
            setFrontEndErrors(newErrors);            

        } else {            
            const formData = new FormData();

            for (const [key, value] of Object.entries(formInputs)) {
                formData.append(key, value);                           
            } 
            
            for (const oneImage of formImage) {                
                formData.append(oneImage.file_id, oneImage.uploaded_file)
            }
            
            setIsUploading(true);
                        
            const response = await fetch(`/api/products/${productId}/shops/${shopId}/users/${userId}`, {
                method: 'PUT',                               
                body: formData
            }); 

            const data = await response.json();
            
            if (data.data === "success") {
                setIsUploading(false);                
                window.location.assign(`/products/${productId}`);
                // redirect user to /posts
            } else if (data.errors) {                
                console.log(data.errors);
            }
        }
        
    }

    

    return (  
        <Container>                        
            { (userDataClient.userId !== userId ) && 
            <Alert variant="danger">You are not authorised to create product!</Alert>            
            }  

            { (userDataClient.userId === userId && formInputs) &&
            <Form>
                
                
                <Form.Group className="mb-3" controlId="formBasicNameOfProduct">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="name of product" name='name' required value={formInputs.name} onChange={handleInputChange} isInvalid={ !!frontEndErrors.name } />
                <Form.Control.Feedback type='invalid'>
                    { frontEndErrors.name }
                </Form.Control.Feedback>                    
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" placeholder="Description of product" name='description' required value={formInputs.description} onChange={handleInputChange} isInvalid={ !!frontEndErrors.description } />
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.description }
                    </Form.Control.Feedback>                    
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Category</Form.Label>
                    
                    <Form.Control as="select" name='category' onChange={handleInputChange} value={formInputs.category} isInvalid={ !!frontEndErrors.category }>
                        { selectValues.map((eachValue, index) => (
                            <option key={index} value={eachValue}>{eachValue}</option>
                        ))}                
                    </Form.Control>
                    
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.category }
                    </Form.Control.Feedback>  

                </Form.Group>
            
                <Form.Group className="mb-3" controlId="formBasicPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" placeholder="Price in SGD" step="0.01" required name='price' value={formInputs.price} onChange={handleInputChange} isInvalid={ !!frontEndErrors.price }/>
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.price }
                    </Form.Control.Feedback>                    
                </Form.Group>  

                <Form.Group className="mb-3" controlId="formBasicQuantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" placeholder="Quantity" required name='quantity' value={formInputs.quantity} onChange={handleInputChange} isInvalid={ !!frontEndErrors.quantity }/>
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.quantity }
                    </Form.Control.Feedback>                    
                </Form.Group>  

                <Form.Group className="mb-3">
                    <Form.Label>Upload Product Image: </Form.Label><br />
                    <Row>
                        <Col xs={6} sm={6} lg={4}>
                            
                            <Image src={formInputs.image} alt="image" className="mw-100"/>

                        </Col>
                    </Row>
                    <Form.Control className="mt-2" type="file" name='image' onChange={handleFileUpload} />
                </Form.Group>
                
                { isUploading === false && 
                <Button variant="info rounded" type="submit" onClick={handleSubmit}>
                    Edit Product
                </Button>
                }

                { isUploading && 
                    <Spinner animation="border" role="status" className="ml-2">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                }

            </Form>
            }

        </Container>

    );
}


export default EditProductPage;