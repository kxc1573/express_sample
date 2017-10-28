'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var config = require('./config');
var log = require('./utils/log');
var schemas = require('./schemas');

/**
 * Represents mongodb collection
 */
class Collection {

    constructor(connection, name, schema) {

        this.connection = connection;
        this.schema = new Schema(schema);
        this.model = connection.model(`${name}Model`, this.schema, name);
        this.name = name;
    }

    insert(record) {
        return new Promise((resolve, reject) => {
            var instance = new this.model(record);
            instance.save((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(record);
                }
            });
        });
    }

    find(condition, constraints) {
        return new Promise((resolve, reject) => {
            this.model.find(condition, constraints? constraints : null, (err, records) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(records);
                }
            });
        });
    }

    findOne(condition, constraints) {
        return new Promise((resolve, reject) => {
            this.model.findOne(condition, constraints? constraints : null, (err, record) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(record);
                }
            });
        });
    }

    findAndModify(condition, update) {
        return new Promise((resolve, reject) => {
            this.model.findOneAndUpdate(condition, update, {new: true, upsert: true}, (err, record) => {
                if (err) {
                    log.warn(`Failed updating database, condition: ${JSON.stringify(condition)}, update: ${JSON.stringify(update)}, error: ${err}`);
                    reject(err);
                } else {
                    log.info(`Database updated for ${JSON.stringify(condition)} with ${JSON.stringify(update)}`);
                    resolve(record);
                }
            });
        });
    }

    remove(condition) {
        return new Promise((resolve, reject) => {
            this.model.remove(condition, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }
}

/**
 * Collection Match
 */
// class Match extends Collection {

//     constructor(connection, name, schema) {
//         super(connection, name, schema);
//     }
// }

/**
 * Collection Fencer
 */
// class Fencer extends Collection {

//     constructor(connection, name, schema) {
//         super(connection, name, schema);
//     }
// }

/**
 * Collection Enroll
 */
// class Enroll extends Collection {

//     constructor(connection, name, schema) {
//         super(connection, name, schema);
//     }
// }

/**
 * Given an db conf, this returns the mongodb URI and options
 * which can then be directly feeded to the mongoose.createConnection()
 */
function getDBConf(conf) {

    let URI = "mongodb://";
    let options = {
        user: conf.username,
        pass: conf.password
    };

    if (conf.replSet) {
        let first = true;
        for (let member of conf.replSet.members) {
            if (first) {
                URI += `${member.host}:${member.port}`;
                first = false;
            } else {
                URI += `,${member.host}:${member.port}`;
            }
        }
        URI += `/${conf.database}`;

        options.replset = {
            "rs_name": conf.replSet.name,
            "slaveOk": true,
        };

        // monitor module won't write to the db, make it read from secondary, if possible
        if (process.env.name === 'monitor') {
            options.replset["readPreference"] = "secondaryPreferred";
        }
    } else {
        URI += `${conf.host}:${conf.port}/${conf.database}`;
    }
    return {URI, options};
}

var dbConf = config.mongodb;

let db = getDBConf(dbConf);
log.info(`database URI : ${db.URI}, options: ${JSON.stringify(db.options)}`);
var dbConnection = mongoose.createConnection(db.URI, db.options);

dbConnection.on('error', (err) => {
    log.fatal('Failed connecting the database');
    process.exit();
});

var match = new Collection(dbConnection, 'match', schemas.MATCH);
var fencer = new Collection(dbConnection, 'fencer', schemas.FENCER);
var enroll = new Collection(dbConnection, 'enroll', schemas.ENROLL);

module.exports = {
    match: match,
    fencer: fencer,
    enroll: enroll,
};