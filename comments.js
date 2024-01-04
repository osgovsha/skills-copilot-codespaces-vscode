// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Add middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add CORS
const cors = require('cors');
app.use(cors());

// Add database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/comments', { useNewUrlParser: true });

// Add schema
const CommentSchema = new mongoose.Schema({
    name: String,
    comment: String,
    date: Date
});

// Add model
const Comment = mongoose.model('Comment', CommentSchema);

// Add routes
const router = express.Router();
router.get('/', (req, res) => {
    res.json({ message: 'API Initialized!' });
});

// Get all comments
router.route('/comments').get((req, res) => {
    Comment.find((err, comments) => {
        if (err) {
            res.send(err);
        }
        res.json(comments);
    });
});

// Add a comment
router.route('/comments').post((req, res) => {
    const comment = new Comment();
    comment.name = req.body.name;
    comment.comment = req.body.comment;
    comment.date = new Date();
    comment.save((err) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Comment successfully added!' });
    });
});

// Delete all comments
router.route('/comments').delete((req, res) => {
    Comment.deleteMany((err) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'All comments successfully deleted!' });
    });
});

// Start server
app.use('/api', router);
app.listen(8080, () => {
    console.log('API running on port 8080');
});