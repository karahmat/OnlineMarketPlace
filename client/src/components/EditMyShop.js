import { useState, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

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

function EditMyShop(props) {    
    const hideModal = props.onHide; //hide my Modal

    const initialState = {
        ...props.shopdata
    };
    
    const [formInputs, dispatch] = useReducer(reducer, initialState);
    const [uniqueErr, setUniqueErr] = useState();
    const [frontEndErrors, setFrontEndErrors] = useState({});    

    const handleInputChange = (inputEvent) => {
        
        if (inputEvent.target.name == "shopimage") {
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
        
        // address error
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

            const response = await fetch(`/api/shops/shop/${props.shopdata._id}`, {
                method: 'PUT',
                //headers: { 'content-type': 'application/json' },
                //body: JSON.stringify(formInputs)
                body: formData
            })
            const data = await response.json();
            
            if (data) {
                //history.push(`/shops/shop/${props.shopdata._id}`);
                window.location.assign(`/shops/shop/${props.shopdata._id}`);
                hideModal();                                
                // redirect user to /posts
            } else if (data.errors) {                
                setUniqueErr(data.errors.name);
            }
        }
        
    }

   return ( 

    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      id="myModal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit My Shop
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
                <Form.Group className="mb-3" controlId="formBasicShopname">
                    <Form.Label>Shop Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter shop name" name="name" value={formInputs.name} onChange={handleInputChange} isInvalid={ !!frontEndErrors.name } />
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.name }
                    </Form.Control.Feedback>
                    { uniqueErr && <Form.Text className="text-danger">This shopname is already in use</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicShopname">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" placeholder="Describe your shop" name="description" value={formInputs.description} onChange={handleInputChange} />                                        
                </Form.Group>
            
                <Form.Group className="mb-3" controlId="formBasicAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Enter address" name="address" value={formInputs.address} onChange={handleInputChange} isInvalid={ !!frontEndErrors.address }/>
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.address }
                    </Form.Control.Feedback>                    
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPostalCode">
                    <Form.Label>Postal Code (Singapore)</Form.Label>
                    <Form.Control type="number" minLength={6} placeholder="Enter Singapore postal code" name="postalcode" value={formInputs.postalcode} onChange={handleInputChange} isInvalid={ !!frontEndErrors.postalcode }/>
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.postalcode }
                    </Form.Control.Feedback>                    
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicContact">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control type="number" minLength={8} placeholder="Enter Singapore number" name="contactnumber" value={formInputs.contactnumber} onChange={handleInputChange} isInvalid={ !!frontEndErrors.contactnumber }/>
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.contactnumber }
                    </Form.Control.Feedback>                    
                </Form.Group>        

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload Shop Image: </Form.Label>
                    <Form.Control type="file" name="shopimage" onChange={handleInputChange} />
                </Form.Group>

                <Button variant="success rounded" type="submit" onClick={handleSubmit}>
                    Edit Shop
                </Button>

            </Form>       
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>        
     );
}

export default EditMyShop;