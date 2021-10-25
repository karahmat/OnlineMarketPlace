# Online Marketplace

This web application is an Online Marketplace with sellers and buyers. Sellers can create and manage multiple shops, and add products they want to sell in each of their shops. Buyers can search for and browse products they want to buy and add products to the shopping cart. However, Buyers cannot create any shops. The app also provides for interaction between sellers and buyers, so that a buyer can ask a seller for more information regarding a product. 

## Technologies
The application was developed using the MongoDB, Express, React, NodeJS (MERN) stack. React Bootstrap was used as the CSS framework and Socket.io was used for the real-time chat function. 

- MongoDB
- Express
- React
- Node
- React Bootstrap
- Socket.io

## Table of Contents
* [Structure of Web Application](#structure-of-web-application)
* [Mongoose Schemas](#mongoose-schemas)
* [Interesting Aspects of the Project](#interesting-aspects-of-the-project)
* [Structure of Web Application](#structure-of-web-application)


## Structure of Web Application


The application comprises the following key components:

- Home: This is the landing page for all users. It shows the categories of products, and list of products from all sellers. The products are not all loaded at once; we used Infinite Scrolling to control the number of products that should be loaded each time. 

- Navigation Bar: Apart from the links to the different pages, the navbar also has a search bar, which allows users to search for products using the keywords used.

- User, Shops and Products: These components each comprises several sub-components to create, read, update and delete (CRUD) users, shops and products, respectively. 

- Chat: This component deals with the chat function. If both the sender and receiver of a message are online, their messages will immediately appear on their screen at real time with the help of Socket.io. These messages will also be stored in a MongoDB database. If the receiver of the messages comes online, all the messages that he received during the period he was offline will be shown. 

- Cart and Payment: These components handle all the products that the buyers put in their carts and payment. 


## Mongoose Schemas

The structures of the following MongoDB models/collections are defined in the files stored under the /models directory. 

- userSchema: Id, Username, Email, Password, Usertype (buyer or seller)

- shopSchema: Id, Shop Name, Address, Postal Code, Contact Numbers, UserId (ref)

- productSchema: Id, Name, Price, Description, Category, Quantity, Rating and Rating Count, as well as Shop name (ref), 

- orderSchema: Id, UserId, Products

- conversationSchema (to store all the conversation partners): Id, Array[senderId, receiverId]

- messageSchema (to store all the chat messages): Id, ConversationId, SenderId and Text


## Interesting Aspects of the Project


### Infinite Scrolling (used on homepage)

Using [react-infinite-scroll-component](https://www.npmjs.com/package/react-infinite-scroll-component), infinite scrolling was used to render products on the homepage. As many e-commerce sites have large databases of products, it was essential to render the product list in an efficient manner and yet keep the user experience simple.

Pagination is set in the backend, limiting 24 products per page and hence the homepage will render more products after the user has scrolled through 24 products. The infinite scrolling effect is implemented with the <InfiniteScroll> component provided by [react-infinite-scroll-component](https://www.npmjs.com/package/react-infinite-scroll-component), with properties including a function to fetch data for each page.

### Paypal

Payment methods and transactions on any e-commerce site is an important feature for user experience and security. 

PayPal Developer’s Sandbox test accounts allow us to mimic live transactions for orders placed on the site. PayPal members may use credits on their account for pay, or simply use PayPal’s credit card payment system. A business & personal test accounts are all you need to run a live transaction during development stage.

Implementation is fairly straightforward using [react-paypal-button-v2](https://www.npmjs.com/package/react-paypal-button-v2). CSS elements for the payment button (PayPal logo and color scheme) on our order summary page and URL link to PayPal’s transaction page are provided for in the wrapper component. 

### Messenger page

The Messenger (chat) page comprises: (a) the Conversation component, which handles (create, read, delete) the Receiver and Sender of messages, and the Message component, which handles (create and read) all the Messages (ConversationId, text of message and senderId). 


The Chat page requires the following States:

- message: to store all the messages coming in from MongoDB and the socket server.

- newMessage: to store all the messages keyed in the textbox field

- arrivalMessage: to store messages coming in through the socket server
  
- productMessage: to store a product message (when the chat is initiated from a product page)

- onlineUsers: to store all the ID of online users, the information for which is sent from the socket server.
  

useEffect hooks are used to read messages in MongoDB, socket server, product page or the textbox field. 







