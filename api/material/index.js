const axios = require('axios').default;

async function materialList(company,division){
  const response = await axios.get(process.env.backend_url+`/api/materials?sort[0]=id:asc&filters[company][id][$eq]=${company}&filters[division][id][$eq]=${division}&populate=participants,division,Images`).catch((e)=>{
    console.log(e.response.body);
  });
    return (response)?response.data.data:[];
}

async function material(id){
  const response = await axios.get(process.env.backend_url+`/api/materials/${id}?populate=*`).catch((e)=>{
    console.log(e.response.body);
  });
    return (response)?response.data.data.attributes:null;
}

module.exports = {materialList,material};