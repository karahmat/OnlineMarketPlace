import { useEffect, useState } from "react";

function Conversation({ conversation, currentUser }) {
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
        <i className="fas fa-user fa-sm mt-4" >{user.username}</i>
        }
    </>    
  );
}

export default Conversation;