$(function () {
    var ctx = $("#chart").get(0).getContext("2d");
    $.get(window.location + '/stats.json', function (stats) {

        var labels = _(stats).pluck('date').map(function (dateString) {
        	var d = new Date(dateString);
        	return d.getHours() + ':' + d.getMinutes();
        });

        var data = {
            labels: labels,
            datasets: [{
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                data: _(stats).pluck('points')
            }, {
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                data: _(stats).pluck('rank')
            }]
        }
        new Chart(ctx).Line(data);
    });
});
