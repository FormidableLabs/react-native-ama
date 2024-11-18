The Example app is setup to run with the local library `lib` folder. This is done by adding the library as an alias in the `babel.config.js` file as well as updating the watch folders to the root dir and blacklisting duplicated packages in `metro.config.js`. The native modules used in `ListWrapper` are also registered by adding the root package to `react-native.config.js` This is done to allow for easy development of the library and the example app at the same time.

### Running the Example App

To run the example app, first, in the root of the project, run the following command to install packages which are needed for the library:

```sh
yarn install
```

Then in the `example` directory, run the following command to install the example app packages:

```sh
yarn install
```

Then run the following command to start the metro bundler:

```sh
yarn start
```

Then run the following command to start the app:

```sh
yarn android
```

or

```sh
yarn ios
```

On Android, you may need to run the following in the `example` directory:

```sh
yarn link:rn
```
