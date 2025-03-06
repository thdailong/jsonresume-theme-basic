var fs = require("fs");
var path = require("path");
var Handlebars = require("handlebars");

function render(resume) {
  var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
  var tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");
  var partialsDir = path.join(__dirname, "partials");
  var filenames = fs.readdirSync(partialsDir);

  filenames.forEach(function (filename) {
    var matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
      return;
    }
    var name = matches[1];
    var filepath = path.join(partialsDir, filename);
    var template = fs.readFileSync(filepath, "utf8");

    Handlebars.registerPartial(name, template);
  });
  return Handlebars.compile(tpl)({
    css: css,
    resume: resume,
  });
}

Handlebars.registerHelper("print_array", function (array) {
  return array.join(", ");
});

Handlebars.registerHelper("name_network", function () {
  const network = this.network.toLowerCase();
  if (network.includes("github")) {
    return "Github Profile";
  }
  if (network.toLowerCase().includes("twitter")) {
    return "Twitter Profile";
  }
  if (network.includes("linkedin")) {
    return "Linkedin Profile";
  }
  return this.url;
});

module.exports = {
  render: render,
  pdfRenderOptions: {
    format: "A4",
    mediaType: "print",
    pdfViewport: { width: 1920, height: 1280 },
    margin: {
      top: "0.4in",
      bottom: "0.4in",
      left: "0.4in",
      right: "0.4in",
    },
  },
};
