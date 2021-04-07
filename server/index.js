const path = require('path');
const express = require('express');
const React = require('react');
const http = require('http');
const { renderToString } = require('react-dom/server');
const { ChunkExtractor } = require('@loadable/server');

const { StaticRouter } = require('react-router-dom');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  const rimraf = require('rimraf');
  const distPath = path.resolve(__dirname, '../dist');
  const pubPath = path.resolve(__dirname, '../public');
  console.log('Cleaning Dist Directory');
  rimraf.sync(distPath);

  const webpack = require('webpack');
  const fs = require ('fs');
  const config = require('../webpack.config')({NODE_ENV: process.env.NODE_ENV});
  const compiler = webpack(config);
  const rePathSep = path.sep.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  const nodePathRegex = new RegExp(`dist${rePathSep}node`, 'g');

  let publicFiles = fs.readdirSync(pubPath);
  publicFiles = publicFiles.map(fileName => path.resolve(distPath, 'web', fileName));
  
  app.use(require('webpack-dev-middleware')(compiler, {
    serverSideRender: true,
    publicPath: '/',
    stats: {
      colors: true,
    },
    writeToDisk: (path) => {
      const isNodePath = !!path.match(nodePathRegex);
      const isLoadableStat = /loadable-stats/.test(path);
      const isPublicFiles = publicFiles.includes(path);
      const canWriteToDisk = isNodePath || isLoadableStat || isPublicFiles;
      return canWriteToDisk;
    },
  }));

  app.use(require('webpack-hot-middleware')(compiler, {
    log: false,
    path: `/__webpack_hmr`,
    name: 'web',
    heartbeat: 10 * 1000,
  }));
}

const nodeStats = path.resolve(__dirname, '../dist/node/loadable-stats.json');
const webStats = path.resolve(__dirname, '../dist/web/loadable-stats.json');

app.use(express.static(path.resolve(__dirname, '../dist/web')));

app.get('*', (req, res) => {
  const nodeExtractor = new ChunkExtractor({
    statsFile: nodeStats,
    publicPath: '/',
  });
  const { default: App } = nodeExtractor.requireEntrypoint();

  const webExtractor = new ChunkExtractor({
    statsFile: webStats,
    publicPath: '/',
  });

  const routerContext = {};
  const staticRouterProps = { baseName: '/', context: routerContext, location: req.url };
  const jsx = webExtractor.collectChunks(
    React.createElement(StaticRouter, staticRouterProps,
      React.createElement(App)
    )
  );

  if (routerContext.url) {
    res.redirect(301, routerContext.url);
    return;
  }

  const appHtml = renderToString(jsx);
  res.set('content-type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        ${webExtractor.getLinkTags()}
        ${webExtractor.getStyleTags()}
      </head>
      <body>
        <div id="root">${appHtml}</div>
        ${webExtractor.getScriptTags()}
      </body>
    </html>
  `);
});

const server = http.createServer(app);
server.listen(3000, () => {
  console.log('Env:', process.env.NODE_ENV);
  console.log('App is listening on port 3000!');
});