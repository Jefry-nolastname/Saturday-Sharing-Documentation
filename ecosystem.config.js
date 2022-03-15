module.exports = {
  apps : [{
    name: 'Saturday Sharing',
    script: 'bin/www',
    time: true,
	exec_mode: 'cluster',
    instances: '1',
    env: {
      "PORT": 14015,
	  "NODE_ENV": "development",
    },
    env_production : {
       "PORT": 14015,
	   "NODE_ENV": "production"
    }
  }]
};

