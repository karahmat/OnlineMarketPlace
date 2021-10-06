import React, { useReducer } from 'react';
import { useHistory } from 'react-router-dom';

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

function LoginPage({setUser}) {
    const [formInputs, dispatch] = useReducer(reducer, initialState);
    const history = useHistory();

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
        const response = await fetch("/api/login", {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(formInputs)
        });
        const data = await response.json();
        if (data.userId) {
            console.log(data);
            setUser(data);
            //<Redirect to="/" />
            history.push('/');
            // redirect user to /posts
        }
    }


    return (  
        <div className="container">
            
            <div className="row">
                <div className="input-field col s12">
                    <input id="email" name="email" type="email" className="validate" onChange={handleInputChange} />
                    <label htmlFor="email">Email</label>
                    <span className="helper-text" data-error="wrong" data-success="right">Helper text</span>
                </div>
            </div>

            <div className="row">
                <div className="input-field col s12">
                    <input id="password" name="password" type="password" className="validate" onChange={handleInputChange} />
                    <label htmlFor="password">Password</label>
                </div>
            </div>            
            
            <button className="btn waves-effect waves-light" type="submit" name="action" onClick={handleSubmit}>Submit
                <i className="material-icons right">send</i>
            </button>
        </div>
    );
}

export default LoginPage;