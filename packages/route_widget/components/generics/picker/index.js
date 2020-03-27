import { html } from 'lit-html';
import chevronDownImage from '../../../img/chevron-down.svg';
import checkImage from '../../../img/check.svg';

export function render__picker(trigger, values, currentValue, action, css_modifiers, translator = s => s) {
  return html`
    <div class=${`picker ${css_modifiers ? css_modifiers.map(o => `${o} `) : ``}`}>
      <div
        class="picker__trigger_box"
        @click=${e => {
          this[trigger] = true;

          // scroll to the active element
          setTimeout(() => {
            const activeElement = this.shadowRoot.querySelector(`[data-picker-trigger-key="${trigger}"] .active`);
            const topOffset = activeElement.offsetTop;
            this.shadowRoot.querySelector(`[data-picker-trigger-key="${trigger}"]`).scrollTop = topOffset;
          }, 0);
        }}
      >
        <span>${translator(values[currentValue])} <img src=${chevronDownImage} alt=""/></span>
      </div>

      <div class=${`picker_box ${this[trigger] ? '' : 'hidden'}`} data-picker-trigger-key=${trigger}>
        ${Object.keys(values)
          .sort()
          .map(key => {
            return html`
              <div
                class=${`picker_box_element  ${`${currentValue}` === `${key}` ? `active` : ``}`}
                @click=${() => action(`${key}`)}
              >
                ${`${currentValue}` === `${key}`
                  ? html`
                      <img src=${checkImage} alt="" />
                    `
                  : ``}
                ${translator(values[key])}
              </div>
            `;
          })}
      </div>
    </div>
    ${this[trigger]
      ? html`
          <div
            @click=${e => {
              this[trigger] = false;
            }}
            class="picker_box__closing_underlay"
          ></div>
        `
      : ``}
  `;
}
