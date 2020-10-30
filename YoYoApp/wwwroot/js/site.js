let fitnesstest_data = [];
let testTimeElapsed = 0;
let testEndTime = 0;
let currentShuttle;
let athlete_data = [];

$(document).ready(function () {
    $('#btnStart').hide();
    $('#divlevel').hide();
    
    $.get('Home/GetFitnessTestData').then((res) => {
        res.forEach((x) => {
            x.commulativeTimeInSeconds = getSecondsFromTime(x.commulativeTime);
        });
        fitnesstest_data = res;
        testEndTime = getSecondsFromTime(fitnesstest_data[fitnesstest_data.length - 1].commulativeTime);
        $('.cdev').attr("data-duration", testEndTime);
        $('.cdev').attr("data-percent", 0);
        $('#btnStart').show();
        getAthleteData();
    });

    $('#btnStart').click(function () {
        $('#btnStart').hide();
        startTest();
    });

    function startTest() {
        $('#divlevel').show();
        $('.warnbtn').show();
        $('.stopbtn').show();
        currentShuttle = fitnesstest_data[0];
        if (currentShuttle) {
            $('#currentlevelNo').text("Level " + currentShuttle.speedLevel);
            $('#currentShuttelNo').text("Shuttle " + currentShuttle.shuttleNo);
            $('#currentSpeed').text("" + currentShuttle.speed + "Km/h");
        }
        window.setInterval(function () {
            let time = testEndTime;
            if (time > 0) {
                time -= 1;
                let elapsedShuttle = fitnesstest_data.filter(function (e) {
                    return e.commulativeTimeInSeconds < testTimeElapsed;
                });
          
                if (elapsedShuttle && elapsedShuttle.length > 0) {
                    currentShuttle = elapsedShuttle[elapsedShuttle.length - 1];
                    let index = fitnesstest_data.findIndex((x) => {
                        return x.accumulatedShuttleDistance === currentShuttle.accumulatedShuttleDistance;
                    });
                    if (index >= 0) {
                        currentShuttle = fitnesstest_data[index + 1];
                        nextShuttle = fitnesstest_data[index + 2];
                        if (currentShuttle) {
                            $('#currentlevelNo').text("Level " + currentShuttle.speedLevel);
                            $('#currentShuttelNo').text("Shuttle " + currentShuttle.shuttleNo);
                            $('#currentSpeed').text("" + currentShuttle.speed + "Km/h");
                        }
                    }
                }
                $('#timeLeft').text(time + "m");
                $('#nextShuttle').text(currentShuttle.commulativeTimeInSeconds - testTimeElapsed + " s");
            }
            testEndTime = time;
            testTimeElapsed += 1;
            $('#totalTime').text(getTimeFromSeconds(testTimeElapsed) + " m");
            $('#totalDistance').text(currentShuttle.accumulatedShuttleDistance - 40 + " m");
            let perProgress = testTimeElapsed * 100 / testEndTime;
            $('.cdev').attr("data-percent", parseInt(perProgress.toString()));
            $(".cdev").circlos();
        }, 1000);
    }

    function getAthleteData() {
        $.get('Home/GetAthleteData').then((res) => {
            athlete_data = res;
            renderAthlete();
            $('.warnbtn').hide();
            $('.stopbtn').hide();
        });
    }

    function getSecondsFromTime(time) {
        var a = time.split(':');
        return (+a[0]) * 60 + (+a[1]);
    }

    function getTimeFromSeconds(seconds) {
        let minutes = Math.floor(seconds / 60);
        let sec = seconds - minutes * 60;
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (sec < 10) {
            sec = "0" + sec;
        }
        return minutes + ":" + sec;
    }

    function renderAthlete() {
        $('#tableResult').empty();
        for (var i = 0; i < athlete_data.length; i++) {
            tr = $('<tr/>');
            tr.append("<td>" + athlete_data[i].srNo + "</td>");
            tr.append("<td>" + athlete_data[i].name + "</td>");
            let warnbtn = "";
            if (athlete_data[i].result == "") {
                if (athlete_data[i].warning == "1") {
                    warnbtn = "<button id=warnenable_" + i + "class='btn btn-primary' disabled>Warned</button>";
                    
                } else {
                    warnbtn = "<button id=warndisable_" + i + " class='btn btn-dark warnbtn'>Warn</button></td>";
                }
            }
            tr.append("<td>" + warnbtn + "</td>");

            let btn = "";
            let selectlist = "";
            if (athlete_data[i].result == "") {
                btn = "<button id=stop_" + i + " class='btn btn-danger stopbtn'>Stop</button>"
            } else {
                let options = "";
                options = "<option value='0'>Select</option>";
                $.each(fitnesstest_data, function (index, item) {
                    if (athlete_data[i].result == item.speedLevel + "-" + item.shuttleNo) {
                        options = options + "<option selected='true' value=" + item.speedLevel + "-" + item.shuttleNo + ">" + item.speedLevel + "-" + item.shuttleNo + "</option>";
                    } else {
                        options = options + "<option value=" + item.speedLevel + "-" + item.shuttleNo + ">" + item.speedLevel + "-" + item.shuttleNo + "</option>";
                    } 
                })
                selectlist = "<select id=ddlResult_" + i + ">" + options + "</select>"
            }
            tr.append("<td>" + btn + selectlist + "</td>");
            $('#tableResult').append(tr);
        }
    }

    //warn Athlete
    $('body').on('click', 'button.warnbtn', function (e) {
        let athleteId = e.target.id.split('_')[1];
        athlete_data.forEach((x) => {
            if (x.srNo == (parseInt(athleteId) + 1)) {
                x.warning = "1";
                renderAthlete();
            }
        });
    });

    //Stop Athlete and display result
    $('body').on('click', 'button.stopbtn', function (e) {
        let cindex = fitnesstest_data.findIndex((x) => {
            return x.accumulatedShuttleDistance === currentShuttle.accumulatedShuttleDistance;
        });
        let athleteId = e.target.id.split('_')[1];
        let resultShuttle = {}
        if (cindex > 0) {
            resultShuttle = fitnesstest_data[cindex - 1];
            if (resultShuttle) {
                athlete_data.forEach((x) => {
                    if (x.srNo == (parseInt(athleteId) + 1)) {
                        x.result = resultShuttle.speedLevel + "-" + resultShuttle.shuttleNo;
                        renderAthlete();
                    }
                });
            }
        } else {
            resultShuttle = fitnesstest_data[cindex];
            if (resultShuttle) {
                athlete_data.forEach((x) => {
                    if (x.srNo == (parseInt(athleteId) + 1)) {
                        x.result = resultShuttle.speedLevel + "-" + resultShuttle.shuttleNo;
                        renderAthlete();
                    }
                });
            }
        }
        
    })
});

