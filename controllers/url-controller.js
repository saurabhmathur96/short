const path = require("path");
const Url = require(path.join(__dirname, "..", "models", "url"));
const ObjectId = require("mongodb").ObjectID;

class UrlController {
    static findOne(req, res, next) {
        let collection = req.db.collection("urls");
        let query = { _id: new ObjectId(req.params.id) };
        Url.findOne(collection, query).then((url) => {
            res.json({
                success: true,
                url: url
            });
        }).catch(next);
    }

    static create(req, res, next) {
        let collection = req.db.collection("urls");
        let url = new Url({ original: req.body.original, user: req.user.username });
        url.create(collection).then((savedUrl) => res.json({
            success: true,
            url: `/urls/${savedUrl._id}`
        })).catch(next);
    }
}

module.exports = UrlController;