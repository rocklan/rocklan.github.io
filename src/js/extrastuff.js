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
    validationBox.classList.remove("hideit");
    validationBox.innerText = 'Please fix the highlighted fields';
  }
  else {
    validationBox.classList.add("hideit");
    doRegisterSubmission();
  }
}

var currentlySubmitting = false;

function doRegisterSubmission() {
  if (currentlySubmitting === true) {
    return;
  }

  var submitbutton = document.getElementById('submitbutton');
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var workshopId = document.getElementById('workshopid').value;
  var successMessage = document.getElementById('successMessage');
  
  successMessage.classList.add("hideit");
  
  submitbutton.disabled = true;
  currentlySubmitting = true;

  if (workshopId === '1') {
    workshopId = 1;
  } else {
    workshopId = 2;
  }

  var dataToSubmit = JSON.stringify({ name, email, workshopId });
  var url = 'https://rocklan.azurewebsites.net/api/register';

  fetch(url, {
    method: 'post',
    headers: { "Content-type": "application/json"},
    body: dataToSubmit
  })
  .then(
    function(response) {
      if (response.status !== 200) {
        validationBox.classList.remove("hideit");
        validationBox.innerText = 'An error occured while submitting the form: ' + err;
        return;
      }
      
      document.getElementById('submitForm').classList.add("hideit");
      successMessage.classList.remove("hideit");
    }
  )
  .catch(function(err) {
    validationBox.classList.remove("hideit");
    validationBox.innerText = 'An error occured while submitting the form: ' + err;
  })
  .finally(function() {
    submitbutton.disabled = false;
    currentlySubmitting = false;
  });

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