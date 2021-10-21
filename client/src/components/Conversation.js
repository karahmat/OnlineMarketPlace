import { useEffect, useState } from "react";

function Conversation({ currentChat, handleCurrentChat, conversation, currentUser, onlineUsers }) {
  const [user, setUser] = useState(null);  

  useEffect(() => {
    const otherUserId = conversation.members.find((person) => person !== currentUser.userId);

    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/${otherUserId}`);
        const data = await res.json();        
        setUser(data);        
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, []);

  return (
    <>           
        { user && 
        <div>          
          <i onClick={(e) => handleCurrentChat(e, conversation)} style={ currentChat?._id === conversation?._id ? {cursor: 'pointer', color: "blue"} : {cursor: 'pointer', color: "#55595c"} } className="fas fa-user fa-sm mt-4" >{user.username}</i>
          { onlineUsers.filter( (onlineUser) => onlineUser.userId === user.userId ).length > 0 && 
          <span style={{marginLeft: '2px', color: 'green'}}>
            <i className="fa-solid fa-circle fa-2xs"></i>
          </span>
          }
        </div>
        }
    </>    
  );
}

export default Conversation;