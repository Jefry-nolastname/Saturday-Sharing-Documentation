var express = require('express');
var router = express.Router();
var companyApi = require("../api/company");
var divisionApi = require("../api/division");
var materialApi = require("../api/material");


/* GET home page. */
router.get('/', async function(req, res, next) {
  var companaies = await companyApi.companyList();
  res.render('index',{
    hostAddress:process.env.backend_url,
    companies:companaies,
  });
});

//filter
router.post('/', async function(req, res, next) {
  var divisions = [];
  var materials = [];
  if(req.body.company){
    divisions = await divisionApi.divisionList(req.body.company);
  }
  if(req.body.division){
    materials = await materialApi.materialList(req.body.company,req.body.division);
  }
  const companies = await companyApi.companyList();
  // if(req.body.isCreate){
  //   var resp = await material.create(req.body);
  //   console.log(resp);
  // }
  res.render('index',{
    hostAddress:process.env.backend_url,
    material:materials,
    division:req.body.division,
    company:req.body.company,
    divisions:divisions,
    companies:companies,
  });
});

// details
router.get('/details',async function(req,res,next){
  const material = await materialApi.material(req.query.s);
  if(material){
    res.render('details',{
      hostAddress:process.env.backend_url,
      ...material
    });
  }
  else{
    res.send("404");
  }
});

//ajax router
router.post('/divisions',async function(req,res,next){
  var divisions;
  if(req.body.company){
    divisions = await divisionApi.divisionList(req.body.company);
  }
  res.json({
    divisions:divisions?divisions:[],
  });
});

router.post('/material',async function(req,res,next){
  var material;
  if(req.body.material){
    material = await await materialApi.material(req.body.material);
  }
  res.json(material);
});

module.exports = router;
