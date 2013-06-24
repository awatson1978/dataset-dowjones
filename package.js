Package.describe({
  summary: "Meteorite package that provides a simple history of the Dow Jones Industrial Average over 5 years."
});

Package.on_use(function (api) {
    api.add_files('initialize.dowjones.js', ["client","server"]);
});
