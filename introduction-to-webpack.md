## Learning Objectives

* Understand why Webpack is useful.
* Learn how to setup Webpack.

{% vimeo_video "154502934" %}

## Why Do We Need Webpack?

Let's assume we have a working app in our project folder with two files:

```html
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <button type="button" id="add_button">Add Item</button>
  <ul id="list">
  </ul>
  <script src="main.js"></script>
</body>
</html>
```

```javascript
// main.js

function appendListItem() {
  var newItem = document.createElement("li");
  var text = document.createTextNode("I am a list item");
  newItem.appendChild(text);

  var list = document.getElementById("list");
  list.insertBefore(newItem, list.childNodes[0]);
}

var button = document.getElementById("add_button");
button.addEventListener("click", appendListItem);
```

If we run `open index.html`, our browser will show an interactive web application
that can add list items to the page.

What if we would like to break up our code into modules? For example, what if we obtained the text of a list item from a node module.

We could add a new file called `content.js` with the following content:

```javascript
// content.js
module.exports = "I am a list item";
```

and modify `main.js` to:

```javascript
// main.js
var textContent = require('./content');

function appendListItem() {
  var newItem = document.createElement("li");
  var text = document.createTextNode(textContent);
  newItem.appendChild(text);

  var list = document.getElementById("list");
  list.insertBefore(newItem, list.childNodes[0]);
};

var button = document.getElementById("add_button");
button.addEventListener("click", appendListItem);
```

When we reload our file in the browser, our app is now broken.

If we take a look at the JavaScript console, we will see an error `Uncaught ReferenceError: require is not defined`. This is happening because the browser does not support CommonJS modules.

## Webpack to the Rescue!

[Webpack][webpack-root] is a tool which allows us to use CommonJS modules when
developing our application. Webpack looks at the files in our codebase and
resolves all of the `module.exports` and `require` statements, and spits out one
JavaScript file that can executed by the browser. Because Webpack performs this
important feature, is often referred to as a **module bundler**.

Webpack can also transform code from one format to another. For example, Webpack
can load ES6 JavaScript code and convert it to ES5 JavaScript. This makes Webpack
not only a module bundler, but a build system as well.

