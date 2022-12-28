module.exports = {
    contentSecurityPolicy:{
        directives: {
          defaultSrc: ["'self'", "https://cdn.freecodecamp.org/universal/favicons/favicon-32x32.png"],
          scriptSrc: ["'self'", "https://code.jquery.com/jquery-2.2.1.min.js"],
          styleSrc: ["'self'"]
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