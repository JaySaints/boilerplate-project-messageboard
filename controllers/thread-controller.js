const ThreadModel = require('../models/thread-model');
const { generate_hash, validate_hash } = require('./hash-controller');
//############### CREATE ###############\\
async function create(req, res, next) {
    const {text, delete_password, board} = req.body

    hashPassword = await generate_hash(delete_password);
    console.log({text, delete_password, hashPassword, board})

    try {
        const newThread = new ThreadModel({
            board,
            text,
            delete_password: hashPassword
        });

        const result = await newThread.save()

        res.status(200).json({success: true, result});

    } catch (error) {
        console.error(e)
        res.status(503).json({succes: false, error});
    }
}

//############### UPDATE ###############\\
async function update(req, res, next) {
    const { thread_id } = req.body;

    const thread  = await ThreadModel.findOne({_id: thread_id});
    
    if (thread == null) {
        res.status(200).send("Thread not found!");
        return
    }

    try {
        await ThreadModel.updateOne({"_id": thread_id}, {$set: {"reported": true}});
        res.status(200).send("reported")    

    } catch (e) {
        console.error(e);
        res.send("Error in delete thread");
    }
}

//############### VIEW ###############\\
async function view(req, res, next) {
    
}

//############### DELETE ###############\\
async function destroy(req, res, next) {
    const { thread_id, delete_password } = req.body;
    
    // An ObjectId must be a string of 12 bytes or a string of 24 hex characters or an integer
    if (thread_id.length != 12 && thread_id.length != 24) {
        res.send("Incorrect id");
        return
    }    

    const thread = await ThreadModel.findOne({_id: thread_id});

    if (thread == null) {
        res.status(200).send("Thread not found!");
        return
    }

    const validatePassowrd = await validate_hash(delete_password, thread['delete_password']);

    if (validatePassowrd) {
        try {
            await ThreadModel.findByIdAndDelete(thread_id);
            res.status(200).send("success");    
        } catch (e) {
            console.error(e)
            res.send("Error to delete thread");
        }
        return
    }
    
    res.status(200).send("incorrect password");    
}

module.exports = {
    create,
    update,
    view,
    destroy
}