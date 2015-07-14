angular.module('sportily.registration.templates', ['templates/sportily/registration/registration.html']);

angular.module("templates/sportily/registration/registration.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/registration.html",
    "<form>\n" +
    "\n" +
    "    <h1>Registration</h1>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"given_name\">Name</label>\n" +
    "        <div class=\"form-inline\">\n" +
    "            <input type=\"text\" class=\"form-control form-control-xs\" id=\"given_name\" ng-model=\"person.given_name\" placeholder=\"First Name\"/>\n" +
    "            <input type=\"text\" class=\"form-control form-control-sm\" id=\"family_name\" ng-model=\"person.family_name\" size=\"40\" placeholder=\"Surname\"/>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"email_address\">Email Address</label>\n" +
    "        <input type=\"text\" class=\"form-control\" id=\"email_address\" ng-model=\"user.email_address\"/>\n" +
    "        <p class=\"help-block\">Email address will <em>never</em> be shown publicly.</p>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"email_address_confirm\">Confirm Email Address</label>\n" +
    "        <input type=\"text\" class=\"form-control\" id=\"email_address_confirm\" ng-model=\"user.email_address_confirm\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"medical_conditions\">Medical Conditions</label>\n" +
    "        <input type=\"text\" class=\"form-control\" id=\"medical_conditions\" ng-model=\"person.medical_conditions\"/>\n" +
    "        <p class=\"help-block\">If none, please state “None”.</p>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"date_of_birth\">Date of Birth</label>\n" +
    "        <input type=\"text\" class=\"form-control form-control-xs\" id=\"date_of_birth\" ng-model=\"state.dateOfBirth\" placeholder=\"dd/mm/yyyy\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <h2>League Roles</h2>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"form-inline form-group form-role\" ng-repeat=\"role in roles\">\n" +
    "\n" +
    "            <label>Role #{{ $index + 1 }}:</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <select class=\"form-control\"\n" +
    "                    ng-options=\"o.id as o.name for o in organisations\"\n" +
    "                    ng-model=\"role.organisation_id\">\n" +
    "                    <option value=\"\">Region&hellip;</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-show=\"role.organisation_id\">\n" +
    "                <select class=\"form-control\"\n" +
    "                    ng-options=\"key as label for (key, label) in types\"\n" +
    "                    ng-model=\"role.type\">\n" +
    "                    <option value=\"\">Role&hellip;</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-show=\"role.organisation_id && ['player','manager'].indexOf(role.type) !== -1\">\n" +
    "                <span>for &nbsp;</span>\n" +
    "                <select class=\"form-control\"\n" +
    "                    ng-options=\"team.id as team.name + ' (' + ageGroups.lookup[team.age_group_id].name + ')' for team in teams|forOrganisation:role.organisation_id\"\n" +
    "                    ng-model=\"role.team_id\">\n" +
    "                    <option value=\"\">Team&hellip;</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "\n" +
    "            <a ng-click=\"removeRole(role)\"\n" +
    "                ng-if=\"roles.length > 1\">\n" +
    "                Remove\n" +
    "            </a>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <button class=\"btn btn-default\" ng-click=\"addRole()\">Add more roles&hellip;</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <h2>Contact Details</h2>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"street_address\">Street Address</label>\n" +
    "        <input type=\"text\" class=\"form-control\" id=\"street_address\" ng-model=\"person.street_address\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"city\">Town/City</label>\n" +
    "        <input type=\"text\" class=\"form-control form-control-sm\" id=\"city\" ng-model=\"person.city\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"province\">County</label>\n" +
    "        <input type=\"text\" class=\"form-control form-control-sm\" id=\"province\" ng-model=\"person.province\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"postcode\">Postcode</label>\n" +
    "        <input type=\"text\" class=\"form-control form-control-sm\" id=\"postcode\" ng-model=\"person.postcode\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"phone_number\">Phone Number</label>\n" +
    "        <input type=\"text\" class=\"form-control form-control-sm\" id=\"phone_number\" ng-model=\"person.phone_number\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"mobile_number\">Mobile Number</label>\n" +
    "        <input type=\"text\" class=\"form-control form-control-sm\" id=\"mobile_number\" ng-model=\"person.mobile_number\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"save()\">Register</button>\n" +
    "\n" +
    "</form>\n" +
    "");
}]);