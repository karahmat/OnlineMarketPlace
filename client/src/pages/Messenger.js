import {Container, Col, Row, Form, Button} from 'react-bootstrap';
import Message from '../components/Message';
import Conversation from '../components/Conversation';
import { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../App';
import { useLocation, useHistory } from 'react-router-dom';


function Messenger() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState(''); 
    const [productMsg, setProductMsg] = useState('');
    const userData = useContext(UserContext);
    const scrollRef = useRef();    
    const location = useLocation();
    const history = useHistory();    
    
    
    useEffect(()=> {
        const getConversation = async() => {
            try {                
                const res = await fetch(`/api/conversations/${userData.userId}`);
                const data = await res.json();                
                setConversations(data);
            } catch (err) {
                console.log(err);
            }
        }
        if(userData.userId !== '') {
            getConversation();
        }
    }, [userData, currentChat]);

    useEffect(()=> {
                
        const initialiseChat = async(userArg, sellerArg, productArg) => {
            try {
                
                const res = await fetch(`/api/conversations/find/${userArg.userId}/${sellerArg.sellerId}`);
                const data = await res.json();              
                if (data) {
                    setCurrentChat(data);
                    setProductMsg(`I have a question on: ${productArg.productName}`);

                } else {                    
                    const postedData = {
                        senderId: userArg.userId, 
                        receiverId: sellerArg.sellerId
                    }                    
                    //create new conversation
                    const res1 = await fetch(`/api/conversations`, {
                        method: 'POST',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify(postedData)
                    });
                    const data1 = await res1.json();
                    setCurrentChat(data1); 
                    setProductMsg(`I have a question on: ${productArg.productName}`)                    
                }
                
              } catch (err) {
                console.log(err);
              }
        }

        if (location.state) {            
            const userIdUrl = location.state.userId;
            const sellerIdUrl = location.state.sellerId;
            const productName = location.state.productName;                
            initialiseChat(userIdUrl, sellerIdUrl, productName);  
                   
        }       

    }, [location]);

    useEffect(() => {
        const getProductMsg = async(userArg1, chat) => {            
            const message2 = {
                sender: userArg1.userId,
                text: productMsg,
                conversationId: chat._id,
            };

            try {
                const res2 = await fetch("/api/messages", {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(message2)
                    });
                const data2 = await res2.json();
                setMessages([...messages, data2]);
            } catch (err) {
                console.log(err);
            }
            
        }

        if(location.state && currentChat) {
            const userIdUrl = location.state.userId;                                
            getProductMsg(userIdUrl, currentChat);
            history.replace();   
        }

    }, [productMsg]);

    useEffect(() => {
        const getMessages = async () => {
          try {
            const res = await fetch("/api/messages/" + currentChat?._id);
            const data = await res.json();
            setMessages(data);
          } catch (err) {
            console.log(err);
          }
        };
        getMessages();
      }, [currentChat, productMsg]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        const message = {
            sender: userData.userId,
            text: newMessage,
            conversationId: currentChat._id,
        };

        // const receiverId = currentChat.members.find(
        //   (member) => member !== user._id
        // );

        // socket.current.emit("sendMessage", {
        //   senderId: user._id,
        //   receiverId,
        //   text: newMessage,
        // });

        try {
            const res = await fetch("/api/messages", {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(message)
            });
            const data = await res.json();
            setMessages([...messages, data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }
    };

    const handleCurrentChat = (e, argConversation) => {        
        setCurrentChat(argConversation);
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [messages])

    return ( 
    <Container>
        <Row className="mt-4">     
            <Col xs={6} md={3} lg={3}>
                <h3>Chat Menu</h3>
                <Row>
                    
                    
                    { conversations.length > 0 && conversations.map((conversation) => (
                        <div>                            
                            <Conversation key={conversation._id} currentChat={currentChat} handleCurrentChat={handleCurrentChat} conversation={conversation} currentUser={userData} />
                        </div>
                    ))}
                    
                    
                </Row>                                              
            </Col>
            <Col xs={6} md={8} lg={8} >
                { currentChat ? (
                <>    
                <Row style={{
                    height: '100%',
                    overflowY: 'scroll',
                    paddingRight: '10px'
                }}>
                    {messages.map((msg) => (
                        <div ref={scrollRef}>
                        <Message key={msg._id} message={msg} own={msg.sender === userData.userId} />
                        </div>
                    ))}               
                </Row>
                <Row>
                    <Col xs={10} sm={8} md={8} lg={8} className="mb-4">
                        <Form.Control 
                            as="textarea" 
                            placeholder="Comments"
                            onChange={(e) => setNewMessage(e.target.value)}
                            value={newMessage} 
                        />
                    </Col>
                    <Col xs={4} sm={2} md={2} lg={2}>
                        <Button type='submit' variant="warning" onClick={handleSubmit}>Submit</Button>
                    </Col>          

                </Row>
                </>
                ) : (
                <Row>
                    <p>Open a conversation to start a chat.</p>
                </Row>
                )}
                
            </Col>
        
        </Row>   
    </Container> );
}

export default Messenger;