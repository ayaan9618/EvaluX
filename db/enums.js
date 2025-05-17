const USERTYPE = Object.freeze({
    ORG: "org",
    REVIEWER: "reviewer"
});

const STATUS = Object.freeze({
    UNVERIFIED: "UNVERIFIED",
    VERIFIED: "VERIFIED",
});

const TESTED_STATUS = Object.freeze({
    NULL: "NULL",
    TESTED: "TESTED",
});

module.exports = { USERTYPE, STATUS, TESTED_STATUS };
