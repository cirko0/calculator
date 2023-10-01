// Fix rounding
// Validation
// Transitions

class App {
  history: { step: string; result: string }[] = [];
  signs: string[] = ['+', '-', '÷', '×'];
  result: HTMLParagraphElement;
  step: HTMLParagraphElement;
  prev: string = '';
  number: string = '';
  default: string = '';
  constructor() {
    this.result = document.querySelector('#result')!;
    this.step = document.querySelector('#step')!;

    this.configure();
    this.renderLocalStorage();
  }

  configure() {
    (
      document.querySelectorAll(
        '.app--numbers>p'
      ) as NodeListOf<HTMLParagraphElement>
    ).forEach(btn => {
      btn.addEventListener('click', e => {
        this.addNumbers(btn, e);
      });
    });
    (
      document.querySelectorAll(
        '.highlight--col>p'
      )! as NodeListOf<HTMLParagraphElement>
    ).forEach(btn => {
      btn.addEventListener('click', () => {
        this.addAndChangeSigns(btn);
      });
    });

    document
      .querySelector('.history__icon')!
      .addEventListener('click', function () {
        document.querySelector('.history__container')!.classList.add('open');
      });
    document
      .querySelector('.history__container > i')!
      .addEventListener('click', function () {
        document.querySelector('.history__container')!.classList.remove('open');
      });
    document
      .getElementById('clear-history')!
      .addEventListener('click', this.clearLocalStorage.bind(this));

    document
      .getElementById('clear')!
      .addEventListener('click', this.clearResult.bind(this));

    document
      .getElementById('sign')!
      .addEventListener('click', this.changeSignOfNumber.bind(this));

    document
      .getElementById('percentage')!
      .addEventListener('click', this.percentageNumber.bind(this));
  }

  addNumbers(btn: HTMLParagraphElement, e: any) {
    if (btn.id === 'deleteOne' && this.result.innerHTML !== ' ') {
      this.deleteOne();
      return;
    }

    if (btn.id === 'dot' && this.result.innerHTML !== ' ') {
      this.addDot(e);
      return;
    }

    if (this.number === '0') {
      this.number = this.number.replace('0', btn.innerHTML);
    }

    if (this.hasSign(this.signs).hasSign) {
      this.number = this.result.innerHTML.slice(
        this.hasSign(this.signs).pos + 1
      );

      this.number = this.number + btn.innerHTML;

      this.default = this.result.innerHTML.slice(
        0,
        this.hasSign(this.signs).pos + 1
      );
    } else {
      this.number = this.number + btn.innerHTML;
    }

    this.result.innerHTML = this.default;

    this.result.innerHTML =
      this.result.innerHTML +
      this.formatNumber(+this.unformatNumber(this.number));
  }

  addAndChangeSigns(calc: HTMLParagraphElement) {
    this.calculate();

    if (this.restrictBtns(['equals'], calc.id)) return;

    if (this.result.innerHTML.slice(-1) === '.') return;

    this.signs.forEach(sign => {
      if (
        this.prev != calc.innerHTML &&
        this.result.innerHTML.slice(-1).includes(sign)
      ) {
        this.result.innerHTML =
          this.result.innerHTML.slice(0, this.result.innerHTML.length - 1) +
          this.result.innerHTML.slice(-1).replace(this.prev, calc.innerHTML);
        this.prev = calc.innerHTML;
      }
    });

    if (
      this.duplicateSigns(this.result.innerHTML, this.signs) ||
      this.result.innerHTML === ''
    )
      return;

    this.result.innerHTML = this.result.innerHTML + calc.innerHTML;
    this.prev = this.result.innerHTML.slice(-1);
  }

  calculate(): void {
    let resultChanged: string = this.result.innerHTML;
    let positiveResult: string = this.result.innerHTML;

    if (positiveResult.startsWith('-')) {
      positiveResult = positiveResult.slice(1);
    }

    this.signs.forEach(sign => {
      if (
        positiveResult.split(sign).length === 2 &&
        this.hasNumber(positiveResult.split(sign)[0]) &&
        this.hasNumber(positiveResult.split(sign)[1])
      ) {
        this.step.innerHTML = resultChanged;
        resultChanged = this.replaceSigns(resultChanged);

        this.result.innerHTML = this.formatNumber(
          eval(this.unformatNumber(resultChanged))
        );

        this.history.push({
          step: this.step.innerHTML,
          result: this.result.innerHTML,
        });

        localStorage.clear();
        document.querySelector('.history__container--content')!.innerHTML = '';
        this.setLocalStorage();
        this.renderLocalStorage();
      }
    });
  }

