# react-ssr-app

A bare bones react application scaffold, used to jumpstart the creation of a new react application. (another one?! - see why at the end)

Files in the folder `public` will be copied to the build directory to be served as static files, _except_ `**/index.html` - these interfere with the operation of SSR when served with `express.static`.

Currently the following features are available out-of-the-box:

- SSR
- SSR Hot Reloading? (seems to work)
- Fast Refresh
- Code Splitting (using `@loadable/component`)
- SVG imports
- SASS/CSS packing
  - Note: have _not_ implmented importing class names from css
- Typescript
- React Router

Basic Use:

Install dependencies with `yarn install` or `npm install` (or your favorite npm compatible package manager).

Run in dev mode with `yarn start` or `npm run start` - this enables fast refresh mode.

When ready to deploy run `yarn build` or `npm run build`, and you can then test your deploy by running `yarn start:prod` or `npm run start:prod`.

Note: webpack both in dev and prod modes utilizes the `dist` folder.  Upon dev startup, the dist folder is cleaned up prior to the dev build.  It is also cleaned just before building for production.

Why another scaffold/framework?

First this is not a framework - a framework can be rather opinionated and usually includes it's own way of dealing with things (NEXT.js, Gatsby, After.js). This is a scaffold. I took _how_ to setup the various pieces in an app to create a bare-bones app, by setting all this up.

And while I do like the _idea_ of having a library like one of the mentioned frameworks that could be updated without having to adjust code, it takes away from the real ability to customize according to pur React examples found on the web.

Lastly, the longer I looked at various frameworks the more I disliked being locked into the way they do things. Each frameworks adds something on top of React - not bad in and of itself, but now you're learning the framework on top of react (and locking yourself in). As you find examples for how to do something in react, you may also have to figure out how to do that with the framework - because it may not always work.