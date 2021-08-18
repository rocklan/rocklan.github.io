document.addEventListener("DOMContentLoaded", function(){
    var daysdeveloping = document.getElementById('daysdeveloping');
    if (daysdeveloping) {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate =  new Date(2000, 1, 1);
        const secondDate = new Date();

        const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

        var ageDifMs = secondDate - firstDate;
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        var years = Math.abs(ageDate.getUTCFullYear() - 1970);
        daysdeveloping.innerText = years  + ' years (' + diffDays.toLocaleString() + ' days)';
    }
});