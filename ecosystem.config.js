module.exports = {
  apps : [{
    name: 'arss',
    script: 'dist/app.js',
    instances: 4,
    autorestart: true,
    watch: false,
    max_memory_restart: '600M',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:freitas-miranda/arss-api.git'
    }
  }
};
