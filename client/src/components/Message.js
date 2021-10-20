import { Row, Col} from 'react-bootstrap';
import { format } from "timeago.js";

function Message({message, own}) {
    return ( 
    <div className={ own ? "ml-3" : "" }>
        <Row key={789}>
            <Col key={123} xs={1} sm={1} lg={1}>
                <i className="fas fa-user fa-lg mt-5"></i>                
            </Col>
            <Col key={456} xs={10} sm={6} lg={6}>
                <p className={ own ? "rounded bg-info text-white mt-4 p-2" : "rounded p-2 bg-success text-white mt-4" }>
                    { message.text }
                </p>
            </Col>
        </Row>
        <Row key={710}>
            <div>{format(message.createdAt)}</div>
        </Row>
        

    </div> );
}

export default Message;