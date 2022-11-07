angular.module('sportily.registration.templates', ['templates/sportily/registration/errors.html', 'templates/sportily/registration/field.html', 'templates/sportily/registration/form.contact.html', 'templates/sportily/registration/form.html', 'templates/sportily/registration/form.personal.html', 'templates/sportily/registration/form.roles.html', 'templates/sportily/registration/info.html']);

angular.module("templates/sportily/registration/errors.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/registration/errors.html",
    "<p class=\"help-block error\"\n" +
    "    ng-if=\"form[name].$touched || form.$submitted\"\n" +
    "    ng-repeat=\"(key, value) in form[name].$error\"\n" +
    "    ng-switch=\"key\">\n" +
    "\n" +
    "    <!-- client-side -->\n" +
    "    <span ng-switch-when=\"date\">Dates must be in the dd/mm/yyyy format</span>\n" +
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

angular.module("templates/sportily/registration/field.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/registration/field.html",
    "<div class=\"form-group\" ng-class=\"{ 'has-error': form[name].$invalid && (form[name].$touched || form.$submitted) }\">\n" +
    "    <label for=\"{{ name }}\" ng-if=\"label != 'none'\">{{ displayLabel }}&nbsp;</label>\n" +
    "    <ng-transclude></ng-transclude>\n" +
    "    <errors name=\"{{ name }}\"></errors>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/sportily/registration/form.contact.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/registration/form.contact.html",
    "<h3>Contact Details</h3>\n" +
    "\n" +
    "<!-- email address -->\n" +
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

angular.module("templates/sportily/registration/form.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/registration/form.html",
    "<form name=\"form\">\n" +
    "\n" +
    "    <div class=\"alert alert-danger\" ng-if=\"error\">{{ error }}</div>\n" +
    "    <div ng-if=\"!complete && !paid\" class=\"form-group\">\n" +
    "       <label for=\"season\">Season</label>\n" +
    "        <select class=\"form-control\"\n" +
    "            ng-options=\"season.id as season.name for season in seasons\"\n" +
    "            ng-model=\"state.selectedSeason\">\n" +
    "            <option value=\"\">Season&hellip;</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "    <div ng-if=\"!complete && !paid && state.selectedSeason\">\n" +
    "\n" +
    "    <field name=\"email\" label=\"Email address\">\n" +
    "        <input type=\"email\" class=\"form-control\"\n" +
    "            name=\"email\"\n" +
    "            ng-model=\"user.email\"\n" +
    "            required\n" +
    "            autocomplete=\"off\"\n" +
    "            ng-blur=\"findUser()\"\n" +
    "            server-error>\n" +
    "        <info>Email address will <em>never</em> be shown publicly.</info>\n" +
    "    </field>\n" +
    "  </div>\n" +
    "  <button ng-disabled=\"!user.email\" ng-if=\"!typeOptions\" class=\"btn btn-default\" ng-click=\"findUser()\" formnovalidate>Next</button>\n" +
    "\n" +
    "  <div ng-if=\"!complete && !paid && state.selectedSeason && typeOptions\">\n" +
    "        <div ng-include=\"'templates/sportily/registration/form.personal.html'\"></div>\n" +
    "        <div ng-include=\"'templates/sportily/registration/form.roles.html'\"></div>\n" +
    "        <div ng-include=\"'templates/sportily/registration/form.contact.html'\"></div>\n" +
    "\n" +
    "        <field name=\"League Marketing Opt In\">\n" +
    "            <input type=\"checkbox\"\n" +
    "                name=\"marketing_opt_in\"\n" +
    "                ng-model=\"person.marketing_opt_in\"\n" +
    "                ng-true-value=\"1\"\n" +
    "                ng-false-value=\"0\"\n" +
    "                server-error>\n" +
    "            <info>I would like to receive periodic and informative marketing or newsletter updates on the league.</info>\n" +
    "        </field>\n" +
    "\n" +
    "        <field name=\"agreement\" label=\"none\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"state.agreement\" required>\n" +
    "                {{ agreementMessage }}\n" +
    "            </label>\n" +
    "        </field>\n" +
    "        <button class=\"btn btn-primary\" ng-click=\"save()\" ng-disabled=\"form.$invalid || saving\">Register</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"complete && !paid\">\n" +
    "        <p>{{ confirmationMessage }}</p>\n" +
    "        <p ng-if=\"message\" class=\"alert alert-{{message.type}}\">{{message.message}}</p>\n" +
    "        <p ng-if=\"organisationId == 9\" class=\"alert alert-error alert-larger\">Your registration is not complete until you have paid. Your registration and subsequent membership profile will be automatically deleted if you haven't paid. Please select 'Continue' to go to the payment page.</p>\n" +
    "        <p ng-if=\"member.financial_summary.owed.total\"> Your member fees are: {{ member.financial_summary.owed.total | money }}</p>\n" +
    "        <p><payment-button email=\"user.email\" member=\"member\" message=\"message\" organisation-id=\"organisationId\" selected-region-id=\"state.selectedRegionId\"></payment-button></p>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"paid\">\n" +
    "        <p>Payment</p>\n" +
    "        <p class=\"alert alert-success\">Payment made successfully.</p>\n" +
    "        <p><a href=\"{{ adminUrl }}\">Login</a> to your account.\n" +
    "    </div>\n" +
    "</form>\n" +
    "");
}]);

