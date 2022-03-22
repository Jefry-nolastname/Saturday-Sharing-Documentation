const axios = require('axios').default;

async function companyList(){
  const response = await axios.get(process.env.backend_url+'/api/companies').catch((e)=>{
    console.log(e.response.body);
  });
    return (response)?response.data.data:[];
}

module.exports = {companyList};