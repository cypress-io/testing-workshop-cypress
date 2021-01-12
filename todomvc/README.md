# Vue + Vuex + REST application

![Application organization](img/vue-vuex-rest.png)

## Script commands

- `npm install` to install dependencies (or `npm ci` for modern installs)
- `npm run reset:db` resets [data.json](data.json) to have empty list of todos

Once NPM dependencies are installed, the application should work locally without WiFi.

## Delay

You can delay the initial loading by adding to the URL `/?delay=<ms>`. This is useful to simulate application bootstrapping.
