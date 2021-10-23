import { Row, Col} from 'react-bootstrap';
import { format } from "timeago.js";

function Message({message, own}) {
    return ( 
    <div>
        <Row key={789} className="mb-2">
            <Col key={123} xs={1} sm={1} lg={1} className="m-0">
                <i className="fas fa-user fa-lg mt-4"></i>                
            </Col>
            <Col key={456} xs={10} sm={6} lg={6}>
                <div className={ own ? "rounded bg-info text-white mt-2 p-2" : "rounded p-2 bg-success text-white mt-2" }>
                    { message.text }
                </div>
            </Col>
        </Row>
        <Row key={710} className="mb-4">
            <div>{format(message.createdAt)}</div>
        </Row>
        

    </div> );
}

export default Message;