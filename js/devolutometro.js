$(function() {
    var numbers = {};

    function setupPanel() {
        for (var i = 0; i<= 10; i++)
            numbers[i] = $('#n' + i);
    }

    function updatePanel(value) {
        var digits = value.toFixed(2).replace(/\D/g, '');
        for (var i in numbers) {
            var digit = parseInt(digits[digits.length - 1 - i]);
            numbers[i].css({
                backgroundPosition: digit * (-35) + 'px 0'
            })
        }
    }

    $.get('start.php').then(function(data) {
        setupPanel();

        var value = parseFloat(data);
        setInterval(function() {
            value += 9.05;
            updatePanel(value);
        }, 1000);
    });
});