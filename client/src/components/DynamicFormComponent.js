import Form from 'react-bootstrap/Form';


function DynamicFormComponent({handleInputChange, handleFileUpload, frontEndErrors, formIndex}) {
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

    return ( 
    <>
        <h2>Product {formIndex+1}</h2>
        <Form.Group className="mb-3" controlId="formBasicNameOfProduct">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="name of product" index={formIndex} name={`name${formIndex}`} required onChange={handleInputChange} isInvalid={ !!frontEndErrors.name } />
            <Form.Control.Feedback type='invalid'>
                { frontEndErrors.name }
            </Form.Control.Feedback>                    
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" placeholder="Description of product" index={formIndex} name={`description${formIndex}`} required onChange={handleInputChange} isInvalid={ !!frontEndErrors.description } />
            <Form.Control.Feedback type='invalid'>
                { frontEndErrors.description }
            </Form.Control.Feedback>                    
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>Category</Form.Label>
            
            <Form.Control as="select" name={`category${formIndex}`} onChange={handleInputChange} isInvalid={ !!frontEndErrors.category }>
                    <option value={null}>Choose a category</option>
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
            <Form.Control type="number" placeholder="Price in SGD" step="0.01" index={formIndex} required name={`price${formIndex}`} onChange={handleInputChange} isInvalid={ !!frontEndErrors.price }/>
            <Form.Control.Feedback type='invalid'>
                { frontEndErrors.price }
            </Form.Control.Feedback>                    
        </Form.Group>  

        <Form.Group className="mb-3" controlId="formBasicQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control type="number" placeholder="Quantity" required index={formIndex} name={`quantity${formIndex}`} onChange={handleInputChange} isInvalid={ !!frontEndErrors.quantity }/>
            <Form.Control.Feedback type='invalid'>
                { frontEndErrors.quantity }
            </Form.Control.Feedback>                    
        </Form.Group>  

        <Form.Group className="mb-3">
            <Form.Label>Upload Product Image: </Form.Label><br />
            <Form.Control className="mt-2" type="file" id={`image${formIndex}`} onChange={handleFileUpload} />
        </Form.Group>

    </>  );
}

export default DynamicFormComponent;