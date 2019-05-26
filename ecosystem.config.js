module.exports = {
  apps: [{
    name: 'BlockChain Node 1',
    script: './dev/networkNode.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '3001 http://localhost:3001',
    watch: true,
    log_date_format: "YYYY- MM - DD HH: mm Z",
    merge_logs: true,
    combine_logs: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'BlockChain Node 2',
    script: './dev/networkNode.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '3002 http://localhost:3002',
    merge_logs: true,
    combine_logs: true,
    watch: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'BlockChain Node 3',
    script: './dev/networkNode.js',
    merge_logs: true,

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '3003 http://localhost:3003',
    watch: true,
    combine_logs: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'BlockChain Node 4',
    script: './dev/networkNode.js',
    merge_logs: true,
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '3004 http://localhost:3004',
    watch: true,
    combine_logs: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'BlockChain Node 5',
    script: './dev/networkNode.js',
    merge_logs: true,
    combine_logs: true,

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '3005 http://localhost:3005',
    watch: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy: {
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
