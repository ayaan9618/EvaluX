const USERTYPE = Object.freeze({
    ORG: "org",
    REVIEWER: "reviewer"
});

const STATUS = Object.freeze({
    UNVERIFIED: "UNVERIFIED",
    VERIFIED: "VERIFIED",
});

const PROJECT_STATUS = Object.freeze({
    PENDING: "pending",
    AUTHORIZED: "authorized",
    REJECTED: "rejected"
});

const TESTED_STATUS = Object.freeze({
    NULL: "NULL",
    TESTED: "TESTED",
});

module.exports = { USERTYPE, STATUS, TESTED_STATUS, PROJECT_STATUS };
