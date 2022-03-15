const { Console } = require('console');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.post('/', function(req, res, next) {
  var arr=[];
  if(req.body.division){
    arr= [1,2,3,4,5,6,7,8,9];
  }
  res.render('index',{
    material:arr,
    division:req.body.division
  });
});


// details
router.get('/details',function(req,res,next){
  res.render('details',{
    title:"Kegunaan website jadi whatever!",
    date:"25 Dec 2021",
    name:"Cecili",
    division:"ICT"
  });
});

module.exports = router;
