$(function () {
    var rankCtx = $("#rank-chart").get(0).getContext("2d");
    var pointsCtx = $("#points-chart").get(0).getContext("2d");
    $.get(window.location + '/stats.json', function (stats) {
        var labels = _(stats).pluck('date').map(function (dateString) {
            var d = new Date(dateString);
            return d.getHours() + ':' + d.getMinutes();
        });
        var rPts = _(stats).pluck('points');
        var pointsData = {
            labels: labels,
            datasets: [{
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                data: rPts
            }]
        };
        new Chart(pointsCtx).Line(pointsData);        
        var rankData = {
            labels: labels,
            datasets: [{
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                data: _(stats).pluck('rank')
            }]
        };
        new Chart(rankCtx).Line(rankData);
    });
});
