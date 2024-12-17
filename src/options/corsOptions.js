const whitelist = ['http://localhost:3000', 'http://localhost:3000/', 'http://127.0.0.1:3000', "http://localhost:5000", "http://localhost:5000/"];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (whitelist.includes(origin)) {
          callback(null, true);
        } else {
          console.error(`Blocked by CORS: ${origin}`);
          callback(new Error('Not allowed by CORS (corseOptions)'));
      }
      },
    credentials: true,
};

module.exports = corsOptions;