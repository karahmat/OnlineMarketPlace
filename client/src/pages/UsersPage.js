import {useFetchAPI} from '../hooks/useFetchAPI.js';
import { Link } from 'react-router-dom';

function UsersPage() {
    const apiEndPoint = "/api/users";
    const {result, isLoading, error} = useFetchAPI(apiEndPoint);
        
    if (!result || isLoading) {
        return ( 
        <div className="container">
            <h2>Loading.....</h2>
        </div>)
    } else if (result.errorMsg) {
        return (
        <div className="container">
            <h2>You are not authenticated</h2>
        </div>
        )
    }
    return ( 
        <div>
            { error && <h2>{ error }</h2>}
            <div className="section">
                
            
                    <ul className="collection">
                        {   result && result.data.map( (eachUser) => (
                                <li key={eachUser._id} className="collection-item avatar left-align">
                                    <i className="material-icons">account_circle</i>
                                    <span className="title">{eachUser.username}</span>
                                    <p>{eachUser.email} <br />
                                    {eachUser.usertype}
                                    </p>
                                    <span className="secondary-content"><Link to="#"><i className="material-icons">arrow_right_alt</i></Link></span>
                                </li>
                            ))
                        }
                        
                    </ul>
                  
            </div>
        </div> 
    );
}

export default UsersPage;