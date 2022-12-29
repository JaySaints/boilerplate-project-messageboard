const threadModel = require('../models/thread-model');
const { generate_hash, validate_hash } = require('./hash-controller');

async function create(req, res, next) {
    const { text, thread_id, delete_password} = req.body;
    const hashPassword = await generate_hash(delete_password);

    console.log({ text, thread_id, delete_password});
    const result = await threadModel.updateOne({_id: thread_id},{$push: {replies: {
        text,
        delete_password: hashPassword
    }}});
    res.json({result})
}

async function update(req, res, next) {
    
}

async function view(req, res, next) {
    
}

async function destroy(req, res, next) {
    const { thread_id, reply_id, delete_password } = req.body;

    // An ObjectId must be a string of 12 bytes or a string of 24 hex characters or an integer
    if (thread_id.length != 12 && thread_id.length != 24 || reply_id.length != 12 && reply_id.length != 24) {
        res.send("Incorrect id");
        return
    }  

    const thread = await threadModel.findOne({"_id": thread_id, "replies._id": reply_id}, {replies:1});

    if(thread == null) {
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
            await threadModel.updateOne(
                { // where
                    "_id": thread_id, 
                    "replies._id": reply_id
                },{ // set update
                    "$set": {
                        "replies.$.text": "[deleted]"
                    }
                }
            );
            
            res.status(200).send("success"); 

        } catch (e) {
            console.error(e)
            res.send("Anything is wrong!");
            return
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