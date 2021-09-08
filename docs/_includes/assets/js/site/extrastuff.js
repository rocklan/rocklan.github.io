function updateDaysDeveloping() {
  var daysdeveloping = document.getElementById('daysdeveloping');

  if (!daysdeveloping) {
    return;
  }

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate =  new Date(2000, 1, 1);
  const secondDate = new Date();

  const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

  var ageDifMs = secondDate - firstDate;
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  var years = Math.abs(ageDate.getUTCFullYear() - 1970);
  daysdeveloping.innerText = years  + ' years (' + diffDays.toLocaleString() + ' days)';

}

function handleWorkshopSubmit() {
  var submitbutton = document.getElementById('submitbutton');
  if (!submitbutton)
  {
    return;
  }

  document.getElementById("name").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      onRegister();
    }
  });
  document.getElementById("email").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      onRegister();
    }
  });

  submitbutton.onclick = function() {
    onRegister();
  }
}

function onRegister() {
  var nameTextBox = document.getElementById('name');
  var emailTextBox = document.getElementById('email');
  var idInput = document.getElementById('workshopid');
  var validationBox = document.getElementById('validationBox');

  nameTextBox.classList.remove('redborder');
  emailTextBox.classList.remove('redborder');

  var formOk = true;

  if (nameTextBox.value.length < 2) {
    nameTextBox.classList.add('redborder');
    formOk = false;
  } 
  if (emailTextBox.value.length < 2) {
    emailTextBox.classList.add('redborder');
    formOk = false;
  } else {
    if (!validateEmail(emailTextBox.value)) {
      emailTextBox.classList.add('redborder');
      formOk = false;
    }
  }

  if (formOk === false) {
    validationBox.style.display = 'block';
  }
  else {
    validationBox.style.display = 'none';
    doRegisterSubmission();
  }
}

var currentlySubmitting = false;

function doRegisterSubmission() {
  if (currentlySubmitting === true) {
    return;
  }

  var submitbutton = document.getElementById('submitbutton');
  submitbutton.disabled = true;
  currentlySubmitting = true;

  setTimeout(function() {

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var workshopId = document.getElementById('workshopid').value;

    if (workshopId === '1') {
      workshopId = 1;
    } else {
      workshopId = 2;
    }

    var dataToSubmit = { name, email, workshopId };

    // Need to call API with name, email + workshopId data
    console.log(dataToSubmit);

    submitbutton.disabled = false;
    currentlySubmitting = false;
  }, 1000);
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


document.addEventListener("DOMContentLoaded", function(){
  updateDaysDeveloping();
  handleWorkshopSubmit();
});

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
      m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-2382034-1', 'auto');
ga('send', 'pageview');