var hbs = require("hbs");

hbs.registerHelper("check_selected", function (value, options) {
	if (options.fn(this).indexOf(value) >= 1) {
		return `selected='selected'`;
	}
});

hbs.registerHelper("selected", function (option, value) {
	if (option == value) {
		return " selected";
	} else {
		return "";
	}
});

hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
	return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('eval', function(...e)
{      
  e.pop();
  const args = e.join('');
	   return eval(args)  ;
   }
);