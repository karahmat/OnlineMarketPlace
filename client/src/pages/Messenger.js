import {Container, Col, Row, Form, Button} from 'react-bootstrap';
import Message from '../components/Message';
import Conversation from '../components/Conversation';
import { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../App';


function Messenger() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');    
    const userData = useContext(UserContext);
    const scrollRef = useRef();
    const chosenConversation = useRef();
    const searchParams = new URLSearchParams(window.location.search);

    const userIdUrl = searchParams.get('userId');
    const sellerIdUrl = searchParams.get('sellerId');
    


    useEffect(()=> {
        const getConversation = async() => {
            try {
                console.log("userData here", userData.userId)
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
        const initialiseChat = async(userArg, sellerArg) => {
            try {
                const res = await fetch(`/api/conversations/find/${userArg}/${sellerArg}`);
                const data = await res.json();              
                if (data) {
                    setCurrentChat(data);
                    console.log("chosen", chosenConversation.current);
                    //chosenConversation.current.style.color = "blue";
                } else {                    
                    const postedData = {
                        senderId: userArg, 
                        receiverId: sellerArg
                    }
                    console.log(postedData);
                    //create new conversation
                    const res1 = await fetch(`/api/conversations`, {
                        method: 'POST',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify(postedData)
                    });
                    const data1 = await res1.json();
                    setCurrentChat(data1);
                    //chosenConversation.current.style.color = "blue";
                }
                
              } catch (err) {
                console.log(err);
              }
        }

        if (userIdUrl && sellerIdUrl) {                       
            initialiseChat(userIdUrl, sellerIdUrl)
        } 

    }, [userIdUrl]);

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
      }, [currentChat]);

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
        e.target.parentNode.parentNode.childNodes.forEach(node => node.firstChild.style.color="#55595c");        
        e.target.style.color = "blue";        
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
                        <div ref={chosenConversation} onClick={(e) => handleCurrentChat(e, conversation)} style={{cursor: 'pointer'}}>                            
                            <Conversation key={conversation.members[1]} conversation={conversation} currentUser={userData} />
                        </div>
                    ))}
                    
                    
                </Row>
                <Row className="mt-5">
                    <p>Product Name</p>
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
                        <Message message={msg} own={msg.sender === userData.userId} />
                        </div>
                    ))}               
                </Row>
                <Row>
                    <Col xs={10} sm={8} md={8} lg={8}>
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