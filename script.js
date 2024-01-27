let notifications;
divs = document.querySelectorAll(".holding-div .hl-div");

// Object containing details for different types of toasts
let toastDetails = {
    timer: 5000,
    success: {
        icon: 'fa-circle-check',
        text: "Success: copied to clipboard!"
    },
    error: {
        icon: 'fa-circle-xmark',
        text: 'Error: This is an error toast.',
    },
    warning: {
        icon: 'fa-triangle-exclamation',
        text: 'Warning: This is a warning toast.',
    },
    info: {
        icon: 'fa-circle-info',
        text: 'Info: This is an information toast.',
    }
}

const removeToast = (toast) => {
    toast.classList.add("hide");
    if(toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
    setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
}

const createToast = (id, customText) => {
    // Getting the icon and text for the toast based on the id passed
    const { icon } = toastDetails[id];
    const toast = document.createElement("li"); // Creating a new 'li' element for the toast
    toast.className = `toast ${id}`; // Setting the classes for the toast
    toastDetails.success.text =  document.getElementById("textToCopy").innerHTML +  "hi"
    // Setting the inner HTML for the toast
    toast.innerHTML = `<div class="column">
                         <i class="fa-solid ${icon}"></i>
                         <span>${customText}</span>
                      </div>
                      <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>`;
    notifications.appendChild(toast); // Append the toast to the notification ul
    // Setting a timeout to remove the toast after the specified duration
    toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
}

// Adding a click event listener to each button to create a toast when clicked
divs.forEach(d => {
    d.addEventListener("click", () => createToast("success"));
});

let _c,_r,_e,_l;
let chartData, chartOptions;

document.addEventListener('DOMContentLoaded', function () {
    notifications  = document.querySelector(".notifications")
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

        document.getElementById("boost").innerHTML = passport;

        document.getElementById("total").innerHTML = Total(common, rare, epic, legendary, passport, 1).toFixed(10);

        document.getElementById("thirtyX").innerHTML = Total(common, rare, epic, legendary, passport, 30).toFixed(10);

        document.getElementById("fiftyX").innerHTML = Total(common, rare, epic, legendary, passport, 50).toFixed(10);

        document.getElementById("perDay").innerHTML = PerDay(common, rare, epic, legendary, passport, 1).toFixed(10);

        document.getElementById("perDay30x").innerHTML = PerDay(common, rare, epic, legendary, passport, 30).toFixed(10);

        document.getElementById("days").innerHTML = PerDay(common, rare, epic, legendary, passport, 1).toFixed(10) * 30;

        document.getElementById("textToCopy").innerHTML = PerDay(common, rare, epic, legendary, passport, 30).toFixed(10) * 30;

        drawChart();
    });

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    document.getElementById('copyIcon').addEventListener('click', function() {
        const textToCopy = document.getElementById('textToCopy').innerText;
        
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
        createToast('success', `${document.getElementById('textToCopy').innerText}<br>Copied to clipboard!`);
    
        // Remove the textarea from the body
        document.body.removeChild(textarea);

        // security issue do not use alert
        // alert(`${document.getElementById("textToCopy").innerHTML} copied to clipboard!`)
    
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

    document.querySelectorAll('.one0Reset').forEach(element => {
        element.value = '0'; // for the inputs
        element.innerHTML = '0'; // for the span
    });

    document.querySelectorAll('.three0Reset').forEach(element => {
        element.innerHTML = '0.00';
    });
    
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