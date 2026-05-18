(function () {
  document.querySelectorAll('.social-button').forEach((el) => {
    el.addEventListener('click', () => {
      scrollToRegistration();
    });
  });

  document.getElementById('registration-form').addEventListener('submit', event => {
    event.preventDefault();

    const data = new FormData(event.target);
    const validate = validateForm(data);

    if(validate) {
      displayMessage('form-message', 'Application sent!', 'info');
    }
  });

  scrollToRegistration = () => {
    let el = document.getElementById('registration-section');
    el.scrollIntoView({
      behavior: 'smooth'
    });
  };

  validateForm = data => {
    if(!data instanceof FormData) {
      displayMessage('form-message', 'Error: Form data mismatch. Please try again later.');
      return;
    }

    if(!data.get('firstName')) {
      displayMessage('form-message', '⚠️ Please enter first name. ⚠️');
      return;
    }
    else if(!data.get('lastName')) {
      displayMessage('form-message', '⚠️ Please enter last name. ⚠️');
      return;
    }
    else if(!data.get('email')) {
      displayMessage('form-message', '⚠️ Please enter email address. ⚠️');
      return;
    }
    else if(!data.get('practiceName')) {
      displayMessage('form-message', '⚠️ Please enter practice name. ⚠️');
      return;
    }
    else if(!data.get('address')) {
      displayMessage('form-message', '⚠️ Please enter street address. ⚠️');
      return;
    }
    else if(!data.get('city')) {
      displayMessage('form-message', '⚠️ Please enter city. ⚠️');
      return;
    }
    else if(!data.get('postalCode')) {
      displayMessage('form-message', '⚠️ Please enter postal code. ⚠️');
      return;
    }
    else if(!data.get('province')) {
      displayMessage('form-message', '⚠️ Please enter province. ⚠️');
      return;
    }
    else if(!data.get('country')) {
      displayMessage('form-message', '⚠️ Please enter country. ⚠️');
      return;
    }
    else if(!data.get('registerRadio')) {
      displayMessage('form-message', '⚠️ Please select professional status. ⚠️');
      return;
    }
    else if(!data.get('comment')) {
      displayMessage('form-message', '⚠️ Please list three opportunities you see for the future of Optometry. ⚠️');
      return;
    }

    return true;
  }

  displayMessage = (elId, msg, mode) => {
    const el = document.getElementById(elId);
    
    msg = !msg ? '&nbsp;' : msg;
    mode = !mode ? 'white' : mode;
    el.innerHTML = `<span class="text-${mode}">${msg}</span>`;
  }
})();