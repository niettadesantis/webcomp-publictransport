import html2pdf from 'html2pdf.js';
import { html } from 'lit-element';
import printJS from 'print-js';
import { MEANS_ICONS, WALKING } from '../../constants';
import carImage from '../../img/car.svg';
import chevronRightImage from '../../img/chevron-right.svg';
import downloadImage from '../../img/download.svg';
import printImage from '../../img/print.svg';
import shareImage from '../../img/share.svg';
import tripFirstImage from '../../img/trip-first.svg';
import tripLastImage from '../../img/trip-last.svg';
import tripStandardImage from '../../img/trip-standard.svg';
import verticalDotsImage from '../../img/vertical-dots.svg';
import { formatDuration, last } from '../../utilities';
import { render__badge } from '../generics/badge';
import { render__button } from '../generics/buttons';

const html2pdf_params = {
  margin: 1,
  html2canvas: { scale: 4 },
  jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
};

export function render__details() {
  const lastPoint = last(last(this.details_data.legs).points);

  const points = [
    ...this.details_data.legs.map(leg => {
      return {
        time: leg.points[0].dateTime.time,
        place: leg.points[0].name,
        type: leg.type,
        means_desc: leg.type === WALKING ? `A piedi (${leg.timeMinute} minuti)` : leg.mode.name
      };
    }),
    { time: lastPoint.dateTime.time, place: lastPoint.name }
  ];

  const generatePDF = () => {
    return html2pdf()
      .set(html2pdf_params)
      .from(this.shadowRoot.querySelector('.details__body_section').innerHTML);
  };

  const downloadPDF = () => {
    generatePDF().save(`percorso per ${this.destination_place.display_name}`);
  };

  const printPDF = () => {
    generatePDF()
      .outputPdf('blob')
      .then(blob => {
        const url = URL.createObjectURL(blob);
        printJS(url);
      });
  };

  return html`
    <div class="details">
      <div class="details__background">
        <div
          class="row details__back_section"
          @click=${() => {
            this.removeTripFromMap();
            this.details_data = undefined;
          }}
        >
          <div class="col-12 d-flex align-items-center">
            <div class="details__back_section__content">
              <img src=${chevronRightImage} alt="" />
              <p>
                ${this.details_data.type === 'auto' ? 'Dettagli tragitto in auto' : 'Dettagli tragitto in treno'}
              </p>
            </div>
          </div>
        </div>

        <div class="row details__header_section">
          <div class="col-12 mt-2">
            <div class="details__header_section__content">
              <div class="d-flex mt-1">
                ${this.details_data.is_fastest ? render__badge('PIÙ VELOCE', 'yellow') : ''}
              </div>

              <p class="details__header_section__timings mt-2">
                ${this.details_data.startTime} - ${this.details_data.endTime}
                (${formatDuration(this.details_data.duration.split(':'))})
              </p>

              <div class="details__header_section__description mt-2">
                ${this.details_data.type === 'auto'
                  ? html`
                      <img src=${carImage} alt="" />
                      <p class="ml-2">${this.details_data.description}</p>
                    `
                  : ''}
              </div>
              <div class="details__header_section__show_others mt-4">
                <a href="/">Visualizza altri orari ></a>
              </div>
            </div>
          </div>
        </div>
        <div class="details__body_section">
          <div class="details__body_section__content">
            ${points.map((point, i) => {
              let tripIcon = tripStandardImage;
              if (i === 0) {
                tripIcon = tripFirstImage;
              } else if (i === points.length - 1) {
                tripIcon = tripLastImage;
              }

              return html`
                <div class="row details__body_section__content__element" style="max-height:150px">
                  <div class="col-2 col-md">
                    <p class="details__body_section__content__time">
                      ${point.time}
                    </p>
                  </div>
                  <div class="col-3 col-md details__body_section__content__middle">
                    <div class="d-flex justify-content-center">
                      <img src=${tripIcon} alt="" />
                    </div>
                    ${i < points.length - 1
                      ? html`
                          <div
                            class=${`d-flex justify-content-center align-items-center details__body_section__content__vertical_dots
                             ${i === 0 ? `first_element` : ``}`}
                          >
                            <img src=${verticalDotsImage} alt="" />
                          </div>
                        `
                      : null}
                  </div>
                  <div class="col-6 col-md-8">
                    <p class="details__body_section__content__place">${point.place}</p>
                    <div class="details__body_section__content__description">
                      ${point.means_desc
                        ? html`
                            <p>
                              <img src=${MEANS_ICONS[point.type]} alt="" />
                            </p>
                            <p>
                              ${point.means_desc}
                            </p>
                          `
                        : null}
                    </div>
                  </div>
                </div>
              `;
            })}
          </div>
        </div>
        <div class="details__footer_section">
          ${render__button(
            html`
              <img src="${downloadImage}" alt="" /> Scarica PDF
            `,
            downloadPDF,
            'grey'
          )}
          ${render__button(
            html`
              <img src="${printImage}" alt="" /> Stampa
            `,
            printPDF,
            'grey'
          )}
          ${render__button(
            html`
              <img src="${shareImage}" alt="" /> Condividi
            `,
            () => console.log('default'),
            'grey'
          )}
        </div>
      </div>
    </div>
  `;
}