angular.module("templates/sportily/registration/form.personal.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/registration/form.personal.html",
    "<!-- name -->\n" +
    "<field name=\"given_name\" label=\"Forename\" class=\"form-group\">\n" +
    "    <input type=\"text\" class=\"form-control\"\n" +
    "        name=\"given_name\"\n" +
    "        ng-model=\"person.given_name\"\n" +
    "        required\n" +
    "        server-error>\n" +
    "</field>\n" +
    "<field name=\"family_name\" label=\"Surname\" class=\"form-group\">\n" +
    "    <input type=\"text\" class=\"form-control\"\n" +
    "        name=\"family_name\"\n" +
    "        ng-model=\"person.family_name\"\n" +
    "        required\n" +
    "        server-error>\n" +
    "</field>\n" +
    "\n" +
    "\n" +
    "<!-- date of birth -->\n" +
    "<field name=\"date_of_birth\">\n" +
    "    <input type=\"text\" class=\"form-control\"\n" +
    "        name=\"date_of_birth\"\n" +
    "        ng-model=\"state.dateOfBirth\"\n" +
    "        placeholder=\"dd/mm/yyyy\"\n" +
    "        required\n" +
    "        server-error>\n" +
    "</field>\n" +
    "\n" +
    "<!-- gender -->\n" +
    "<field name=\"gender\">\n" +
    "    <select class=\"form-control\"\n" +
    "        name=\"gender\"\n" +
    "        ng-model=\"person.gender\"\n" +
    "        required\n" +
    "        server-error>\n" +
    "        <option value=\"\"></option>\n" +
    "        <option value=\"female\">Female</option>\n" +
    "        <option value=\"male\">Male</option>\n" +
    "    </select>\n" +
    "</field>\n" +
    "\n" +
    "<!-- medical conditions -->\n" +
    "<field name=\"medical_conditions\">\n" +
    "    <input type=\"text\" class=\"form-control\"\n" +
    "        name=\"medical_conditions\"\n" +
    "        ng-model=\"person.medical_conditions\"\n" +
    "        placeholder=\"e.g. Asthma\"\n" +
    "        server-error>\n" +
    "    <info>If member has no relevant medical conditions, please indicate 'None'.</info>\n" +
    "</field>\n" +
    "\n" +
    "<!-- dbs number -->\n" +
    "<field name=\"dbs number\" label=\"DBS registration number\">\n" +
    "    <input type=\"text\" class=\"form-control\"\n" +
    "        name=\"dbs_number\"\n" +
    "        ng-model=\"person.dbs_number\"\n" +
    "        server-error>\n" +
    "    <info>A valid DBS registration is required for all officials aged 16 year or older.</info>\n" +
    "</field>\n" +
    "<div ng-if=\"dbsSettings.value.org_id\">\n" +
    "	<field name=\"dbs_apply\" label=\"Apply for DBS registration.\">\n" +
    "		<input type=\"checkbox\" class=\"form-control\"\n" +
    "			name=\"dbs_apply\"\n" +
    "			ng-model=\"person.dbs_apply\"\n" +
    "			server-error>\n" +
    "		<info ng-if=\"dbsSettings.value.application_fee > 0\">An additional charge of £{{dbsSettings.value.application_fee / 100}} will apply.</info>\n" +
    "		<info>You will recieve an email from Disclosure Services to complete the application.</info>\n" +
    "	</field>\n" +
    "</div>\n" +
    "<!-- passport nationality -->\n" +
    "<field name=\"passport_nationality\" label=\"Passport Nationality\">\n" +
    "    <div class=\"form-inline\">\n" +
    "        <select name=\"passport_nationality\" ng-model=\"person.passport_nationality\" required server-error class=\"form-control\">\n" +
    "          <option value=\"GB\">United Kingdom</option>\n" +
    "          <option value=\"US\">United States</option>\n" +
    "          <option value=\"AF\">Afghanistan</option>\n" +
    "        	<option value=\"AX\">Åland Islands</option>\n" +
    "        	<option value=\"AL\">Albania</option>\n" +
    "        	<option value=\"DZ\">Algeria</option>\n" +
    "        	<option value=\"AS\">American Samoa</option>\n" +
    "        	<option value=\"AD\">Andorra</option>\n" +
    "        	<option value=\"AO\">Angola</option>\n" +
    "        	<option value=\"AI\">Anguilla</option>\n" +
    "        	<option value=\"AQ\">Antarctica</option>\n" +
    "        	<option value=\"AG\">Antigua and Barbuda</option>\n" +
    "        	<option value=\"AR\">Argentina</option>\n" +
    "        	<option value=\"AM\">Armenia</option>\n" +
    "        	<option value=\"AW\">Aruba</option>\n" +
    "        	<option value=\"AU\">Australia</option>\n" +
    "        	<option value=\"AT\">Austria</option>\n" +
    "        	<option value=\"AZ\">Azerbaijan</option>\n" +
    "        	<option value=\"BS\">Bahamas</option>\n" +
    "        	<option value=\"BH\">Bahrain</option>\n" +
    "        	<option value=\"BD\">Bangladesh</option>\n" +
    "        	<option value=\"BB\">Barbados</option>\n" +
    "        	<option value=\"BY\">Belarus</option>\n" +
    "        	<option value=\"BE\">Belgium</option>\n" +
    "        	<option value=\"BZ\">Belize</option>\n" +
    "        	<option value=\"BJ\">Benin</option>\n" +
    "        	<option value=\"BM\">Bermuda</option>\n" +
    "        	<option value=\"BT\">Bhutan</option>\n" +
    "        	<option value=\"BO\">Bolivia, Plurinational State of</option>\n" +
    "        	<option value=\"BQ\">Bonaire, Sint Eustatius and Saba</option>\n" +
    "        	<option value=\"BA\">Bosnia and Herzegovina</option>\n" +
    "        	<option value=\"BW\">Botswana</option>\n" +
    "        	<option value=\"BV\">Bouvet Island</option>\n" +
    "        	<option value=\"BR\">Brazil</option>\n" +
    "        	<option value=\"IO\">British Indian Ocean Territory</option>\n" +
    "        	<option value=\"BN\">Brunei Darussalam</option>\n" +
    "        	<option value=\"BG\">Bulgaria</option>\n" +
    "        	<option value=\"BF\">Burkina Faso</option>\n" +
    "        	<option value=\"BI\">Burundi</option>\n" +
    "        	<option value=\"KH\">Cambodia</option>\n" +
    "        	<option value=\"CM\">Cameroon</option>\n" +
    "        	<option value=\"CA\">Canada</option>\n" +
    "        	<option value=\"CV\">Cape Verde</option>\n" +
    "        	<option value=\"KY\">Cayman Islands</option>\n" +
    "        	<option value=\"CF\">Central African Republic</option>\n" +
    "        	<option value=\"TD\">Chad</option>\n" +
    "        	<option value=\"CL\">Chile</option>\n" +
    "        	<option value=\"CN\">China</option>\n" +
    "        	<option value=\"CX\">Christmas Island</option>\n" +
    "        	<option value=\"CC\">Cocos (Keeling) Islands</option>\n" +
    "        	<option value=\"CO\">Colombia</option>\n" +
    "        	<option value=\"KM\">Comoros</option>\n" +
    "        	<option value=\"CG\">Congo</option>\n" +
    "        	<option value=\"CD\">Congo, the Democratic Republic of the</option>\n" +
    "        	<option value=\"CK\">Cook Islands</option>\n" +
    "        	<option value=\"CR\">Costa Rica</option>\n" +
    "        	<option value=\"CI\">Côte d'Ivoire</option>\n" +
    "        	<option value=\"HR\">Croatia</option>\n" +
    "        	<option value=\"CU\">Cuba</option>\n" +
    "        	<option value=\"CW\">Curaçao</option>\n" +
    "        	<option value=\"CY\">Cyprus</option>\n" +
    "        	<option value=\"CZ\">Czech Republic</option>\n" +
    "        	<option value=\"DK\">Denmark</option>\n" +
    "        	<option value=\"DJ\">Djibouti</option>\n" +
    "        	<option value=\"DM\">Dominica</option>\n" +
    "        	<option value=\"DO\">Dominican Republic</option>\n" +
    "        	<option value=\"EC\">Ecuador</option>\n" +
    "        	<option value=\"EG\">Egypt</option>\n" +
    "        	<option value=\"SV\">El Salvador</option>\n" +
    "        	<option value=\"GQ\">Equatorial Guinea</option>\n" +
    "        	<option value=\"ER\">Eritrea</option>\n" +
    "        	<option value=\"EE\">Estonia</option>\n" +
    "        	<option value=\"ET\">Ethiopia</option>\n" +
    "        	<option value=\"FK\">Falkland Islands (Malvinas)</option>\n" +
    "        	<option value=\"FO\">Faroe Islands</option>\n" +
    "        	<option value=\"FJ\">Fiji</option>\n" +
    "        	<option value=\"FI\">Finland</option>\n" +
    "        	<option value=\"FR\">France</option>\n" +
    "        	<option value=\"GF\">French Guiana</option>\n" +
    "        	<option value=\"PF\">French Polynesia</option>\n" +
    "        	<option value=\"TF\">French Southern Territories</option>\n" +
    "        	<option value=\"GA\">Gabon</option>\n" +
    "        	<option value=\"GM\">Gambia</option>\n" +
    "        	<option value=\"GE\">Georgia</option>\n" +
    "        	<option value=\"DE\">Germany</option>\n" +
    "        	<option value=\"GH\">Ghana</option>\n" +
    "        	<option value=\"GI\">Gibraltar</option>\n" +
    "        	<option value=\"GR\">Greece</option>\n" +
    "        	<option value=\"GL\">Greenland</option>\n" +
    "        	<option value=\"GD\">Grenada</option>\n" +
    "        	<option value=\"GP\">Guadeloupe</option>\n" +
    "        	<option value=\"GU\">Guam</option>\n" +
    "        	<option value=\"GT\">Guatemala</option>\n" +
    "        	<option value=\"GG\">Guernsey</option>\n" +
    "        	<option value=\"GN\">Guinea</option>\n" +
    "        	<option value=\"GW\">Guinea-Bissau</option>\n" +
    "        	<option value=\"GY\">Guyana</option>\n" +
    "        	<option value=\"HT\">Haiti</option>\n" +
    "        	<option value=\"HM\">Heard Island and McDonald Islands</option>\n" +
    "        	<option value=\"VA\">Holy See (Vatican City State)</option>\n" +
    "        	<option value=\"HN\">Honduras</option>\n" +
    "        	<option value=\"HK\">Hong Kong</option>\n" +
    "        	<option value=\"HU\">Hungary</option>\n" +
    "        	<option value=\"IS\">Iceland</option>\n" +
    "        	<option value=\"IN\">India</option>\n" +
    "        	<option value=\"ID\">Indonesia</option>\n" +
    "        	<option value=\"IR\">Iran, Islamic Republic of</option>\n" +
    "        	<option value=\"IQ\">Iraq</option>\n" +
    "        	<option value=\"IE\">Ireland</option>\n" +
    "        	<option value=\"IM\">Isle of Man</option>\n" +
    "        	<option value=\"IL\">Israel</option>\n" +
    "        	<option value=\"IT\">Italy</option>\n" +
    "        	<option value=\"JM\">Jamaica</option>\n" +
    "        	<option value=\"JP\">Japan</option>\n" +
    "        	<option value=\"JE\">Jersey</option>\n" +
    "        	<option value=\"JO\">Jordan</option>\n" +
    "        	<option value=\"KZ\">Kazakhstan</option>\n" +
    "        	<option value=\"KE\">Kenya</option>\n" +
    "        	<option value=\"KI\">Kiribati</option>\n" +
    "        	<option value=\"KP\">Korea, Democratic People's Republic of</option>\n" +
    "        	<option value=\"KR\">Korea, Republic of</option>\n" +
    "        	<option value=\"KW\">Kuwait</option>\n" +
    "        	<option value=\"KG\">Kyrgyzstan</option>\n" +
    "        	<option value=\"LA\">Lao People's Democratic Republic</option>\n" +
    "        	<option value=\"LV\">Latvia</option>\n" +
    "        	<option value=\"LB\">Lebanon</option>\n" +
    "        	<option value=\"LS\">Lesotho</option>\n" +
    "        	<option value=\"LR\">Liberia</option>\n" +
    "        	<option value=\"LY\">Libya</option>\n" +
    "        	<option value=\"LI\">Liechtenstein</option>\n" +
    "        	<option value=\"LT\">Lithuania</option>\n" +
    "        	<option value=\"LU\">Luxembourg</option>\n" +
    "        	<option value=\"MO\">Macao</option>\n" +
    "        	<option value=\"MK\">Macedonia, the former Yugoslav Republic of</option>\n" +
    "        	<option value=\"MG\">Madagascar</option>\n" +
    "        	<option value=\"MW\">Malawi</option>\n" +
    "        	<option value=\"MY\">Malaysia</option>\n" +
    "        	<option value=\"MV\">Maldives</option>\n" +
    "        	<option value=\"ML\">Mali</option>\n" +
    "        	<option value=\"MT\">Malta</option>\n" +
    "        	<option value=\"MH\">Marshall Islands</option>\n" +
    "        	<option value=\"MQ\">Martinique</option>\n" +
    "        	<option value=\"MR\">Mauritania</option>\n" +
    "        	<option value=\"MU\">Mauritius</option>\n" +
    "        	<option value=\"YT\">Mayotte</option>\n" +
    "        	<option value=\"MX\">Mexico</option>\n" +
    "        	<option value=\"FM\">Micronesia, Federated States of</option>\n" +
    "        	<option value=\"MD\">Moldova, Republic of</option>\n" +
    "        	<option value=\"MC\">Monaco</option>\n" +
    "        	<option value=\"MN\">Mongolia</option>\n" +
    "        	<option value=\"ME\">Montenegro</option>\n" +
    "        	<option value=\"MS\">Montserrat</option>\n" +
    "        	<option value=\"MA\">Morocco</option>\n" +
    "        	<option value=\"MZ\">Mozambique</option>\n" +
    "        	<option value=\"MM\">Myanmar</option>\n" +
    "        	<option value=\"NA\">Namibia</option>\n" +
    "        	<option value=\"NR\">Nauru</option>\n" +
    "        	<option value=\"NP\">Nepal</option>\n" +
    "        	<option value=\"NL\">Netherlands</option>\n" +
    "        	<option value=\"NC\">New Caledonia</option>\n" +
    "        	<option value=\"NZ\">New Zealand</option>\n" +
    "        	<option value=\"NI\">Nicaragua</option>\n" +
    "        	<option value=\"NE\">Niger</option>\n" +
    "        	<option value=\"NG\">Nigeria</option>\n" +
    "        	<option value=\"NU\">Niue</option>\n" +
    "        	<option value=\"NF\">Norfolk Island</option>\n" +
    "        	<option value=\"MP\">Northern Mariana Islands</option>\n" +
    "        	<option value=\"NO\">Norway</option>\n" +
    "        	<option value=\"OM\">Oman</option>\n" +
    "        	<option value=\"PK\">Pakistan</option>\n" +
    "        	<option value=\"PW\">Palau</option>\n" +
    "        	<option value=\"PS\">Palestinian Territory, Occupied</option>\n" +
    "        	<option value=\"PA\">Panama</option>\n" +
    "        	<option value=\"PG\">Papua New Guinea</option>\n" +
    "        	<option value=\"PY\">Paraguay</option>\n" +
    "        	<option value=\"PE\">Peru</option>\n" +
    "        	<option value=\"PH\">Philippines</option>\n" +
    "        	<option value=\"PN\">Pitcairn</option>\n" +
    "        	<option value=\"PL\">Poland</option>\n" +
    "        	<option value=\"PT\">Portugal</option>\n" +
    "        	<option value=\"PR\">Puerto Rico</option>\n" +
    "        	<option value=\"QA\">Qatar</option>\n" +
    "        	<option value=\"RE\">Réunion</option>\n" +
    "        	<option value=\"RO\">Romania</option>\n" +
    "        	<option value=\"RU\">Russian Federation</option>\n" +
    "        	<option value=\"RW\">Rwanda</option>\n" +
    "        	<option value=\"BL\">Saint Barthélemy</option>\n" +
    "        	<option value=\"SH\">Saint Helena, Ascension and Tristan da Cunha</option>\n" +
    "        	<option value=\"KN\">Saint Kitts and Nevis</option>\n" +
    "        	<option value=\"LC\">Saint Lucia</option>\n" +
    "        	<option value=\"MF\">Saint Martin (French part)</option>\n" +
    "        	<option value=\"PM\">Saint Pierre and Miquelon</option>\n" +
    "        	<option value=\"VC\">Saint Vincent and the Grenadines</option>\n" +
    "        	<option value=\"WS\">Samoa</option>\n" +
    "        	<option value=\"SM\">San Marino</option>\n" +
    "        	<option value=\"ST\">Sao Tome and Principe</option>\n" +
    "        	<option value=\"SA\">Saudi Arabia</option>\n" +
    "        	<option value=\"SN\">Senegal</option>\n" +
    "        	<option value=\"RS\">Serbia</option>\n" +
    "        	<option value=\"SC\">Seychelles</option>\n" +
    "        	<option value=\"SL\">Sierra Leone</option>\n" +
    "        	<option value=\"SG\">Singapore</option>\n" +
    "        	<option value=\"SX\">Sint Maarten (Dutch part)</option>\n" +
    "        	<option value=\"SK\">Slovakia</option>\n" +
    "        	<option value=\"SI\">Slovenia</option>\n" +
    "        	<option value=\"SB\">Solomon Islands</option>\n" +
    "        	<option value=\"SO\">Somalia</option>\n" +
    "        	<option value=\"ZA\">South Africa</option>\n" +
    "        	<option value=\"GS\">South Georgia and the South Sandwich Islands</option>\n" +
    "        	<option value=\"SS\">South Sudan</option>\n" +
    "        	<option value=\"ES\">Spain</option>\n" +
    "        	<option value=\"LK\">Sri Lanka</option>\n" +
    "        	<option value=\"SD\">Sudan</option>\n" +
    "        	<option value=\"SR\">Suriname</option>\n" +
    "        	<option value=\"SJ\">Svalbard and Jan Mayen</option>\n" +
    "        	<option value=\"SZ\">Swaziland</option>\n" +
    "        	<option value=\"SE\">Sweden</option>\n" +
    "        	<option value=\"CH\">Switzerland</option>\n" +
    "        	<option value=\"SY\">Syrian Arab Republic</option>\n" +
    "        	<option value=\"TW\">Taiwan, Province of China</option>\n" +
    "        	<option value=\"TJ\">Tajikistan</option>\n" +
    "        	<option value=\"TZ\">Tanzania, United Republic of</option>\n" +
    "        	<option value=\"TH\">Thailand</option>\n" +
    "        	<option value=\"TL\">Timor-Leste</option>\n" +
    "        	<option value=\"TG\">Togo</option>\n" +
    "        	<option value=\"TK\">Tokelau</option>\n" +
    "        	<option value=\"TO\">Tonga</option>\n" +
    "        	<option value=\"TT\">Trinidad and Tobago</option>\n" +
    "        	<option value=\"TN\">Tunisia</option>\n" +
    "        	<option value=\"TR\">Turkey</option>\n" +
    "        	<option value=\"TM\">Turkmenistan</option>\n" +
    "        	<option value=\"TC\">Turks and Caicos Islands</option>\n" +
    "        	<option value=\"TV\">Tuvalu</option>\n" +
    "        	<option value=\"UG\">Uganda</option>\n" +
    "        	<option value=\"UA\">Ukraine</option>\n" +
    "        	<option value=\"AE\">United Arab Emirates</option>\n" +
    "        	<option value=\"UM\">United States Minor Outlying Islands</option>\n" +
    "        	<option value=\"UY\">Uruguay</option>\n" +
    "        	<option value=\"UZ\">Uzbekistan</option>\n" +
    "        	<option value=\"VU\">Vanuatu</option>\n" +
    "        	<option value=\"VE\">Venezuela, Bolivarian Republic of</option>\n" +
    "        	<option value=\"VN\">Viet Nam</option>\n" +
    "        	<option value=\"VG\">Virgin Islands, British</option>\n" +
    "        	<option value=\"VI\">Virgin Islands, U.S.</option>\n" +
    "        	<option value=\"WF\">Wallis and Futuna</option>\n" +
    "        	<option value=\"EH\">Western Sahara</option>\n" +
    "        	<option value=\"YE\">Yemen</option>\n" +
    "        	<option value=\"ZM\">Zambia</option>\n" +
    "        	<option value=\"ZW\">Zimbabwe</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "</field>\n" +
    "\n" +
    "<field ng-repeat=\"field in customRegistrationFields\" name=\"dbs number\" label=\"{{:: field.question}}\">\n" +
    "	<div ng-if=\"field.type == 'dropdown'\" class=\"form-inline\">\n" +
    "        <select ng-model=\"findCustomField(field).answer\" class=\"form-control\">\n" +
    "            <option ng-repeat=\"option in field.options_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "    <input ng-if=\"field.type == 'text'\" type=\"text\" class=\"form-control\" ng-model=\"findCustomField(field).answer\">\n" +
    "\n" +
    "    <div ng-if=\"field.type == 'date'\" class=\"form-inline\">\n" +
    "		<input type=\"text\" class=\"form-control\"\n" +
    "        	ng-model=\"findCustomField(field).answer\"\n" +
    "        	placeholder=\"dd/mm/yyyy\"\n" +
    "        	/>\n" +
    "  \n" +
    "    </div>\n" +
    "</field>\n" +
    "");
}]);

