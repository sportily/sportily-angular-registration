angular.module('sportily.registration.templates', ['templates/sportily/registration/errors.html', 'templates/sportily/registration/field.html', 'templates/sportily/registration/form.contact.html', 'templates/sportily/registration/form.html', 'templates/sportily/registration/form.personal.html', 'templates/sportily/registration/form.roles.html', 'templates/sportily/registration/info.html']);

angular.module("templates/sportily/registration/errors.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/errors.html",
    "<p class=\"help-block error\"\n" +
    "    ng-if=\"form[name].$touched\"\n" +
    "    ng-repeat=\"(key, value) in form[name].$error\"\n" +
    "    ng-switch=\"key\">\n" +
    "\n" +
    "    <!-- client-side -->\n" +
    "    <span ng-switch-when=\"email\">Invalid email address</span>\n" +
    "    <span ng-switch-when=\"required\">Required field</span>\n" +
    "\n" +
    "    <!-- server-side -->\n" +
    "    <span ng-switch-when=\"validation.email\">Invalid email address</span>\n" +
    "    <span ng-switch-when=\"validation.required\">Required field</span>\n" +
    "    <span ng-switch-when=\"validation.unique\">{{:: label }} is already taken</span>\n" +
    "\n" +
    "    <!-- default for any we missed -->\n" +
    "    <span ng-switch-default>{{:: key }}</span>\n" +
    "\n" +
    "</p>\n" +
    "");
}]);

angular.module("templates/sportily/registration/field.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/field.html",
    "<div class=\"form-group\" ng-class=\"{ 'has-error': form[name].$invalid && form[name].$touched }\">\n" +
    "    <label for=\"{{ name }}\">{{ displayLabel }}&nbsp;</label>\n" +
    "    <ng-transclude></ng-transclude>\n" +
    "    <errors name=\"{{ name }}\"></errors>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/sportily/registration/form.contact.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/form.contact.html",
    "<h3>Contact Details</h3>\n" +
    "\n" +
    "<!-- email address -->\n" +
    "<field name=\"email\" label=\"Email address\">\n" +
    "    <input type=\"email\" class=\"form-control\"\n" +
    "        name=\"email\"\n" +
    "        ng-model=\"user.email\"\n" +
    "        required\n" +
    "        autocomplete=\"off\"\n" +
    "        server-error>\n" +
    "    <info>Email address will <em>never</em> be shown publicly.</info>\n" +
    "</field>\n" +
    "\n" +
    "<field name=\"street_address\">\n" +
    "    <input type=\"text\" class=\"form-control\" name=\"street_address\" ng-model=\"person.street_address\">\n" +
    "</field>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <label for=\"city\">Town/city</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"city\" ng-model=\"person.city\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <label for=\"province\">County/region</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"province\" ng-model=\"person.province\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <label for=\"postcode\">Postcode</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"postcode\" ng-model=\"person.postcode\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <label for=\"phone_number\">Phone number</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"phone_number\" ng-model=\"person.phone_number\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <label for=\"mobile_number\">Mobile number</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"mobile_number\" ng-model=\"person.mobile_number\">\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/sportily/registration/form.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/form.html",
    "<form name=\"form\" novalidate>\n" +
    "\n" +
    "    <h1>2015-2016 Registration</h2>\n" +
    "\n" +
    "    <div class=\"alert alert-danger\" ng-if=\"error\">{{ error }}</div>\n" +
    "\n" +
    "    <div ng-if=\"!complete\">\n" +
    "        <div ng-include=\"'templates/sportily/registration/form.personal.html'\"></div>\n" +
    "        <div ng-include=\"'templates/sportily/registration/form.roles.html'\"></div>\n" +
    "        <div ng-include=\"'templates/sportily/registration/form.contact.html'\"></div>\n" +
    "        <button class=\"btn btn-primary\" ng-click=\"save()\">Register</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"complete\">\n" +
    "        <p>Thank you for registering to participate in the 2015-2015 season.\n" +
    "        We've just sent you a confirmation email containing instructions of how\n" +
    "        to verify your account to complete the registration process.</p>\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "");
}]);

