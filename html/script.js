let config = {};
let currentStep = 1;
const totalSteps = 3;

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('container');
    const form = document.getElementById('identityForm');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnSubmit = document.getElementById('btnSubmit');
    const errorMessage = document.getElementById('errorMessage');
    const genderOptions = document.querySelectorAll('.enity-plec-opcja');
    const heightInput = document.getElementById('height');
    const heightValue = document.getElementById('heightValue');
    const nationalitySelect = document.getElementById('nationalitySelect');
    const nationalityOptions = document.getElementById('nationalityOptions');
    const nationalityInput = document.getElementById('nationality');

    window.addEventListener('message', function(event) {
        const data = event.data;
        console.log('[esx_identity] Message received:', data);
        
        if (data.action === 'open') {
            config = data.config || {};
            initForm();
            container.classList.add('aktywny');
        } else if (data.action === 'close') {
            container.classList.remove('aktywny');
        } else if (data.action === 'showError') {
            displayError(data.message);
        }
    });

    function initForm() {
        if (config.minHeight && config.maxHeight) {
            heightInput.min = config.minHeight;
            heightInput.max = config.maxHeight;
            heightInput.value = Math.round((config.minHeight + config.maxHeight) / 2);
            heightValue.textContent = heightInput.value + ' cm';
        }
        
        if (config.nationalities && config.nationalities.length > 0) {
            nationalityOptions.innerHTML = '';
            config.nationalities.forEach(function(nat) {
                const option = document.createElement('div');
                option.className = 'enity-lista-element';
                option.textContent = nat;
                option.onclick = function() {
                    nationalityInput.value = nat;
                    nationalitySelect.querySelector('.enity-lista-wartosc').textContent = nat;
                    nationalitySelect.querySelector('.enity-lista-wartosc').classList.add('wybrany');
                    nationalitySelect.classList.remove('otwarty');
                };
                nationalityOptions.appendChild(option);
            });
        }
        
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - (config.minAge || 18), today.getMonth(), today.getDate());
        const minDate = new Date(today.getFullYear() - (config.maxAge || 80), today.getMonth(), today.getDate());
        const dateInput = document.getElementById('dateofbirth');
        dateInput.max = maxDate.toISOString().split('T')[0];
        dateInput.min = minDate.toISOString().split('T')[0];
        
        currentStep = 1;
        showCurrentStep();
    }

    function displayError(message) {
        errorMessage.querySelector('.enity-blad-tekst').textContent = message;
        errorMessage.classList.add('widoczny');
        setTimeout(function() {
            errorMessage.classList.remove('widoczny');
        }, 5000);
    }

    genderOptions.forEach(function(option) {
        option.onclick = function() {
            genderOptions.forEach(function(o) { o.classList.remove('wybrany'); });
            option.classList.add('wybrany');
            document.getElementById('sex').value = option.dataset.value;
        };
    });

    heightInput.oninput = function() {
        heightValue.textContent = heightInput.value + ' cm';
    };

    nationalitySelect.querySelector('.enity-lista-przycisk').onclick = function() {
        nationalitySelect.classList.toggle('otwarty');
    };

    document.onclick = function(e) {
        if (!nationalitySelect.contains(e.target)) {
            nationalitySelect.classList.remove('otwarty');
        }
    };

    function validateCurrentStep() {
        if (currentStep === 1) {
            const firstname = document.getElementById('firstname').value.trim();
            const lastname = document.getElementById('lastname').value.trim();
            const sex = document.getElementById('sex').value;
            
            if (!firstname) { displayError('Wprowadź imię!'); return false; }
            if (firstname.length < 2 || firstname.length > 20) { displayError('Imię musi mieć 2-20 znaków!'); return false; }
            if (!lastname) { displayError('Wprowadź nazwisko!'); return false; }
            if (lastname.length < 2 || lastname.length > 20) { displayError('Nazwisko musi mieć 2-20 znaków!'); return false; }
            if (!sex) { displayError('Wybierz płeć!'); return false; }
            return true;
        } else if (currentStep === 2) {
            const dateofbirth = document.getElementById('dateofbirth').value;
            if (!dateofbirth) { displayError('Wybierz datę urodzenia!'); return false; }
            return true;
        }
        return true;
    }

    function showCurrentStep() {
        document.querySelectorAll('.enity-formularz-krok').forEach(function(s) { s.classList.remove('aktywny'); });
        const stepEl = document.querySelector('.enity-formularz-krok[data-step="' + currentStep + '"]');
        if (stepEl) stepEl.classList.add('aktywny');
        
        document.querySelectorAll('.enity-krok').forEach(function(step, index) {
            step.classList.remove('aktywny', 'ukonczony');
            if (index + 1 < currentStep) step.classList.add('ukonczony');
            else if (index + 1 === currentStep) step.classList.add('aktywny');
        });
        
        btnPrev.disabled = currentStep === 1;
        btnNext.style.display = currentStep === totalSteps ? 'none' : 'flex';
        btnSubmit.style.display = currentStep === totalSteps ? 'flex' : 'none';
        
        if (currentStep === totalSteps) updateSummary();
    }

    function updateSummary() {
        const firstname = document.getElementById('firstname').value.trim();
        const lastname = document.getElementById('lastname').value.trim();
        const sex = document.getElementById('sex').value;
        const dateofbirth = document.getElementById('dateofbirth').value;
        const height = document.getElementById('height').value;
        const nationality = document.getElementById('nationality').value || 'Nie podano';
        const birthplace = document.getElementById('birthplace').value.trim() || 'Los Santos';
        
        document.getElementById('summaryName').textContent = firstname + ' ' + lastname;
        
        const summaryAvatar = document.getElementById('summaryAvatar');
        summaryAvatar.className = 'enity-podsumowanie-awatar ' + (sex === 'm' ? 'mezczyzna' : 'kobieta');
        
        if (dateofbirth) {
            const birthDate = new Date(dateofbirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            document.getElementById('summaryBirth').textContent = dateofbirth + ' (' + age + ' lat)';
        }
        
        document.getElementById('summaryHeight').textContent = height + ' cm';
        document.getElementById('summaryNationality').textContent = nationality;
        document.getElementById('summaryBirthplace').textContent = birthplace;
    }

    btnNext.onclick = function() {
        if (validateCurrentStep()) {
            currentStep++;
            showCurrentStep();
        }
    };

    btnPrev.onclick = function() {
        if (currentStep > 1) {
            currentStep--;
            showCurrentStep();
        }
    };

    btnSubmit.onclick = function() {
        const formData = {
            firstname: document.getElementById('firstname').value.trim(),
            lastname: document.getElementById('lastname').value.trim(),
            sex: document.getElementById('sex').value,
            dateofbirth: document.getElementById('dateofbirth').value,
            height: parseInt(document.getElementById('height').value),
            nationality: document.getElementById('nationality').value || 'Polska',
            birthplace: document.getElementById('birthplace').value.trim() || 'Los Santos'
        };
        
        console.log('[esx_identity] Submitting:', formData);
        
        fetch('https://esx_identity/submitIdentity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
    };
});
