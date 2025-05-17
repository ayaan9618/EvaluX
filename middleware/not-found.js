const notFound = async (req, res, next) => {
    res.status(404).send("404 Error, this route does not exist!!!\nWhat are you doing here?");
}

module.exports = notFound;
