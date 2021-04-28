# Ecommerce Project API

An ExpressJS API for an ecommerce web application.

---
## Requirements

For development, you will only need Node.js and a node global package, npm, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v12.18.4

    $ npm --version
    6.14.6

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

## Install

    $ git clone https://github.com/mohammad-23/ecommerce-api.git
    $ cd ecommerce-api
    $ npm install

## Configure app

Create `.env` file and add the following environment vairables:

- MONGODB_URI=mongodb+srv://mohammad:A5tKKw0NjrjSMJpp@cluster0.mrx75.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
- COMMERCE_API_KEY=pk_26067f758a4b63b1c1e280d7f61e1da69ea0b9dc15aea
- PORT=5000
- GOOGLE_CLIENT_ID=453703974762-5ddtl273absip5r3rq01io3jlupqmssl.apps.googleusercontent.com
- GOOGLE_CLIENT_SECRET=8SWH5bYJkQzngUoC7RjIqn0c

## Running the project

    $ npm start

## Simple build for production

    $ npm run build
