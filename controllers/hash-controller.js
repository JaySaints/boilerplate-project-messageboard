const crypto = require('crypto');

async function generate_hash(context, salt=process.env.KEY_SALT) {
    const hash = crypto.pbkdf2Sync(
        context.toString(), // Data to transform hash
        salt.toString(), // Define salt
        100000, // Interations
        32, // Length of hash
        'sha512' // Digest: type of algorithm
    );

    return hash.toString('hex');
}

async function validate_hash(context, hash, salt=process.env.KEY_SALT) {
    contextHash = await generate_hash(context, salt);    
    const validation =  contextHash == hash.toString();
    return validation
}

module.exports = {
    generate_hash,
    validate_hash,
}
