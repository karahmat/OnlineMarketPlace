import { useEffect, useState } from "react";

function Conversation({ currentChat, handleCurrentChat, conversation, currentUser, onlineUsers, setDeletedMsg }) {
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

  
  const handleDeleteConvo = async () => {
    try {      
      setDeletedMsg(false);
      const res = await fetch(`/api/conversations/${conversation._id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.data= "delete success") {
        setDeletedMsg(true);
        console.log('delete success');
      }
    } catch (err) {
      console.log(err);
    }
  }

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
          <span onClick={handleDeleteConvo} className="ms-1" style={{cursor: 'pointer'}}>
            <i class="far fa-trash-alt fa-sm"></i>
          </span>
        </div>
        }
    </>    
  );
}

export default Conversation;