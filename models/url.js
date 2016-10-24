

class Url {
    constructor (options) {
        this._id = options._id;
        this.original = options.original;
        this.user = options.user;
    }

    create(collection) {
        let deferred = Promise.defer();
        // check if the user is valid.
        let record = { original: this.original, user: this.user };
        collection.insertOne(record, (insertErr) => {
            if (insertErr) {
                deferred.reject(insertErr);
            } else {
                deferred.resolve(new Url(record));
            }
        });
        return deferred.promise;
    }
        
    static findOne (collection, query) {
        let deferred = Promise.defer();
        collection.findOne(query, (findErr, document) => {
            if (findErr) {
                deferred.reject(findErr);
            } else {
                if (!document) {
                    var notFoundErr = new Error("Url not found.");
                    notFoundErr.status = 404;
                    deferred.reject(notFoundErr);
                } else {
                    deferred.resolve(new Url(document));
                }
            }
        });
        return deferred.promise;
    }

    static find (collection, query) {
        let deferred = Promise.defer();
        collection.find(query).toArray((findErr, documents) => {
            if (findErr) {
                deferred.reject(findErr);
            } else {
                deferred.resolve(documents.map((document => new Url(document))));
            }
        });
        return deferred.promise;
    }
}

module.exports = Url;