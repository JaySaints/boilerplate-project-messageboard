const mongoose = require('mongoose');

const ThreadSchmea = mongoose.Schema({
    board: {type: String},
    text: {type: String},
    delete_password: {type: String},
    reported: {type: Boolean, default: false},
    replies: [
        {
            text: {type: String},
            delete_password : {type: String},
            reported: {type: Boolean, default: false},     
            created_on: {type: Date, default: Date.now}    
            
        }
    ],
},{
    timestamps: {
      createdAt: 'created_on', // Use `created_on` to store the created date
      updatedAt: 'bumped_on' // and `updated_at` to store the last updated date
    }
});


const ThreadModel = mongoose.model('Thread', ThreadSchmea);

module.exports = ThreadModel;