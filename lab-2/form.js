'use strict';

const REFS = {
  form: document.querySelector('.form'),
  formOutputContainer: document.querySelector('.form-output-container'),
};

const RULES = {
  credentials: new RegExp(
    /^[А-ЯҐЄІЇ]{1}[а-яґєії]+\s{1}([а-яґєіїА-ЯҐЄІЇ]{1}.){2}$/
  ),
  email: new RegExp(/^[a-z\.-]+@[a-z]+\.com$/),
  address: new RegExp(/^м\.\s[а-яґєіїА-ЯҐЄІЇ]+$/),
  birthdayDate: new RegExp(/^[0-9]{2}.[0-9]{2}.[0-9]{4}$/),
  telegram: new RegExp(/^@[a-z]*_[a-z]*$/),
};

const resetErrors = (names) => {
  for (const name of names) {
    const inputEl = REFS.form.querySelector(`[name='${name}']`);
    inputEl.classList.remove('input-invalid');
  }
};

const resetFormOutput = () => {
  REFS.formOutputContainer.innerHTML = '';
};

const renderFormData = (data) => {
  const markup = `
    <h2>Введені дані:</h2>
    <ul>
      <li>ПІБ: <span>${data.credentials}</span></li>
      <li>Дата Народження: <span>${data.birthdayDate}</span></li>
      <li>Адреса: <span>${data.address}</span></li>
      <li>Email: <span>${data.email}</span></li>
      <li>Telegram: <span>${data.telegram}</span></li>
    </ul>
  `;

  REFS.formOutputContainer.insertAdjacentHTML('afterbegin', markup);
};

const validateForm = () => {
  const validationErrors = [];
  const formValues = {};

  const formData = new FormData(REFS.form);

  resetErrors(formData.keys());
  resetFormOutput();

  for (const [key, value] of formData) {
    const isValueValid = RULES[key].test(value.trim());

    if (!isValueValid) {
      const inputEl = REFS.form.querySelector(`[name='${key}']`);
      inputEl.classList.add('input-invalid');
      validationErrors.push({ name: key });
    } else {
      formValues[key] = value;
    }
  }

  return {
    validationErrors,
    formValues,
  };
};

REFS.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const { validationErrors, formValues } = validateForm();

  if (validationErrors.length !== 0) return;

  renderFormData(formValues);
});
