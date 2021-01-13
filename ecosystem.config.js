module.exports = {
  apps : [{
    name: 'arss-api',
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
      host: 'localhost',
      ref: 'origin/production',
      repo: 'git@github.com:freitas-miranda/arss-api.git'
    }
  }
};