(function ($) {
    // circle animation 
    $.fn.circlos = function () {
        // deafualt options 
        let perProgress = testTimeElapsed * 100 / testEndTime;
        
        var DEFAULTS = {
            backgroundColor: '#b3cef6', 
            progressColor: '#4b86db',
            percent: perProgress,
            duration: testEndTime
        };
        
        $(this).each(function () {
            var $target = $(this);
            var options = {
                backgroundColor: $target.data('color') ? $target.data('color').split(',')[0] : DEFAULTS.backgroundColor,
                progressColor: $target.data('color') ? $target.data('color').split(',')[1] : DEFAULTS.progressColor,
                percent: perProgress,
                duration: testEndTime
            };

            $target.append('<div class="background"></div><div class="rotate"></div><div class="left"></div><div class="right"></div><div class=""><span></span></div>');
            $target.find('.background').css('background-color', options.backgroundColor);
            $target.find('.left').css('background-color', options.backgroundColor);
            $target.find('.rotate').css('background-color', options.progressColor);
            $target.find('.right').css('background-color', options.progressColor);

            var $rotate = $target.find('.rotate');
            setTimeout(function () {
                $rotate.css({
                    //'transition': 'transform ' + options.duration + 'ms linear',
                    'transform': 'rotate(' + options.percent * 3.6 + 'deg)'
                });
            }, 0);
        });
    }
})(jQuery);