//User input validation functions
module.exports = {
    checkValue:
    function(input) {
        if(!input) {
            return 'This field cannot be left blank!';
        }
        return true;
    },

    checkNumber:
    function(num) {
        if(isNaN(num)) {
            return 'This field must contain a valid number!';
        }
        return true;
    }
};