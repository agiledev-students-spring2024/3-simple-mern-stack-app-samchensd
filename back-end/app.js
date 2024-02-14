require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

app.get('/about-us', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  //  "About Us" content
  const aboutUsContent = {
    title: "About Us",
    content: `Hey there! I'm Sam Chen, a tech enthusiast and a problem-solver at heart, currently navigating the exciting world of Computer Science and Business Administration at New York University, aiming to graduate in January 2025. My academic journey is fueled by a curiosity for everything at the intersection of technology and business, with a GPA of 3.7 to show for my efforts. When I'm not buried in coursework related to AI, machine learning, or data analysis, I'm probably brainstorming the next big idea or figuring out how technology can make our lives just a bit easier.

My internship experiences have been a roller coaster of learning and hands-on involvement, from leading a team at Microsoft to develop a QR Code generator for a design app to enhancing the user experience for eSports enthusiasts at Mobalytics. Each role taught me the importance of listening, whether it's to a teammate's idea or a user's feedback, and the power of a well-laid plan, from product development to go-to-market strategies.

But here's the thing—I'm not all work and no play. Outside the hustle of tech and business, you'll find me on the basketball court leading my team as captain or planning my next backpacking adventure in places as rugged and awe-inspiring as Death Valley. These experiences ground me, teaching me lessons in leadership, teamwork, and perseverance that I bring back to my professional life.

In the tech world, I'm passionate about making things that matter and resonate with people. Whether it's through coding, designing, or strategizing, the goal is to leave things a little better than I found them. And when the going gets tough, you might catch me creating music or sharing my latest finds on my YouTube channel, finding joy in the simple act of creation.

So, that's a little about me—a mix of tech geek, outdoor enthusiast, and aspiring creator, always looking to learn and grow. Let's see where this journey takes us!`,
    imageUrl: "https://media.licdn.com/dms/image/D4E03AQEdqwJM__mAMw/profile-displayphoto-shrink_400_400/0/1662511996165?e=1713398400&v=beta&t=eYF5WFzvenEBml2l4lNlHsaNlglcd_LmyLrv2KLEH0k"
  };
  res.json(aboutUsContent);
});


// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
