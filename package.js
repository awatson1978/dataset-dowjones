Package.describe({
  summary: "Meteorite package that provides a simple history of the Dow Jones Industrial Average over 5 years.",

    // update this value before you run 'meteor publish'
    version: "1.0.0",

    // if this value isn't set, meteor will default to the directory name
    name: "awatson1978:dataset-dowjones",

    // and add this value if you want people to access your code from Atmosphere
    git: "http://github.com/awatson1978/dataset-dowjones.git"
});

Package.on_use(function (api) {
    api.use('standard-app-packages@1.0.4');
    api.add_files('initialize.dowjones.js', ["client","server"]);
});
