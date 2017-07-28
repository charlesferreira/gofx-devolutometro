$(function() {
    var version;
    var numbers = {};
    var comma;
    var currentValue;
    var defaultIncrement;
    var maximumIncrement = function() { return defaultIncrement * 1.5 };
    var mininumIncrement = function() { return defaultIncrement * 0.5 };
    var increment = 0;
    var adjustInterval = 60000;
    var numDigits = 12;

    function setup(data) {
        version = data.version;
        currentValue = parseFloat(data.value);
        defaultIncrement = parseFloat(data.increment);
        setIncrement(defaultIncrement);
        for (var i = 0; i<= numDigits; i++)
            numbers[i] = $('#n' + i);
        comma = $('#virgula');
    }

    function update() {
        currentValue += increment;
        var digits = currentValue.toFixed(2).replace(/\D/g, '');
        for (var i in numbers) {
            var digit = parseInt(digits[digits.length - 1 - i]);
            numbers[i].css({
                backgroundPosition: digit * (-35) + 'px 0',
                display: digits.length > i ? 'block' : 'none'
            })
        }

        comma.css({ display: currentValue > 1000000000 ? 'block' : 'none' });
    }

    function setIncrement(newValue) {
        increment = Math.max(mininumIncrement(), newValue > 0
            ? Math.min(maximumIncrement(), newValue)
            : Math.min(defaultIncrement, increment * 0.5));
        //console.log("increment: " + increment);
        //console.log(new Date());
    }

    function adjust() {
        $.get('get-current-data.php').then(function(data, status) {
            if (data.version != version) {
                window.location.href = window.location.href;
                return;
            }
            if (status != 'success' || data.value <= 0 || data.increment <= 0) {
                setIncrement(defaultIncrement);
                return;
            }
            defaultIncrement = parseFloat(data.increment);
            var newValue = parseFloat(data.value);
            var deltaValue = newValue - currentValue;
            setIncrement(increment + 2000 * deltaValue / adjustInterval);
        });
    }

    (function start() {
        $.get('get-current-data.php').then(function(data, status) {
            if (status != 'success' || data.value <= 0 || data.increment <= 0)
                return setTimeout(start, 5000);
            setup(data);
            setInterval(update, 1000);
            setInterval(adjust, adjustInterval);
        });
    })();
});