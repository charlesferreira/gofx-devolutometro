
$(function() {
    var version;
    var numbers = {};
    var comma;
    var devolutometro;
    var lowlightStart = {h: 00, m: 00};
    var lowlightStop = {h: 06, m: 00};
    var currentValue;
    var defaultIncrement;
    var adjustInterval = 300000;        // 300000 = 5 minutos
    var numDigits = 12;
    var previousHour = 99;
    var video;
    var videoPlayAtStart = false;
    var videoTimerInterval = 600000;    // 600000 = 10 minutos

    function setup(data) {
        version = data.version;
        currentValue = parseFloat(data.value);
        defaultIncrement = parseFloat(data.increment);
        for (var i = 0; i<= numDigits; i++)
            numbers[i] = $('#n' + i);
        comma = $('#virgula');
        devolutometro = $('#devolutometro');
        video = $('#video');
        startVideoTimer();
    }

    function startVideoTimer() {
        video[0].pause();
        video.hide();

        function hide() {
            devolutometro.show();
            video.hide();
            setTimeout(play, videoTimerInterval);
        }
        function play() {
            devolutometro.hide();
            video.show();
            video[0].play();

            video.on('ended', hide);
        }

        videoPlayAtStart ? play() : hide();
    }

    function update() {
        currentValue += defaultIncrement;
        var digits = currentValue.toFixed(2).replace(/\D/g, '');
        for (var i in numbers) {
            var digit = parseInt(digits[digits.length - 1 - i]);
            numbers[i].css({
                backgroundPosition: digit * (-35) + 'px 0',
                display: digits.length > i ? 'block' : 'none'
            })
        }

        comma.css({ display: currentValue > 1000000000 ? 'block' : 'none' });
        updateLowLight();
        updateAutoRefresh();
    }

    function updateAutoRefresh() {
        var now = new Date().getHours();
        if (previousHour < now && (now == 6 || now == 16))
            return refresh();

        previousHour = now;
    }

    function updateLowLight() {
        var d = new Date();
        var now = minutes(d.getHours(), d.getMinutes());
        var start = minutes(lowlightStart.h, lowlightStart.m);
        var stop = minutes(lowlightStop.h, lowlightStop.m);
        var lowlight = stop > start
            ? (now >= start && now < stop)
            : (now >= start || now < stop);
        devolutometro.toggleClass('lowlight', lowlight);
    }

    function minutes(h, m) {
        return h * 60 + m;
    }

    function adjust() {
        $.get('get-current-data.php').then(function(data, status) {
            if (data.version != version) {
                return refresh();
            }
            if (status != 'success' || data.value <= 0 || data.increment <= 0) {
                return;
            }
            defaultIncrement = parseFloat(data.increment);
            var newValue = parseFloat(data.value);
            if (newValue > currentValue)
                currentValue = newValue;
        });
    }

    function refresh() {
        window.location.href = window.location.href;
    }

    (function start() {
        console.log(new Date());

        $.get('get-current-data.php').then(function(data, status) {
            if (status != 'success' || data.value <= 0 || data.increment <= 0)
                return setTimeout(start, 5000);
            setup(data);
            setInterval(update, 1010);
            setInterval(adjust, adjustInterval);
        });
    })();
});