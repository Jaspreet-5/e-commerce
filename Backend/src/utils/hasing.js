const bcrypt = require('bcrypt');

exports.hashing = async (item) => {
    return await bcrypt.hash(item , 12)
}

exports.compareHasing = async (item , encryptedItem) => {
    return await bcrypt.compare(item , encryptedItem)
}