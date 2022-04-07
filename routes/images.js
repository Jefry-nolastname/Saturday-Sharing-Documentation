var express = require('express');
const axios = require('axios').default;


var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get("/images", async function (req, res, next) {
	var filename = req.query.i;
  var mime = req.query.t;
  // ga bisa control karena proxy
  axios({
    method: 'get',
    url: 'http://127.0.0.1:14013'+filename,
    responseType: 'stream'
  })
    .then(function(response) {
      if(mime)res.header('Content-Disposition', `attachment; filename="${filename.replace('/uploads/','')}"`);
      res.writeHead(200, {
        "Content-Type": mime });
      response.data.pipe(res)
  });
});

module.exports = router;
