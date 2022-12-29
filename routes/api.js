'use strict';
const threadController = require('../controllers/thread-controller');
const replyController = require('../controllers/reply-controller');

module.exports = function (app) {
  
  // THREADS ROUTERS
  app.route('/api/threads/:board').post(threadController.create);
  
  app.route('/api/threads/:board').get(threadController.view);
  
  app.route('/api/threads/:board').put(threadController.update);

  app.route('/api/threads/:board').delete(threadController.destroy);

  // REPLIES ROUTERS
  app.route('/api/replies/:board').post(replyController.create);

  app.route('/api/replies/:board').get(replyController.view);

  app.route('/api/replies/:board').put(replyController.update);

  app.route('/api/replies/:board').delete(replyController.destroy);

};
