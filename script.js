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

        document.getElementById("totalParcels").innerHTML = "Total Parcels: " + (_c + _r + _e + _l);

        document.getElementById("boost").innerHTML = `Passport Boost: ${passport}%`;

        document.getElementById("total").innerHTML = "Total Per Second: "  + Total(common, rare, epic, legendary, passport, 1).toFixed(10);

        document.getElementById("thirtyX").innerHTML = "Total Per Second with 30X: " + Total(common, rare, epic, legendary, passport, 30).toFixed(10);

        document.getElementById("fiftyX").innerHTML = "Total Per Second with 50X: " + Total(common, rare, epic, legendary, passport, 50).toFixed(10);

        document.getElementById("perDay").innerHTML = "Total Per Day: " + PerDay(common, rare, epic, legendary, passport, 1).toFixed(10);

        document.getElementById("perDay30x").innerHTML = "Total Per Day with 30X: " + PerDay(common, rare, epic, legendary, passport, 30).toFixed(10);

        document.getElementById("days").innerHTML = "Total Over 30 Days: " + PerDay(common, rare, epic, legendary, passport, 1).toFixed(10) * 30;

        document.getElementById("textToCopy").innerHTML = PerDay(common, rare, epic, legendary, passport, 30).toFixed(10) * 30;

        drawChart();
    });

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    document.getElementById('copyIcon').addEventListener('click', function() {
        var textToCopy = document.getElementById('textToCopy').innerText;
        console.log(textToCopy);
        
        // Create a temporary textarea element
        var textarea = document.createElement('textarea');
        textarea.value = textToCopy;
    
        // Append the textarea to the body
        document.body.appendChild(textarea);
    
        // Select the text in the textarea
        textarea.select();
        textarea.setSelectionRange(0, 99999); // For mobile devices
    
        // Copy the selected text
        // This is a depreciated command and clipboard API should be used
        // API would require HTTPS this is not HTTPS hosted
        document.execCommand('copy');
    
        // Remove the textarea from the body
        document.body.removeChild(textarea);

        alert(`${document.getElementById("textToCopy").innerHTML} copied to clipboard!`)
    
    });
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

function resetForm() {
    // Reset input values
    document.getElementById('common').value = '0';
    document.getElementById('rare').value = '0';
    document.getElementById('epic').value = '0';
    document.getElementById('legendary').value = '0';
    document.getElementById('passport').value = '0';

    // Reset span text
    document.getElementById('totalParcels').innerText = 'Total Parcels: 0';
    document.getElementById('boost').innerText = 'Passport Boost: 0%';
    document.getElementById('total').innerText = 'Total Per Second: 0.00';
    document.getElementById('thirtyX').innerText = 'Total Per Second with 30X: 0.00';
    document.getElementById('fiftyX').innerText = 'Total Per Second with 50X: 0.00';
    document.getElementById('perDay').innerText = 'Total Per Day: 0.00';
    document.getElementById('perDay30x').innerText = 'Total Per Day with 30X: 0.00';
    document.getElementById('days').innerText = 'Total Over 30 Days: 0.00';
    document.getElementById('daysWithBonus').innerText = 'Total Over 30 Days With 30X: 0.00';

    _c = 0;
    _r = 0;
    _e = 0;
    _l = 0;

    drawChart();
}


function drawChart() {
    chartData = google.visualization.arrayToDataTable([
        ['Rarity', 'Units'],
        ['Common', _c],
        ['Rare', _r],
        ['Epic', _e],
        ['Legendary', _l]
    ]); 

    chartOptions = {
        colors: ['#00D573', '#38AFFB', '#CB4DF8', '#FDE001'],
        fontName: 'Comic Neue, cursive',
        pieSliceTextStyle: { color: 'black', bold: true },
        legend: { textStyle: { color: 'black', bold: true } },
        chartArea: {
            width: '80%',
            height: '80%'
        },
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(chartData, chartOptions);
};