import { Container, Form, Button, Spinner } from 'react-bootstrap';
// import { UserContext } from '../App';
import { useState, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import DynamicFormComponent from '../components/DynamicFormComponent';

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

function CreateProductsPage() {
    // const userData = useContext(UserContext);
    const { shopId } = useParams();
    const [formInputs, dispatch] = useReducer(reducer, initialState);
    const [frontEndErrors, setFrontEndErrors] = useState({});  
    const [formIndex, setFormIndex]  = useState([0]);
    const [formImage, setFormImage] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

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
        const imageId = e.target.id;
        const file = e.target.files[0];
        setFormImage([...formImage, { file_id: imageId, uploaded_file: file }])             
    }
     
   
    const findFormErrors = () => {        
        const { name0, description0, category0, price0, quantity0 } = formInputs;
        const newErrors = [];        
        // name error
        if ( !name0 || name0 === '' ) newErrors.name = 'first product name cannot be blank!';        
        
        // description error
        if ( !description0 || description0 === '' ) newErrors.description = 'first product description cannot be blank!';     
        
        // category error
        if ( !category0 || category0 === '' ) newErrors.category = 'first product category cannot be blank!';      

        // price error
        if ( !price0 || price0 === '' ) newErrors.price = 'first product price cannot be blank!';   
        
        // quantity error
        if ( !quantity0 || quantity0 === '' ) newErrors.quantity = 'first product quantity cannot be blank!';              
                        
        return newErrors
    }

    const addMoreFields = (e) => {
        const newIndex = formIndex[formIndex.length-1] + 1
        const newArray = [...formIndex, newIndex];
        setFormIndex(newArray);
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
                        
            const response = await fetch(`/api/products/by/${shopId}`, {
                method: 'POST',                               
                body: formData
            }); 

            const data = await response.json();
            
            if (data.data === "success") {
                setIsUploading(false);
                //console.log('success');
                //history.push('/');
                window.location.assign(`/shops/shop/${shopId}`);
                // redirect user to /posts
            } else if (data.errors) {                
                console.log(data.errors);
            }
        }
        
    }

    return ( 
        
        <Container>
            <h1>Create Products</h1>
            <Form>
                
                { formIndex.map((oneRow) => (
                    <DynamicFormComponent key={oneRow} handleFileUpload={handleFileUpload} handleInputChange={handleInputChange} frontEndErrors={frontEndErrors} formIndex={oneRow} />
                ))}
                
                
                <Button variant="info rounded" type="button" onClick={addMoreFields}>Add More Fields</Button><br/><br/>
                
                { isUploading === false && 
                <Button variant="primary rounded" type="submit" onClick={handleSubmit}>
                    Submit
                </Button>
                }

                { isUploading && 
                    <Spinner animation="border" role="status" className="ml-2">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                }

            </Form>                   
        </Container>


     );
}

export default CreateProductsPage;