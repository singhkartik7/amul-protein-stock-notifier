const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 10,

    message: {

        message:
            "Too many login attempts. Please try again after 15 minutes."

    },

    standardHeaders: true,

    legacyHeaders: false

});

const signupLimiter = rateLimit({

    windowMs: 60 * 60 * 1000,

    max: 10,

    message: {

        message:
            "Too many signup attempts. Please try again after 1 hour."

    },

    standardHeaders: true,

    legacyHeaders: false

});

module.exports = {

    loginLimiter,

    signupLimiter

};