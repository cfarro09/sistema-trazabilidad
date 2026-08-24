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

  const script = `
export PATH="/root/.nvm/versions/node/v22.21.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

echo "Using node: $(which node) ($(node -v))"
echo "Using npm: $(which npm)"
echo "Using pm2: $(which pm2)"

mkdir -p /var/www/html
cd /var/www/html

if [ ! -d "sistema-trazabilidad" ]; then
  git clone https://github.com/cfarro09/sistema-trazabilidad.git sistema-trazabilidad
  cd sistema-trazabilidad
else
  cd sistema-trazabilidad
  git fetch origin
  git reset --hard origin/main
fi

echo 'DATABASE_URL="postgresql://postgres:Loxer73147683@144.126.152.165:5924/trazabilidad_estado?schema=public"' > .env
echo 'PORT=3355' >> .env

echo "=== Installing dependencies ==="
npm install

echo "=== Running Prisma generate & db push ==="
npx prisma generate
npx prisma db push

echo "=== Seeding database ==="
npm run db:seed

echo "=== Building Next.js application ==="
npm run build

echo "=== Deploying with PM2 on port 3355 ==="
# Check if pm2 process exists (without removing other projects)
if pm2 describe sistema-trazabilidad > /dev/null 2>&1; then
  echo "Restarting existing sistema-trazabilidad process..."
  pm2 restart sistema-trazabilidad
else
  echo "Starting new sistema-trazabilidad process..."
  pm2 start npm --name "sistema-trazabilidad" -- start -- -p 3355
fi

pm2 save

echo "=== Current PM2 List ==="
pm2 list

echo "=== Testing endpoint on port 3355 ==="
sleep 3
curl -I http://localhost:3355 || true
`;

  conn.exec(script, (err, stream) => {
    if (err) {
      console.error('Exec error:', err);
      conn.end();
      return;
    }

    stream
      .on('close', (code, signal) => {
        console.log(`\nRemote deployment completed with exit code: ${code}`);
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
