function updateDaysDeveloping() {
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
}

document.addEventListener("DOMContentLoaded", function(){
  updateDaysDeveloping();
});

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
      m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-2382034-1', 'auto');
ga('send', 'pageview');