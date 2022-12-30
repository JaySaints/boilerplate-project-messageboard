const ThreadModel = require('../models/thread-model');
const { generate_hash, validate_hash } = require('./hash-controller');

//############### CREATE ###############\\
async function create(req, res, next) {
    const { text, thread_id, delete_password } = req.body;
    const hashPassword = await generate_hash(delete_password);
    const setBoard = (req.originalUrl.split('/')[3]).toLowerCase();

    const result = await ThreadModel.updateOne(
        { _id: thread_id },
        {
            $push: {
                replies: {
                    text,
                    delete_password: hashPassword
                }
            }
        });

    if (result == null) {
        res.send("Something is wrong!");
        return
    }

    res.redirect(`/b/${setBoard}/${thread_id}/`);
}

//############### UPDATE ###############\\
async function update(req, res, next) {
    const { thread_id, reply_id } = req.body;
    const thread = await ThreadModel.findOne({
        "_id": thread_id,
        "replies._id": reply_id
    }, { replies: 1 });

    if (thread == null) {
        res.send("Thread or Reply not exist!");
        return
    }

    try {
        await ThreadModel.updateOne({ 
            "_id": thread_id, 
            "replies._id": reply_id 
        },{ 
            $set: { 
                "replies.$.reported": true 
            } 
        });        
        res.status(200).send("reported");
        return
    } catch (e) {
        res.send("Something is wrong!");
        console.error(e)
    }
}

//############### VIEW ###############\\
async function view(req, res, next) {
    const { thread_id } = req.query;

    try {
        const result = await ThreadModel.findById(
            thread_id,
            {
                "__v": 0,
                "reported": 0,
                "delete_password": 0,
                "replies.reported": 0,
                "replies.delete_password": 0
            }).sort({ bumped_on: -1 });

        res.status(200).send(result);
    } catch (e) {
        res.send("Something is wrong!");
        console.error(e);
    }

}

//############### DESTROY ###############\\
async function destroy(req, res, next) {
    const { thread_id, reply_id, delete_password } = req.body;

    // An ObjectId must be a string of 12 bytes or a string of 24 hex characters or an integer
    if (thread_id.length != 12 && thread_id.length != 24 || reply_id.length != 12 && reply_id.length != 24) {
        res.send("Incorrect id");
        return
    }

    const thread = await ThreadModel.findOne({
        "_id": thread_id,
        "replies._id": reply_id
    }, { replies: 1 });

    if (thread == null) {
        res.send("Thread or Reply not exist!");
        return
    }

    let delete_password_hash = null
    thread['replies'].map(item => {
        if (item._id == reply_id) {
            delete_password_hash = item.delete_password;
            return
        }
    });

    const validatePassowrd = await validate_hash(delete_password, delete_password_hash);

    if (validatePassowrd) {
        try {
            await ThreadModel.updateOne(
                {
                    "_id": thread_id,
                    "replies._id": reply_id
                }, {
                "$set": {
                    "replies.$.text": "[deleted]"
                }
            }
            );
            res.status(200).send("success");
            return

        } catch (e) {
            res.send("Something is wrong!");
            console.error(e)
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