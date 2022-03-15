var hbs = require("hbs");

hbs.registerHelper("check_selected", function (value, options) {
	if (options.fn(this).indexOf(value) >= 1) {
		return `selected='selected'`;
	}
});

hbs.registerHelper("selected", function (option, value) {
	if (option === value) {
		console.log(true);
		return " selected";
	} else {
		console.log(false);
		return "";
	}
});

hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
	return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
