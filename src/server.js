// Simple static file server for Tetris
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 80;
const STATIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(STATIC_DIR, filePath.split('?')[0]);

    // Security: prevent directory traversal
    if (!filePath.startsWith(STATIC_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }
        
        const ext = path.extname(filePath);
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const content = fs.readFileSync(filePath);
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.writeHead(404);
            res.end('Not Found');
        } else {
            console.error('Error:', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Tetris server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
});
