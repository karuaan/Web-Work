// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
   production: true,
   firebase: {
    apiKey: "AIzaSyDj3uGXUayslSgPJnwmpqHjwQ_c0ZCqBv4",
    authDomain: "safety-book-reader.firebaseapp.com",
    databaseURL: "https://safety-book-reader.firebaseio.com",
    projectId: "safety-book-reader",
    storageBucket: "safety-book-reader.appspot.com",
    messagingSenderId: "219029116689"
  },
  restURL: "http://localhost:3000"
};