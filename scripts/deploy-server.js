const { Client } = require('ssh2');

const conn = new Client();

const config = {
  host: '144.126.152.165',
  port: 22,
  username: 'root',
  password: 'Loxer73147683',
};

console.log('Connecting to remote server', config.host, '...');

conn.on('ready', () => {
  console.log('SSH Connection established successfully!');

  const commands = [
    'mkdir -p /var/www/html',
    'if [ ! -d "/var/www/html/sistema-trazabilidad" ]; then git clone https://github.com/cfarro09/sistema-trazabilidad.git /var/www/html/sistema-trazabilidad; else cd /var/www/html/sistema-trazabilidad && git pull origin main; fi',
    'cd /var/www/html/sistema-trazabilidad && echo \'DATABASE_URL="postgresql://postgres:Loxer73147683@144.126.152.165:5924/trazabilidad_estado?schema=public"\\nPORT=3355\' > .env',
    'cd /var/www/html/sistema-trazabilidad && npm install',
    'cd /var/www/html/sistema-trazabilidad && npx prisma generate',
    'cd /var/www/html/sistema-trazabilidad && npx prisma db push',
    'cd /var/www/html/sistema-trazabilidad && npm run db:seed',
    'cd /var/www/html/sistema-trazabilidad && npm run build',
    'cd /var/www/html/sistema-trazabilidad && if pm2 list | grep -q "sistema-trazabilidad"; then pm2 restart sistema-trazabilidad; else pm2 start npm --name "sistema-trazabilidad" -- start -- -p 3355; fi',
    'pm2 save',
    'pm2 list',
    'curl -I http://localhost:3355 || true',
  ].join(' && ');

  console.log('Running remote deployment commands...');

  conn.exec(commands, (err, stream) => {
    if (err) {
      console.error('Exec error:', err);
      conn.end();
      return;
    }

    stream
      .on('close', (code, signal) => {
        console.log(`\nRemote deployment finished with exit code ${code}`);
        conn.end();
      })
      .on('data', (data) => {
        process.stdout.write(data.toString());
      })
      .stderr.on('data', (data) => {
        process.stderr.write(data.toString());
      });
  });
}).on('error', (err) => {
  console.error('SSH Connection error:', err);
}).connect(config);
