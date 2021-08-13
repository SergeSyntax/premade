const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

const posts = {};

const handleEvents = (type, data) => {
  switch (type) {
    case 'PostCreated': {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
      break;
    }

    case 'CommentCreated': {
      const { id, content, status, postId } = data;
      const post = posts[postId];
      post.comments.push({ id, content, status });
      break;
    }

    case 'CommentUpdated': {
      const { id, content, status, postId } = data;

      const post = posts[postId];
      const comment = post.comments.find((comment) => comment.id === id);

      comment.status = status;
      comment.content = content;

      break;
    }
  }
};

app.use(express.json());
app.use(cors());

app.get('/posts', async (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvents(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log('Listening on 4002');

  try {
    const { data } = await axios.get('http://event-bus-srv:4005/events');

    data.forEach(({ type, data }) => {
      console.log('Processing event', type);

      handleEvents(type, data);
    });
  } catch (error) {
    console.log(error);
  }
});
