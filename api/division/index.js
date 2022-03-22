const axios = require('axios').default;

async function divisionList(company){
  const response = await axios.get(process.env.backend_url+'/api/divisions?filters[companies][id][$in]='+company).catch((e)=>{
    console.log(e.response.body);
  });
    return (response)?response.data.data:[];
}

module.exports = {divisionList};