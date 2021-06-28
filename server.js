const http = require("http");

const findContainerName = () => {
    return new Promise((resolve, reject) => {
        const os = require('os');
        const hostname = os.hostname();
        let options = {
            socketPath: '/var/run/docker.sock',
            path: `/containers/${hostname}/json`,
            method: 'GET'
          };
          let clientRequest = http.request(options, (res) => {
              res.setEncoding('utf8');
              let rawData = '';
              res.on('data', (chunk) => {
                  rawData += chunk; 
              });
              res.on('end', () => {
                const parsedData = JSON.parse(rawData);
                //console.log(parsedData);
                resolve(parsedData.Name)
              });
          });
          clientRequest.on('error', (e) => {
              console.log(e);
              reject(e);
          });
          clientRequest.end();
    })
}

http
  .createServer((req, res) => {
    findContainerName().then(name => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write(`Hello, I am ${name}`);
        res.end();        
    }).catch(err => {
        console.error(err);
    })  

  })
  .listen(8080, () => {
    console.log("server is listening on 8080");
  });
