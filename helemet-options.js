module.exports = {
    contentSecurityPolicy:{
        directives: {
          defaultSrc: ["'self'", "http:", "https:", "data:", "blob:"],
          scriptSrc: ["'self'", "https://code.jquery.com/jquery-2.2.1.min.js", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        }
    },

    frameguard: {
        action: "sameorigin"
    },

    referrerPolicy: {
        policy: ["same-origin", "no-referrer-when-downgrade"],
    },

    dnsPrefetchControl: {
        allow: false,
    },


}