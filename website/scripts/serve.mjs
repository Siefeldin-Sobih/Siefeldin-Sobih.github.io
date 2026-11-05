import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(fileURLToPath(new URL('../dist',import.meta.url)));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.pdf':'application/pdf','.json':'application/json'};
const server = createServer(async (req,res) => {
  try {
    const url = new URL(req.url,'http://localhost');
    const filename = path.resolve(root,'.' + decodeURIComponent(url.pathname));
    if (filename !== root && !filename.startsWith(root + path.sep)) {res.writeHead(403);res.end();return;}
    let file = filename;
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!url.pathname.endsWith('/')) {res.writeHead(301,{Location:url.pathname+'/'+url.search});res.end();return;}
      file = path.join(file,'index.html');
    }
    res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream'});
    res.end(await readFile(file));
  } catch {
    res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
    res.end(await readFile(path.join(root,'404.html')));
  }
});
server.listen(Number(process.env.PORT || 4173),'127.0.0.1',()=>console.log('Local: http://127.0.0.1:' + server.address().port));