angular.module("templates/sportily/registration/form.roles.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/registration/form.roles.html",
    "<h3>League Roles</h3>\n" +
    "\n" +
    "<div class=\"form-inline form-group\" ng-repeat=\"role in roles\">\n" +
    "\n" +
    "    <label>Role #{{ $index + 1 }}:</label>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-if=\"$index == 0\">\n" +
    "        <select class=\"form-control\"\n" +
    "            ng-options=\"r.id as r.name for r in regions\"\n" +
    "            ng-model=\"state.selectedRegionId\">\n" +
    "            <option value=\"\">Region&hellip;</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\" ng-show=\"state.selectedRegionId\">\n" +
    "        <select class=\"form-control\"\n" +
    "            ng-options=\"a.id as a.name for a in ageGroups\"\n" +
    "            ng-model=\"role.selectedAgeGroupId\"\n" +
    "            ng-change=\"getTeams(role)\">\n" +
    "            <option value=\"\">Age Group&hellip;</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-show=\"state.selectedRegionId\">\n" +
    "        <select class=\"form-control\"\n" +
    "            ng-options=\"type.system_role as type.organisation_role for type in typeOptions[state.selectedRegionId].data\"\n" +
    "            ng-model=\"role.type\">\n" +
    "            <option value=\"\">Role&hellip;</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-show=\"state.selectedRegionId && requiresTeam(role.type)\">\n" +
    "        <span>for</span>\n" +
    "        <select class=\"form-control\"\n" +
    "            ng-options=\"team.id as team.name for team in role.teams\"\n" +
    "            ng-model=\"role.team_id\" ng-required=\"types[role.type].requiresTeam\">\n" +
    "            <option value=\"\">Team&hellip;</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "\n" +
    "    <a ng-click=\"removeRole(role)\" ng-if=\"roles.length > 1\">Remove</a>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <a ng-click=\"addRole()\">Add more roles&hellip;</a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/sportily/registration/info.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/registration/info.html",
    "<p class=\"help-block\" ng-hide=\"form[name].$invalid && (form[name].$touched || form.$submitted)\" ng-transclude></p>\n" +
    "");
}]);
