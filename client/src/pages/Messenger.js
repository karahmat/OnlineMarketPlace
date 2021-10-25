import {Container, Col, Row, Form, Button} from 'react-bootstrap';
import Message from '../components/Message';
import Conversation from '../components/Conversation';
import { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../App';
import { useLocation, useHistory } from 'react-router-dom';
import { io } from "socket.io-client";

function Messenger() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState(''); 
    const [productMsg, setProductMsg] = useState('');
    const [deletedMsg, setDeletedMsg] = useState(false);
    const userData = useContext(UserContext);
    const scrollRef = useRef();    
    const location = useLocation();
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socket = useRef();
    const history = useHistory();    
    
    //useEffect to get and set live chat messages
    useEffect(() => {
        socket.current = io("ws://localhost:3001");
        socket.current.on("getMessage", (data) => {
          setArrivalMessage({
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
          });
        });
      }, []);
    
    //re-render list of messages when a new msg comes in from the sockets
    useEffect(() => {
    arrivalMessage &&
        currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    //to find out which users are online (only works on Heroku)
    useEffect(() => {
        if(userData.userId !== '') {            
            socket.current.emit("addUser", userData.userId);
            socket.current.on("getUsers", (users) => {
                console.log("socket users", users);
                setOnlineUsers(users);
            });
        }        
      }, [userData]);
    
    //Chat section controlled by Mongoose
    //First: Load all the conversations
    useEffect(()=> {
        const getConversation = async() => {
            try {                
                const res = await fetch(`/api/conversations/users/${userData.userId}`);
                const data = await res.json();                
                setConversations(data);
            } catch (err) {
                console.log(err);
            }
        }
        if(userData.userId !== '') {
            getConversation();            
        }
    }, [userData, currentChat, deletedMsg]);

    //Second: This is to render chat coming in after we click on a certain product
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

    //useEffect to render Msg related to product that comes in if User clicks from product page
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

            const receiverId = currentChat.members.find(
                (otherUser) => otherUser !== userData.userId
              );
      
            socket.current.emit("sendMessage", {
                senderId: userData.userId,
                receiverId,
                text: newMessage,
            });

            history.replace();   
        }

    }, [productMsg]);

    //Third: Render messages from the past 
    useEffect(() => {
        const getMessages = async () => {
          try {
            const res = await fetch("/api/messages/conversations/" + currentChat?._id);
            const data = await res.json();
            setMessages(data);
          } catch (err) {
            console.log(err);
          }
        };
        getMessages();
      }, [currentChat, productMsg, deletedMsg]);

    //how to deal with messages keyed in from the textbox
    const handleSubmit = async(e) => {
        e.preventDefault();
        const message = {
            sender: userData.userId,
            text: newMessage,
            conversationId: currentChat._id,
        };

        //SOCKET SECTION
        const receiverId = currentChat.members.find(
          (otherUser) => otherUser !== userData.userId
        );

        socket.current.emit("sendMessage", {
          senderId: userData.userId,
          receiverId,
          text: newMessage,
        });

        //MONGOOSE SECTION
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
    <Container style={{height: '100%'}}>
        <Row className="mt-4">     
            <Col key={1234} xs={5} md={3} lg={3} style={{height: "300px"}}>
                <h3>Chat Menu</h3>
                <Row>
                    
                    
                    { conversations.length > 0 && conversations.map((conversation) => (
                        <div>                            
                            <Conversation 
                                key={conversation._id} 
                                currentChat={currentChat} 
                                handleCurrentChat={handleCurrentChat} 
                                conversation={conversation} 
                                currentUser={userData} 
                                onlineUsers={onlineUsers}
                                setDeletedMsg={setDeletedMsg} />
                        </div>
                    ))}
                    
                    
                </Row>                                              
            </Col>
            <Col key={1231} xs={7} md={8} lg={8} style={{                    
                    height: '600px',
                    overflowY: 'scroll',
                    paddingRight: '10px'
                }} >
                { currentChat ? (
                <>    
                <Row key={'row1'}>
                    {messages.map((msg) => (
                        <div ref={scrollRef}>
                        <Message key={msg._id} message={msg} own={msg.sender === userData.userId} />
                        </div>
                    ))}               
                </Row>
                <Row key={'row2'}>
                    <Col key={'col1'} xs={10} sm={8} md={8} lg={8} className="mb-4">
                        <Form.Control 
                            as="textarea" 
                            placeholder="Comments"
                            onChange={(e) => setNewMessage(e.target.value)}
                            value={newMessage} 
                        />
                    </Col>
                    <Col key={'col2'} xs={4} sm={2} md={2} lg={2}>
                        <Button type='submit' variant="warning" onClick={handleSubmit}>Submit</Button>
                    </Col>          

                </Row>
                </>
                ) : (
                <Row key={'row2'}>
                    <p>Open a conversation to start a chat.</p>
                </Row>
                )}
                
            </Col>
        
        </Row>   
    </Container> );
}

export default Messenger;