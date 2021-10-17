import { useState, useReducer, useContext } from 'react';
import { UserContext } from '../App';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const initialState = {
    name: '',
    address: '',
    description: '',
    contactnumber: '',
    postalcode: '',
    shopimage: ''
  };
  
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

function CreateShopPage() {
    const [formInputs, dispatch] = useReducer(reducer, initialState);
    const [uniqueErr, setUniqueErr] = useState();
    const [frontEndErrors, setFrontEndErrors] = useState({});
    const userData = useContext(UserContext);

    const handleInputChange = (inputEvent) => {

        if (inputEvent.target.name === "shopimage") {
            dispatch({
                type: "update",
                payload: {
                    field: 'shopimage',
                    value: inputEvent.target.files[0]
                }
            });  
        } else {
            dispatch({
                type: "update",
                payload: {
                    field: inputEvent.target.name,
                    value: inputEvent.target.value
                }
            });               
        }
      }
    
    const findFormErrors = () => {
        
        const { name, address, contactnumber, postalcode } = formInputs;
        const newErrors = {};        
        // name error
        if ( !name || name === '' ) newErrors.name = 'cannot be blank!';        
        
        // adderss error
        if ( !address || address === '' ) newErrors.address = 'cannot be blank!';       
        
        // contactnumber error
        if ( !contactnumber || contactnumber === '' ) newErrors.contactnumber = 'cannot be blank!';          
        else if ( contactnumber.length < 8 ) newErrors.contactnumber = 'contact number must be at least 8 characters long'
        
        // postalcode error
        if ( !postalcode || postalcode === '' ) newErrors.postalcode = 'cannot be blank!';          
        else if ( postalcode.length < 6 ) newErrors.postalcode = 'postalcode must be at least 6 characters long'
                
        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFrontEndErrors({}); 
        setUniqueErr();

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

            const response = await fetch(`/api/shops/by/${userData.userId}`, {
                method: 'POST',
                // headers: { 'content-type': 'application/json' },
                body: formData
            })
            const data = await response.json();
            
            if (data.shopId) {
                //history.push('/');
                window.location.assign(`/shops/by/${userData.userId}`);
                // redirect user to /posts
            } else if (data.errors) {                
                setUniqueErr(data.errors.name);
            }
        }
        
    }
    

    return ( 
        <Container>
            <h1 className="mt-2">New Shop</h1>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicShopname">
                    <Form.Label>Shop Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter shop name" name="name" onChange={handleInputChange} isInvalid={ !!frontEndErrors.name } />
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.name }
                    </Form.Control.Feedback>
                    { uniqueErr && <Form.Text className="text-danger">This shopname is already in use</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicShopname">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" placeholder="Describe your shop" name="description" onChange={handleInputChange} />                                        
                </Form.Group>
            
                <Form.Group className="mb-3" controlId="formBasicAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Enter address" name="address" onChange={handleInputChange} isInvalid={ !!frontEndErrors.address }/>
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.address }
                    </Form.Control.Feedback>                    
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPostalCode">
                    <Form.Label>Postal Code (Singapore)</Form.Label>
                    <Form.Control type="number" minLength={6} placeholder="Enter Singapore postal code" name="postalcode" onChange={handleInputChange} isInvalid={ !!frontEndErrors.postalcode }/>
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.postalcode }
                    </Form.Control.Feedback>                    
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicContact">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control type="number" minLength={8} placeholder="Enter Singapore number" name="contactnumber" onChange={handleInputChange} isInvalid={ !!frontEndErrors.contactnumber }/>
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.contactnumber }
                    </Form.Control.Feedback>                    
                </Form.Group>        

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload Shop Image: </Form.Label><br />
                    <Form.Control className="mt-2" type="file" name="shopimage" onChange={handleInputChange} />
                </Form.Group>

                <Button variant="info rounded" type="submit" onClick={handleSubmit}>
                    Create Shop
                </Button>

            </Form>
        </Container>
     );
}

export default CreateShopPage
