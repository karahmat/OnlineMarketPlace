import React, { useReducer, useState } from 'react';
//import { useHistory } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

const initialState = {
    email: '',
    password: ''    
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

function LoginPage() {
    const [formInputs, dispatch] = useReducer(reducer, initialState);
    const [errorMsg, setErrorMsg] = useState({
        email: '',
        password: ''
    })
    const [frontEndErrors, setFrontEndErrors] = useState({});
    //const history = useHistory();

    const findFormErrors = () => {
        
        const { email, password } = formInputs;
        const newErrors = {};
        // name error
        if ( !email || email === '' ) newErrors.email = 'cannot be blank!';
        // password error
        if ( !password || password === '' ) newErrors.password = 'cannot be blank!';          
        
        return newErrors
    }

    const handleInputChange = (inputEvent) => {
        dispatch({
          type: "update",
          payload: {
            field: inputEvent.target.name,
            value: inputEvent.target.value
          }
        })
      }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFrontEndErrors({}); 
        setErrorMsg({email: '', password: ''});
        // get our new errors
        const newErrors = findFormErrors()

        if ( Object.keys(newErrors).length > 0 ) {
            // We got errors!
            setFrontEndErrors(newErrors);            

        } else {

            const response = await fetch("/api/login", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formInputs)
            });

            const data = await response.json();
            if (data.userId) {                            
                //history.push('/');            
                // redirect user to /posts
                window.location.assign('/');
            } else if (data.errors) {
                console.log(data.errors);            
                setErrorMsg(data.errors);
            }

        }

    }

    

    return (  
        <Container>
            
            <h1>Sign In</h1>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleInputChange} isInvalid={ !!frontEndErrors.email } />
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.email }
                    </Form.Control.Feedback>                    
                </Form.Group>
            
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" onChange={handleInputChange} isInvalid={ !!frontEndErrors.password }/>
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.password }
                    </Form.Control.Feedback>
                    { (errorMsg.password !== '' || errorMsg.email !== '') && <Form.Text className="text-danger">{errorMsg.password}</Form.Text>}
                </Form.Group>   

                <Button variant="info rounded" type="submit" onClick={handleSubmit}>
                    Sign In
                </Button>

            </Form>
            
        </Container>
    );
}

export default LoginPage;