  deleteOne() {
    if (this.result.innerHTML.includes('.')) {
      this.number = this.number.slice(0, this.number.length - 1);
    } else {
      this.number = this.number.slice(0, this.number.length - 1);
    }

    this.result.innerHTML = this.formatNumber(
      +this.unformatNumber(this.number)
    );
  }

  addDot(e: any) {
    if (this.number === '') return;
    if (this.duplicateSigns(this.number, ['.'])) return;
    this.number = this.number + e.target.innerHTML;
    this.result.innerHTML = this.default;
    this.result.innerHTML =
      this.result.innerHTML +
      this.formatNumber(+this.unformatNumber(this.number));
  }

  replaceSigns = (resultChanged: string) => {
    if (this.result.innerHTML.includes('×'))
      resultChanged = this.result.innerHTML.replace('×', '*');
    if (this.result.innerHTML.includes('÷'))
      resultChanged = this.result.innerHTML.replace('÷', '/');

    return resultChanged;
  };

  hasSign(signs: string[]) {
    let hasSign = false;
    let pos: number = 0;

    signs.forEach(sign => {
      if (this.result.innerHTML.startsWith('-')) {
        if (this.result.innerHTML.slice(1).includes(sign)) {
          hasSign = true;
          pos = this.result.innerHTML.slice(1).indexOf(sign) + 1;
        }
      } else {
        if (this.result.innerHTML.includes(sign)) {
          hasSign = true;
          pos = this.result.innerHTML.indexOf(sign);
        }
      }
    });
    return { hasSign, pos };
  }

  duplicateSigns = (content: string, signs: string[]) => {
    let bool = false;
    signs.forEach(sign => {
      if (content.startsWith('-')) {
        if (content.slice(1).includes(sign)) {
          bool = true;
        }
      } else if (content.includes(sign)) {
        bool = true;
      }
    });

    return bool;
  };

  formatNumber(number: number) {
    if (number > 999 || number < -999) {
      return number.toLocaleString();
    } else {
      return number.toString();
    }
  }

  unformatNumber(formattedNumber: string) {
    return formattedNumber.replace(/,/g, '');
  }

  hasNumber(str: string) {
    const pattern = /[0-9]/; // regular expression to match any digit from 1 to 9
    return pattern.test(str);
  }

  restrictBtns = (btns: string[], id: string) => {
    let bool = false;
    btns.forEach(btn => {
      if (id === btn) {
        bool = true;
        return;
      }
      return;
    });
    return bool;
  };

  clearLocalStorage() {
    localStorage.removeItem('history');
    location.reload();
  }

  clearResult() {
    if (this.result.innerHTML === '') return;
    this.result.innerHTML = '';
    this.number = '';
    this.default = '';
    this.step.innerHTML = '';
  }

  changeSignOfNumber() {
    if (this.number === '') return;

    if (this.number === '0') return;

    if (this.hasSign(this.signs).hasSign) {
      if (this.number.slice(0, 2).includes('(-')) {
        this.number = this.number.replace('(-', '').slice(0, -1);
      } else {
        this.number = '(-' + this.number + ')';
      }
    } else {
      if (this.number.slice(0, 1).includes('-')) {
        this.number = this.number.replace('-', '');
      } else {
        this.number = '-' + this.number;
      }
    }
    this.result.innerHTML = this.default;
    this.result.innerHTML = this.result.innerHTML + this.number;
  }

  percentageNumber() {
    if (this.result.innerHTML === '') return;

    if (this.result.innerHTML.startsWith('-')) {
      this.result.innerHTML = '-' + +this.result.innerHTML.slice(1) * 0.01;
      return;
    }

    if (!this.hasSign(this.signs).hasSign) {
      this.result.innerHTML = this.formatNumber(
        +this.unformatNumber(this.result.innerHTML) / 100
      );
    }
  }

  // Local Storage

  setLocalStorage() {
    localStorage.setItem('history', JSON.stringify(this.history));
  }

  renderLocalStorage() {
    const data: { step: string; result: string }[] = JSON.parse(
      localStorage.getItem('history')!
    );

    if (!data) return;

    this.history = data;

    data.forEach(el => {
      const html = `<div class="history__container--content__item">
          ${el.step}<br />
          =${el.result}
          </div>`;

      document
        .querySelector('.history__container--content')!
        .insertAdjacentHTML('afterbegin', html);
    });
  }
}

new App();

class Validation {
  constructor(public number: string, public result: HTMLParagraphElement) {}

  validateNumber() {
    if (this.number.length > 15) return true;
    if (this.number.length > 12) {
      this.result.style.fontSize = '4rem';
      return false;
    }

    this.result.style.fontSize = '5rem';

    return false;
  }
}
