const router = require('../config/middleware.js').router();
const api = require('./controller.js');

// router.get('/api/:id/stub', api.getStubs); //return stubs. this will be how the kb search service updates

router.route('/api')
  .get(api.getTicket)
  .post(api.createTicket);

router.route('/api/:id')
  .get(api.getTicket)
  .put(api.editTicket)
  .delete(api.deleteTicket);

router.get('/', api.pingDb)

module.exports = router;
