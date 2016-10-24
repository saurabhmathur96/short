const bcrypt = require("bcrypt");

var hashPassword = function (password, saltWorkFactor = 10) {
    let deferred = Promise.defer();

    bcrypt.genSalt(saltWorkFactor, (saltErr, salt) => {
        if (saltErr) {
            deferred.reject(saltErr);
        } else {
            bcrypt.hash(password, salt, (hashErr, hashed) => {
                if (hashErr) {
                    deferred.reject(hashErr);
                } else {
                    deferred.resolve(hashed);
                }
            });
        }
    });
    return deferred.promise;
} 

class User {
    constructor(options) {
        this._id = options._id || null;
        this.username = options.username;
        this.password = options.password;
    }

    comparePassword(password) {
        let deferred = Promise.defer();
        bcrypt.compare(password, this.password, (err, isEqual) => {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(isEqual);
            }
        });
        return deferred.promise;
    }

    create(collection) {
        let deferred = Promise.defer();
        hashPassword(this.password).then((hashed) => {
            collection.createIndex({ username: 1 }, { unique: true }, (indexErr) => {
                if (indexErr) {
                    deferred.reject(indexErr);
                } else {
                    let record = { username: this.username, password: hashed };
                    collection.insertOne(record, (insertErr) => {
                        if (insertErr) {
                            deferred.reject(insertErr);
                        } else {
                            deferred.resolve(new User(record));
                        }
                    });
                }
            }); 
        }).catch((hashErr) => {
            deferred.reject(hashErr);
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
                    var notFoundErr = new Error("User not found.");
                    notFoundErr.status = 404;
                    deferred.reject(notFoundErr);
                } else {
                    deferred.resolve(new User(document));
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
                deferred.resolve(documents.map((document => new User(document))));
            }
        });
        return deferred.promise;
    }
}

module.exports = User;