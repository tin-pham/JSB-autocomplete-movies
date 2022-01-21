import { debounce } from './utils.js';

export default class AutoComplete {
  constructor({ widget, renderOption, onOptionSelect, inputValue, fetchData }) {
    this.widget = widget;
    this.renderOption = renderOption;
    this.onOptionSelect = onOptionSelect;
    this.inputValue = inputValue;
    this.fetchData = fetchData;


    this.getAutoComplete();
  }

  getAutoComplete = () => {
    // Add input element for autocomplete tag
    const input = document.createElement('input');
    input.addEventListener('input', debounce(this.onInput));
    this.widget.append(input);

    this.dropdown = document.createElement('div');
    this.dropdown.classList.add('dropdown');

    this.widget.append(this.dropdown);
  };

  onInput = async (e) => {
    const searchText = e.target.value;

    const items = await this.fetchData(searchText);

    this.dropdown.innerHTML = '';
    // Append items to current widget
    this.addDropdown(items);
  };

  addDropdown = (items) => {
    if (!items) {
      return '';
    }
    this.dropdown.append(...this.getDropdownDomList(items));
  };

  getDropdownDomList = (items) => {
    return items.map((item) => {
      const option = document.createElement('a');
      option.classList.add('list-group-item', 'list-group-item-action');
      option.innerHTML = this.renderOption(item);
      // TODO: Add render specific item
      option.addEventListener('click', () => {
        const input = this.widget.querySelector('input');
        input.value = this.inputValue(item);

        this.clearDropdown();

        this.onOptionSelect(item);
      });

      return option;
    });
  };

  clearDropdown() {
    const dropdown = this.widget.querySelector('.dropdown');
    dropdown.innerHTML = '';
  }
}
