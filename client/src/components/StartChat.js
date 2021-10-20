import Button from 'react-bootstrap/Button'

function StartChat({userId, sellerId}) {

    return ( 
    <Button variant="warning rounded" href={`/messenger?userId=${userId}&sellerId=${sellerId}`}>
        Start Chat
    </Button> );
}

export default StartChat;