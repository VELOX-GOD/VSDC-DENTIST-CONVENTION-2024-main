
  function togglePosterField() {
              var studentType = document.getElementById("studentType").value;
              var posterField = document.getElementById("posterField");
              if (studentType === "poster") {
                posterField.style.display = "block";
              } else {
                posterField.style.display = "none";
              }
}			

function sendmail(){
    Email.send({}).then(
message => alert("Thanks for filling out our form!")
);
    }

document.addEventListener('DOMContentLoaded', function() {
    const studentform = document.getElementById('registerform') ;
    
    const phoneInput = document.getElementById('phone');

    studentform.addEventListener('submit', function(event) {
        if (!validatePhone()) {
            event.preventDefault(); // Prevent form submission if validation fails
        }
    });
    

    phoneInput.addEventListener('input', function() {
        phoneInput.setCustomValidity(''); // Clear previous custom validity message
    });
});


function validatePhone() {
    const phoneInput = document.getElementById('phone');
    const phonePattern = /^[5-9][0-9]{9}$/; // Example pattern: 10 digits, starts from 5-9 only
    if (!phonePattern.test(phoneInput.value)) {
        phoneInput.setCustomValidity('Please enter a valid 10-digit phone number.');
        phoneInput.reportValidity(); // Show the custom validity message
        return false;
    }
    return true;
}



function storePart1Data(){

    const form = document.getElementById('registerform');
    validatePhone();

    if(window.location.pathname.endsWith('facultyregisterdetails')){
        if(form.checkValidity() ) {
            const facultyType = document.getElementById('facultyType').value;
        const banquet = document.getElementById('banquet').value;
        const name = document.getElementById('yourname').value;
        const speciality = document.getElementById('speciality').value;
        const email = document.getElementById('emailaddress').value;
        const phone = document.getElementById('phone').value;
        const ksdc = document.getElementById('ksdc').value;
    
        //Store in Session Storage
    
        sessionStorage.setItem('facultyType', facultyType);
        sessionStorage.setItem('banquet', banquet);
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('speciality', speciality);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('phone', phone);
        sessionStorage.setItem('ksdc', ksdc);
    
        //Redirect to paymnet page
    
        window.location.href = '/facultyregisterpay';
        }
        else {
            form.reportValidity();
        }
    }
    else if(window.location.pathname.endsWith('studentregisterdetails')){

        if(form.checkValidity() ) {
            
        const name = document.getElementById('name').value;
        const collegeName = document.getElementById('collegeName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const pursuing = document.getElementById('pursuing').value;
        const studentType = document.getElementById('studentType').value;
        const poster = studentType == 'poster'? 'poster': 'no poster';
        //Store in Session Storage
    
        sessionStorage.setItem('studentType', studentType);
        sessionStorage.setItem('poster', poster);
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('collegeName', collegeName);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('phone', phone);
        sessionStorage.setItem('pursuing', pursuing);
    
        //Redirect to payment page
            console.log('proceed')
        window.location.href = '/studentregisterpay';
        }
        else {
            form.reportValidity();
        }

    }
    
    
    
}

function updateQrCode(f_flag, facultyType, banquet) {
    let qrCodeImg = ''
    switch(f_flag) {
        case 0: qrCodeImg = 'Students Scientific + Poster.png'
                break;
        case 1: 
            if(facultyType === 'ida' && banquet === 'with-banquet') {
                qrCodeImg = 'IDA + Banquet.png'
            }
            else if(facultyType === 'ida' && banquet === 'without-banquet') {
                qrCodeImg = 'IDA + Scientific.png'
            }
            else if(facultyType === 'non-ida' && banquet === 'with-banquet'){
                qrCodeImg = 'Non IDA + Banquet.png'
            }
            else {
                qrCodeImg = 'Non IDA + Scientific.png'
            }
    }
    return qrCodeImg;
}
//For Faculty Registration Page 2
document.addEventListener('DOMContentLoaded', function() {
    // If on Page 2, populate form fields with data from session storage
    if (window.location.pathname.endsWith('facultyregisterpay')) {
        
        const form = document.getElementById('registerform');
        const facultyType = sessionStorage.getItem('facultyType');
        const banquet = sessionStorage.getItem('banquet');
        const name = sessionStorage.getItem('name');
        const speciality = sessionStorage.getItem('speciality');
        const email = sessionStorage.getItem('email');
        const phone = sessionStorage.getItem('phone');
        const ksdc = sessionStorage.getItem('ksdc');
        
        const qrCodeImg = updateQrCode(1, facultyType, banquet);
        const qrCodeSrc = '/image/qrcode/' + qrCodeImg
        if (facultyType && banquet && name && speciality && email && phone && ksdc) {

            
            // Optionally, you could add hidden fields to submit these values along with the second part of the form
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="facultyType" value="${facultyType}">`);
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="banquet" value="${banquet}">`);
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="yourname" value="${name}">`);
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="speciality" value="${speciality}">`);
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="emailaddress" value="${email}">`);
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="phone" value="${phone}">`);
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="ksdc" value="${ksdc}">`);

            document.getElementById('qr-code-payment').src = qrCodeSrc;
            document.getElementById('qr-code-desc').textContent = qrCodeImg.split('.')[0];
        }

        
    }
});

//For Student Registration Page 2
document.addEventListener('DOMContentLoaded', function() {
    // If on Page 2, populate form fields with data from session storage
    if (window.location.pathname.endsWith('studentregisterpay')) {
        

        const form = document.getElementById('registerform');
        const studentType = sessionStorage.getItem('studentType');
        const poster = sessionStorage.getItem('poster');
        const name = sessionStorage.getItem('name');
        const collegeName = sessionStorage.getItem('collegeName');
        const email = sessionStorage.getItem('email');
        const phone = sessionStorage.getItem('phone');
        const pursuing = sessionStorage.getItem('pursuing');
        
        const qrCodeImg = updateQrCode(0, '', '');
        const qrCodeSrc = '/image/qrcode/' + qrCodeImg;
        if (name && collegeName && email && phone && pursuing && studentType && poster) {
            
            
            // Optionally, you could add hidden fields to submit these values along with the second part of the form
            
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="name" value="${name}">`);
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="collegeName" value="${collegeName}">`);
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="email" value="${email}">`);
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="phone" value="${phone}">`);
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="pursuing" value="${pursuing}">`);
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="studentType" value="${studentType}">`);
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="poster" value="${poster}">`);

            document.getElementById('qr-code-payment').src = qrCodeSrc;
            document.getElementById('qr-code-desc').textContent = qrCodeImg.split('.')[0];
        }

        
    }
});

//UPI Transaction ID Toggle
document.getElementById('paymentComplete').addEventListener('change', function() {
    var upiSection = document.getElementById('upiSection');
    if (this.checked) {
        upiSection.classList.add('visible');
      
    } else {
        upiSection.classList.remove('visible');
      
    }
  });