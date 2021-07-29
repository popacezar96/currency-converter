# Currency Convertor app

## About
This web application was built using client-side code only. Its job was to allow the user to convert any amount of money expressed in the currency of a country to another one of choice while keeping the rate of each currency up to date by default with the help of an API. 

Additionally, there is an option to save each conversion to a table that generates automatically when the save button is pressed along with the time and date of that conversion. Each line of the table is stored in a database so the conversions will be remembered even after closing the browser and displayed again when that page is accessed. If the user wants to remove the saved conversions there is also a button that can do so.

To simplify the experience, it was also added a button that switches the chosen (from and to) currencies when pressed.

The technologies used for development were:

- HTML5, CSS3, JavaScript ES6
- Bootstrap 5
- Frankfurter API
- IndexedDB API

## Testing and responsiveness
The interface is responsive on different device sizes and the design was approached from the mobile first perspective which was achieved with the help of Chrome inspect options.

The testing and other post processing actions were taken trough the Grunt task runner:

1. For JavaScript:
 - uglify
 - jshint (for linting)

2. For CSS:
 - cssmin
 - autoprefixer
 - pixrem
