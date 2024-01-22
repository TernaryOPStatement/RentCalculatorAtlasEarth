let _c,_r,_e,_l;
let chartData, chartOptions;

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const common = parseInt(document.getElementById("common").value, 10) * 0.0000000011;
        const rare = parseInt(document.getElementById("rare").value, 10) * 0.0000000016;
        const epic = parseInt(document.getElementById("epic").value, 10) * 0.0000000022;
        const legendary = parseInt(document.getElementById("legendary").value, 10) * 0.0000000044;
        const passport = TotalPassport(parseInt(document.getElementById("passport").value, 10));

        _c = parseInt(document.getElementById("common").value, 10)
        _r = parseInt(document.getElementById("rare").value, 10)
        _e = parseInt(document.getElementById("epic").value, 10)
        _l = parseInt(document.getElementById("legendary").value, 10)

        document.getElementById("total").innerHTML = "Total Per Second: "  + Total(common, rare, epic, legendary, passport, 1).toFixed(10);

        document.getElementById("thirtyX").innerHTML = "Total Per Second with 30X: " + Total(common, rare, epic, legendary, passport, 30).toFixed(10);

        document.getElementById("fiftyX").innerHTML = "Total Per Second with 50X: " + Total(common, rare, epic, legendary, passport, 50).toFixed(10);

        document.getElementById("perDay").innerHTML = "Total Per Day: " + PerDay(common, rare, epic, legendary, passport, 1).toFixed(10);

        document.getElementById("perDay30x").innerHTML = "Total Per Day with 30X: " + PerDay(common, rare, epic, legendary, passport, 30).toFixed(10);

        document.getElementById("days").innerHTML = "Total Over 30 Days: " + PerDay(common, rare, epic, legendary, passport, 1).toFixed(10) * 30;

        document.getElementById("daysWithBonus").innerHTML = "Total Over 30 Days With 30X: " + PerDay(common, rare, epic, legendary, passport, 30).toFixed(10) * 30;

        drawChart();
    });

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        chartData = google.visualization.arrayToDataTable([
            ['Rarity', 'Units'],
            ['Common', _c],
            ['Rare', _r],
            ['Epic', _e],
            ['Legendary', _l]
        ]); 

        chartOptions = {
            title: 'Rarities Breakdown',
            colors: ['#00D573', '#38AFFB', '#CB4DF8', '#FDE001'],
            fontName: 'Comic Neue, cursive',
            pieSliceTextStyle: { color: 'black' },
            legend: { textStyle: { color: 'black' } },
            chartArea: {
                width: '80%',
                height: '80%'
            },
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(chartData, chartOptions);
    }
});

function TotalPassport(p) {
    let b;

    switch (true) {
        case (p > 0 && p < 11):
            b = 5;
            break;
        case (p > 10 && p < 31):
            b = 10;
            break;
        case (p > 30 && p < 61):
            b = 15;
            break;
        case (p > 60 && p <= 100):
            b = 20;
            break;
        case (p > 100):
            b = 25;
            break;
        default:
            b = 0;
    }

    return b;
}

function Total(c, r, e, l, p, v) {
    const t = (c + r + e + l) * v;
    p = TotalPassport(p);

    return p > 0 ? t * (p * .01) + t : t;
}

function PerDay(c, r, e, l, p, v) {
    return Total(c, r, e, l, p, v) * 60 * 60 * 24;
}

function clearInputValue(input) {
    input.value = "";
}