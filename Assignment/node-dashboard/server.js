const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    // Common CSS
    const style = `
        <style>
            body {
                margin: 0;
                font-family: Arial, sans-serif;
                background: linear-gradient(to right, #4facfe, #00f2fe);
                color: white;
                text-align: center;
            }
            .container {
                margin-top: 100px;
            }
            h1 {
                font-size: 40px;
            }
            p {
                font-size: 18px;
            }
            a {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background: white;
                color: #333;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
            a:hover {
                background: #ddd;
            }
        </style>
    `;

    // Dashboard Page
    if (path === "/" || path === "/dashboard") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(`
            <html>
            <head>
                <title>Dashboard</title>
                ${style}
            </head>
            <body>
                <div class="container">
                    <h1>Dashboard</h1>
                    <p>Welcome to your Node.js Dashboard</p>
                    <a href="/about">Go to About Us</a>
                </div>
            </body>
            </html>
        `);
    }

    // About Page
    else if (path === "/about") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(`
            <html>
            <head>
                <title>About Us</title>
                ${style}
            </head>
            <body>
                <div class="container">
                    <h1>About Us</h1>
                    <p>This is About Us page using Node core modules</p>
                    <a href="/">Back to Dashboard</a>
                </div>
            </body>
            </html>
        `);
    }

    // 404 Page
    else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.write(`
            <html>
            <head>
                <title>404</title>
                ${style}
            </head>
            <body>
                <div class="container">
                    <h1>404</h1>
                    <p>Page Not Found</p>
                    <a href="/">Go Home</a>
                </div>
            </body>
            </html>
        `);
    }

    res.end();
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});