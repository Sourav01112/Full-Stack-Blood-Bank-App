

const handleResponse = (req, res, status, message, data, success) => {
    res.status(status).send({ status, message, data, success });
}




module.exports = { handleResponse }