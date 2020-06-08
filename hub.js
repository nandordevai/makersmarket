const ns = 'http://www.w3.org/2000/svg';
const uploadURL = 'https://makersmarket.xyz/upload';
const bgColor = 'rgb(7, 11, 26)';
const lineColor = 'rgb(250, 240, 202)';
const width = document.querySelector('#hub').getBoundingClientRect().width;
const height = document.querySelector('#hub').getBoundingClientRect().height;
const cityNames = ['Liverpool', 'Glasgow', 'London', 'Birmingham', 'Manchester'];
const hubD = 55;
const svg = document.querySelector('#hub');

class SVGElement {
    createElement(name, options = {}) {
        const el = document.createElementNS(ns, name);
        Object.entries(options).forEach(([option, value]) => {
            el.setAttributeNS(null, option, value);
        });
        return el;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.el.setAttributeNS(null, 'transform', `translate(${x}, ${y})`);
    }

    getPosition() {
        return [this.x, this.y];
    }
}

class Hub extends SVGElement {
    constructor(options) {
        super();
        this.iconSize = 32;
        this.el = this.createElement('g', {
            'class': 'link hub',
            transform: `translate(${options.cx - width / 2}, ${options.cy - width / 2})`,
        });
        this.setPosition(options.cx - width / 2, options.cy - width / 2);
        this.el.appendChild(this.createElement('circle', {
            ...options,
            'class': 'hub-border',
        }));
        const text = this.createElement('text', {
            x: options.cx,
            y: options.cy + 25,
            fill: lineColor,
            'text-anchor': 'middle',
            'font-family': 'Roboto',
            'font-size': '12px',
        });
        text.appendChild(document.createTextNode('Upload'));
        this.el.appendChild(text);
        this.el.appendChild(this.createElement('image', {
            x: options.cx - this.iconSize / 2,
            y: options.cy - this.iconSize / 2 - 10,
            width: this.iconSize,
            height: this.iconSize,
            href: 'upload.svg',
        }));
    }
}

class City extends SVGElement {
    constructor(options) {
        super();
        this.lineX = options.lineX;
        this.lineY = options.lineY;
        this.iconSize = 24;
        this.opacity = 0.5;
        this.el = this.createElement('g', {
            'class': 'link',
        });
        this.el.appendChild(this.createElement('line', {
            x1: options.cx,
            y1: options.cy,
            x2: this.lineX,
            y2: this.lineY,
            stroke: lineColor,
            opacity: this.opacity,
        }));
        this.el.appendChild(this.createElement('circle', {
            cx: options.cx,
            cy: options.cy,
            r: 25,
            fill: bgColor,
            stroke: lineColor,
            'transform-origin': `${options.cx}px ${options.cy}px`,
        }));
        const text = this.createElement('text', {
            x: options.cx,
            y: options.cy + 40,
            fill: lineColor,
            'text-anchor': 'middle',
            'font-family': 'Roboto',
            'font-size': '12px',
        });
        text.appendChild(document.createTextNode(options.label));
        this.el.appendChild(text);
        this.el.appendChild(this.createElement('image', {
            x: options.cx - this.iconSize / 2,
            y: options.cy - this.iconSize / 2,
            width: this.iconSize,
            height: this.iconSize,
            href: 'laser.svg',
        }));
        this.el.addEventListener('click', () => {
            window.location = uploadURL;
        });
    }
}

const cities = cityNames.map((name, i) => {
    const c = hubD * Math.cos(2 * Math.PI / cityNames.length * i) + width / 2;
    const s = hubD * Math.sin(2 * Math.PI / cityNames.length * i) + width / 2;
    return new City({
        lineX: c,
        lineY: s,
        cx: c * 2 - width / 2,
        cy: s * 2 - width / 2,
        label: name,
        'class': 'link',
    });
});

const hub = new Hub({
    cx: width / 2,
    cy: height / 2,
    r: hubD,
    fill: 'rgb(22, 27, 44)',
    stroke: lineColor,
    'stroke-dasharray': '7, 7',
    'class': 'link',
});

cities.forEach((city) => { svg.appendChild(city.el); });
svg.appendChild(hub.el);