Webpack has
[additional features](http://webpack.github.io/docs/what-is-webpack.html)
that set it apart from other module bundlers, but we will be focusing on Webpack as a module bundler and build system in this lesson.

## Setting Up Webpack

Install Webpack with the following command:

```sh
$ npm install -g webpack
```

To bundle our code into one file we can run the following command:

```sh
$ webpack main.js bundle.js
```

Where the first argument is the main JavaScript file in our application, and the second argument is the name of the output file which will contain all of our bundled code.
This file is referred to as the **bundle file**.
After running the command, you should see `bundle.js` in the root of your project folder.
If you take a peek into the `bundle.js` file you will see that it does indeed contain the code from both `main.js` and `content.js`.
Now if you change the `script` tag in the `index.html` from:

```html
<script src="main.js"></script>
```

to

```html
<script src="bundle.js"></script>
```

and reload the page.

Your application will start to work again!

## Setting up a `webpack.config.js` file

Before we go on, let us restructure our project into the following:

```no-highlight
.
├── build
│   └── bundle.js
│   └── index.html
└── src
    └── content.js
    └── main.js
```

**NOTE**: Do not name your project folder `webpack`! Otherwise, NPM will think
your project is the `webpack` NPM package itself, and NPM will run into trouble
when trying to install the `webpack` NPM package as a dependency.

This is a widely used project structure where the `build` folder contains the files that are actually served to the client, and the `src` folder contains the raw code that makes up the bundle file.
If we made changes to our files and then wanted to bundle our modules again, in the project root we would run:

```sh
$ webpack ./src/main.js ./build/bundle.js
$ open build/index.html
```

Running the `webpack` command will replace the existing `bundle.js` file with a new one which contains the changes.
However, it is tedious to have to give those two arguments to the `webpack` command over and over again.
Let's create a `webpack.config.js` file so we can simply run `webpack`.

Create the following `webpack.config.js` file in your project's root folder:

```javascript
// webpack.config.js
module.exports = {
  entry: {
    path: './src/main.js'
  },
  output: {
    path: __dirname+'/build',
    filename: 'bundle.js'
  }
};
```

* `entry.path` is the relative path to the file which starts our application.
* `output.path` is the absolute path to the folder where our build file will be placed.
* `output.filename` is the name of our build file.

Now if we make a change to our files, we can simply bundle our modules by running:

```sh
$ webpack
```

and refreshing the page in our browser.

## Setting Up The Webpack Dev Server

It would be great if we did not have to run the `webpack` command every time we
made changes to the codebase.
Luckily, the Webpack Dev Server will automatically bundle our modules anytime we make changes to a file and save it.

Run the following command to install the Webpack Dev Server:

```sh
$ npm install -g webpack-dev-server
```

**Note:** If you have trouble with this step and get an `UNMET PEER DEPENDENCY`
error, try installing both webpack and webpack-dev-server simultaneously.

```sh
$ npm install -g webpack webpack-dev-server
```

[Source](https://github.com/webpack/webpack-dev-server/issues/541#issuecomment-245557038)

Let's also add some additional configuration to the `webpack.config.js` file.

```javascript
...
  output: {
    path: __dirname+'/build',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './build'
  }
};
```

* `devServer.contentBase` specifies the location of the folder containing the files which the Webpack Web Server will serve.

To start the server run:

```sh
$ webpack-dev-server
```

Then go to <http://localhost:8080/> to see your application.
If you want to make changes, simply make the change, save the file, and reload the page.

An interesting feature of the Webpack Dev Server is that it serves the bundle file from memory and does not write it to disk.
To demonstrate this, delete your `bundle.js` file.
Then restart your server by running "Control + C" and `webpack-dev-server`.
You will notice that the `bundle.js` file is not regenerated, but your application still functions.
Also, making changes to your application does not regenerate the file either.
If you are curious, you can take a look at the `bundle.js` file served from memory by visiting <http://localhost:8080/bundle.js>.

## Setting Up Automatic Refresh

Is having to refresh the page becoming tiresome? Fear not! We can make the Webpack Dev Server do that for us as well!

Update your `webpack.config.js` file as follows

```javascript
devServer: {
  contentBase: './build',
  inline: true
};
```

* `devServer.inline` runs inline mode for the Webpack Dev Server. This mode enables automatic refreshing.

Make sure you restart your server by running "Control + C" and then `webpack-dev-server`.
Whenever you make a change in your application and save the file, the browser will refresh by itself and will have the updated code.

## Adding Source Maps

If we make an error in our files and look at the JavaScript console, we will see the errors that point to code in the `bundle.js` file.
This is not ideal since this code is the result of Webpack bundling and transpiling our code, and looks much different than the code we wrote.

We can solve this problem by adding the following to our `webpack.config.js` file:

```javascript
...
  devtool: 'eval-source-map',
  devServer: {
    contentBase: './build',
    inline: true
  }
...
```

* `devtool` adds Source Maps to our build file. The `eval-source-map` option specifies to create Source Maps for the original unmodified source code.

If we make a mistake now, the errors in the console will point to a file that looks like the one we wrote.

## Using A Loader

Let's add some CSS to this application.

We could add a stylesheet tag to the `index.html` and add a stylesheet to the `build` folder.
But what if we wanted to use Sass instead of pure CSS?
We would need a way to convert our Sass file into CSS.
Since Webpack is a build system, we can actually use it to transform a Sass file into a CSS file.
Not only will Webpack do this, but it will also add the CSS to our bundle file.
Thus, if we make a CSS change and save the file, the browser will refresh itself and use the new CSS.
To allow Webpack to make this transformation it will need to use a loader.

Modify your `webpack.config.js` file as follows:

```javascript
  ...
  module: {
    rules: {
      test: /\.scss$/,
      use: [
        "style-loader",
        "css-loader",
        "sass-loader"
      ]
    },
  },
  devtool: 'eval-source-map',
  ...
```

* `module.rules.use` takes in an array of loader objects that will be used by Webpack.
* In a loader object, `test` is a regular expression that will be used to match files to which the loader will be applied. In this example, this loader will only be applied to files whose name ends with `.scss`.
* In a loader object, `loaders` can be an array containing multiple loaders that compose the loader.
* It is not shown here, but it is also possible for a loader to replace `loaders` with `loader` which takes in a string if the loader is only composed of one loader.

This `scss` loader will take in a Sass file and run it through its loaders.
The order of the loaders goes from the last element to the first element in its `loaders` array.
The `sass-loader` will take in a Sass file and convert it to CSS.
The `css-loader` will take in a CSS file and converts it to a JavaScript module which Webpack can work with.
The `style-loader` will take the JavaScript module which contains CSS and add it to a `style` tag in the `head` of the `index.html`.
These loaders are not natively built into Webpack so we need to install them as NPM packages.

Let's create a `package.json` file and install these packages.

```sh
$ npm init
$ npm install --save-dev style-loader css-loader sass-loader node-sass webpack webpack-dev-server
```

`node-sass` is also installed because it is a dependency of `sass-loader`.
Now let's create a `app.scss` file with the following content:

```scss
/* src/app.scss */
$color: green;
li {
  color: $color;
}
```

Finally, we need to require the file in our entry file, `main.js`:

```javascript
// src/main.js
require('./app.scss');
...
```

If we restart our Webpack Dev Server, we should see that our list items are now green!
Also, if we change the color of the list item and save the file, the page is refreshed and added list items are now the new color.

## Setting Up Hot Module Replacement

Let's say we wanted to change the bottom margin for our `li` elements.
To see the effect take place, we need to have two `li` elements on the page.
The problem is every time we make a style change, the whole page is reloaded and all the `li` elements are deleted.
Thus, the **state** of the application is lost upon reloading the page.
To solve this problem, we will utilize Webpack's [Hot Module Replacement](https://webpack.github.io/docs/hot-module-replacement.html) feature.
This allows us to update modules with new changes without a page reload.
To setup hot module replacement, modify your `package.json` file as follows:

```javascript
// package.json

  ...
  "scripts": {
    "start": "webpack-dev-server --host 0.0.0.0 --hot",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  ...
};
```

Now, when you do `npm start` to run webpack-dev-server, it will also set the "hot" flag. `devServer.hot` enables Hot Module Replacement in our Webpack Dev Server.

If we restart our server, we can now make style changes without losing the state of our application!
There is a bug, however, if we attempt to change the text of our `li` elements.
An `li` element with the new text is appended, however, _another_ `li` element is also appended with the old text.
This is because running our javascript has the side-effect of adding an event listener to the `button` element.
Before updating our module, we want to remove this side-effect by adding the following code to the end of our entry file, `main.js`:

```javascript
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(function() {
    button.removeEventListener("click", appendListItem);
  });
}
```

This code removes the event listener from the `button` element before running the new code from the updated module.
You should only concern yourself with learning the [`module.hot` API](https://webpack.github.io/docs/hot-module-replacement.html#api) if you are going to be using Hot Module Replacement with plain JavaScript.
If you go on to use a JavaScript front-end framework like ReactJS, there are plugins that will deal with Hot Module Replacement for you, so you won't have to write code using the `module.hot` API.

## Summary

Webpack is a module bundler that can generate a single static asset from a JavaScript application which utilizes modules.
Webpack is also a build system that can transform code.
For example, Webpack can be used to convert ES6 JavaScript code to ES5 JavaScript code.
Lastly, Webpack supports Hot Module Replacement, which decreases development time and maintains the state of a running application even as changes are introduced.


## Additional Resources
* [Webpack Documentation][webpack-docs]
* [Pete Hunt's Webpack How To][pete-hunt-webpack]
* [Understanding Hot Module Replacement][understanding-hot-module-replacement]

[webpack-root]: https://webpack.github.io/
[webpack-docs]: http://webpack.github.io/docs/
[pete-hunt-webpack]: https://github.com/petehunt/webpack-howto
[understanding-hot-module-replacement]: http://andrewhfarmer.com/understanding-hmr/

## Images Of Final Files

Here are the final files for this video.
Images have been provided rather than text to encourage the reader to type the set up by hand at least once.

#### `index.html`

![index_html](https://s3.amazonaws.com/horizon-production/images/introduction_to_webpack_index_html.png)

#### `main.js`

![main_js](https://s3.amazonaws.com/horizon-production/images/introduction_to_webpack_main_js.png)

#### `content.js`

![content_js](https://s3.amazonaws.com/horizon-production/images/introduction_to_webpack_content_js.png)

#### `app.scss`

![app_scss](https://s3.amazonaws.com/horizon-production/images/introduction_to_webpack_app_scss.png)

#### `webpack.config.js`

![webpack_config_js](https://s3.amazonaws.com/horizon-production/images/introduction_to_webpack_webpack_config_js.png)

#### `package.json`
![package_json](https://s3.amazonaws.com/horizon-production/images/introduction_to_webpack_package_json.png)
