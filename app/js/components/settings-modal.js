import Modal from 'accessible-web-components/utils/modal.js';

import { colourMap, LS_KEY } from './tube.js';

export class SettingsModal extends Modal {
  constructor(element, tubeStatusInstance) {
    super(element);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.form = element.querySelector('#tube-line-form');
    this.checked = [];
    this.tubeStatusInstance = tubeStatusInstance;

    this.init();
  }
  
  init() {
    this.bindEvents();
    this.renderForm();
  }

  bindEvents() {
    [...document.querySelectorAll(`[data-modal-trigger=${this.element.id}]`)].forEach((button) => {
      button.addEventListener('click', this.open);
      button.setAttribute('aria-controls', this.element.id);
    });
    [...this.element.querySelectorAll('[data-modal-close]')].forEach((button) => {
      button.addEventListener('click', this.close);
      button.setAttribute('aria-controls', this.element.id);
    });
    this.form.addEventListener('submit', this.handleSubmit);
  }

  getChecked() {
    const data = window.localStorage.getItem(LS_KEY);
    if (!data) {
      return;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      return;
    }
    this.checked = parsed;
  }

  renderForm() {
    this.getChecked();

    this.form.innerHTML = Object.keys(colourMap).map((id) => {
      const colour = colourMap[id];
      return `
        <div>
          <input type="checkbox" name="line" id="checkbox-${id}" value="${id}" ${this.checked.includes(id) ? 'checked' : '' } />
          <label for="checkbox-${id}" style="color: ${colour}">${id}</label>
        </div>
      `;
    }).join('');
  }

  handleSubmit(event) {
    event.preventDefault();
    const selectedLines = [...this.form.elements.line]
      .filter(line => line.checked)
      .map(line => line.value);
    window.localStorage.setItem(LS_KEY, JSON.stringify(selectedLines));
    this.close();
    this.tubeStatusInstance.update();
  }
}