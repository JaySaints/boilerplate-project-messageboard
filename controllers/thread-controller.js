const ThreadModel = require('../models/thread-model');
const { generate_hash, validate_hash } = require('./hash-controller');


//############### CREATE ###############\\
async function create(req, res, next) {
    const { text, delete_password, board } = req.body;
    const urlBoard = req.originalUrl.split('/')[3];
    const setBoard = board ? board.toLowerCase() : (urlBoard).toLowerCase();
    const hashPassword = await generate_hash(delete_password);

    try {
        const newThread = new ThreadModel({
            board: setBoard,
            text,
            delete_password: hashPassword
        });

        await newThread.save();

    } catch (e) {
        console.error(e)
        res.status(503).send("Something is wrong!");
    }

    res.redirect(`/b/${setBoard}/`);
}

//############### UPDATE ###############\\
async function update(req, res, next) {
    const { thread_id } = req.body;

    const thread = await ThreadModel.findOne({ _id: thread_id });

    if (thread == null) {
        res.status(200).send("Thread not found!");
        return
    }

    try {
        await ThreadModel.updateOne({ "_id": thread_id }, { $set: { "reported": true } });
        res.status(200).send("reported")

    } catch (e) {
        console.error(e);
        res.send("Error in report thread");
    }
}

//############### VIEW ###############\\
async function view(req, res, next) {
    const setBoard = (req.originalUrl.split('/')[3]).toLowerCase()

    var threads = await ThreadModel.aggregate([
        {
            $match: { board: { $eq: setBoard } }
        }, {
            $sort: { "bumped_on": -1 }
        }, {
            $limit: 10
        }, {
            $project: {
                _id: 1,
                text: 1,
                replies: 1,
                created_on: 1,
                bumped_on: 1,
                replycount: { $size: "$replies" },
            }
        }, {
            $unset: [
                "replies.delete_password",
                "replies.reported"
            ]
        }
    ])

    threads.map(item => {
        item.replies = item.replies.sort((a, b) => { return b.created_on - a.created_on });
    });

    res.status(200).send(threads);
}

//############### DELETE ###############\\
async function destroy(req, res, next) {
    const { thread_id, delete_password } = req.body;

    // An ObjectId must be a string of 12 bytes or a string of 24 hex characters or an integer
    if (thread_id.length != 12 && thread_id.length != 24) {
        res.send("Incorrect id");
        return
    }

    const thread = await ThreadModel.findOne({ _id: thread_id });

    if (thread == null) {
        res.status(200).send("Thread not found!");
        return
    }

    const validatePassowrd = await validate_hash(delete_password, thread['delete_password']);

    if (validatePassowrd) {
        try {
            await ThreadModel.findByIdAndDelete(thread_id);
            res.status(200).send("success");
            return
        } catch (e) {
            console.error(e)
            res.send("Error to delete thread");
        }
    }

    res.status(200).send("incorrect password");
}

module.exports = {
    create,
    update,
    view,
    destroy
}