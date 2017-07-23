$(function() {
    var numbers = {};
    var value = 0.0;
    var defaultIncrement = 9.05;
    var maximumIncrement = defaultIncrement * 1.5;
    var mininumIncrement = defaultIncrement * 0.2;
    var increment = 0;
    var adjustInterval = 60000;

    function setup(data) {
        value = parseFloat(data);
        setIncrement(defaultIncrement);
        for (var i = 0; i<= 10; i++)
            numbers[i] = $('#n' + i);
    }

    function update() {
        value += increment;
        var digits = value.toFixed(2).replace(/\D/g, '');
        for (var i in numbers) {
            var digit = parseInt(digits[digits.length - 1 - i]);
            numbers[i].css({
                backgroundPosition: digit * (-35) + 'px 0'
            })
        }
    }

    function setIncrement(newValue) {
        increment = Math.max(mininumIncrement, newValue > 0
            ? Math.min(maximumIncrement, newValue)
            : Math.min(defaultIncrement, increment * 0.75));
        //console.log("increment: " + increment);
    }

    function adjust() {
        $.get('get-current-value.php').then(function(data, status) {
            if (status != 'success' || data <= 0) {
                setIncrement(defaultIncrement);
                return;
            }
            var newValue = parseFloat(data);
            var deltaValue = newValue - value;
            setIncrement(increment + 2000 * deltaValue / adjustInterval);
        });
    }

    (function start() {
        $.get('get-current-value.php').then(function(data, status) {
            if (status != 'success' || data <= 0)
                return setTimeout(start, 5000);

            setup(data);
            setInterval(update, 1000);
            setInterval(adjust, adjustInterval);
        });
    })();
});