angular.module("templates/sportily/registration/form.personal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/form.personal.html",
    "<h3>Personal Details</h3>\n" +
    "\n" +
    "<!-- name -->\n" +
    "<div class=\"form-group form-group-name\">\n" +
    "    <field name=\"given_name\" label=\"Name\" class=\"form-group\">\n" +
    "        <input type=\"text\" class=\"form-control\"\n" +
    "            name=\"given_name\"\n" +
    "            ng-model=\"person.given_name\"\n" +
    "            placeholder=\"Forename\"\n" +
    "            required\n" +
    "            autofocus\n" +
    "            server-error>\n" +
    "    </field>\n" +
    "    <field name=\"family_name\" label=\"\" class=\"form-group\">\n" +
    "        <input type=\"text\" class=\"form-control\"\n" +
    "            name=\"family_name\"\n" +
    "            ng-model=\"person.family_name\"\n" +
    "            placeholder=\"Surname\"\n" +
    "            required\n" +
    "            server-error>\n" +
    "    </field>\n" +
    "</div>\n" +
    "\n" +
    "<!-- date of birth -->\n" +
    "<field name=\"date_of_birth\">\n" +
    "    <input type=\"date\" class=\"form-control\"\n" +
    "        name=\"date_of_birth\"\n" +
    "        ng-model=\"state.dateOfBirth\"\n" +
    "        required\n" +
    "        server-error>\n" +
    "</field>\n" +
    "\n" +
    "<!-- medical conditions -->\n" +
    "<field name=\"medical_conditions\">\n" +
    "    <input type=\"text\" class=\"form-control\"\n" +
    "        name=\"medical_conditions\"\n" +
    "        ng-model=\"person.medical_conditions\"\n" +
    "        placeholder=\"e.g. Asthma\"\n" +
    "        required\n" +
    "        server-error>\n" +
    "    <info>If member has no relevant medical conditions, please indicate 'None'.</info>\n" +
    "</field>\n" +
    "");
}]);

angular.module("templates/sportily/registration/form.roles.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/form.roles.html",
    "<h3>League Roles</h3>\n" +
    "\n" +
    "<div class=\"form-inline form-group\" ng-repeat=\"role in roles\">\n" +
    "\n" +
    "    <label>Role #{{ $index + 1 }}:</label>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <select class=\"form-control\"\n" +
    "            ng-options=\"c.id as c.organisation.name for c in competitions\"\n" +
    "            ng-model=\"role.competition_id\">\n" +
    "            <option value=\"\">Region&hellip;</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-show=\"role.competition_id\">\n" +
    "        <select class=\"form-control\"\n" +
    "            ng-options=\"key as type.name for (key, type) in types\"\n" +
    "            ng-model=\"role.type\">\n" +
    "            <option value=\"\">Role&hellip;</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-show=\"role.competition_id && types[role.type].requiresTeam\">\n" +
    "        <span>for</span>\n" +
    "        <select class=\"form-control\"\n" +
    "            ng-options=\"team.id as team.name + ' (' + ageGroups.lookup[team.age_group_id].name + ')' for team in teams|forCompetition:role.competition_id\"\n" +
    "            ng-model=\"role.team_id\">\n" +
    "            <option value=\"\">Team&hellip;</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "\n" +
    "    <a ng-click=\"removeRole(role)\" ng-if=\"roles.length > 1\">Remove</a>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <button class=\"btn btn-default\" ng-click=\"addRole()\">Add more roles&hellip;</button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/sportily/registration/info.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/info.html",
    "<p class=\"help-block\" ng-hide=\"form[name].$invalid && form[name].$touched\" ng-transclude></p>\n" +
    "");
}]);
