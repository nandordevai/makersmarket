const ns = 'http://www.w3.org/2000/svg';
const uploadURL = 'https://makersmarket.xyz/upload';
const bgColor = 'rgb(7, 11, 26)';
const lineColor = 'rgb(250, 240, 202)';
const width = document.querySelector('#hub').getBoundingClientRect().width;
const height = document.querySelector('#hub').getBoundingClientRect().height;
const linkMainText = 'Links';
const linkOptions = [
    {
        title: 'Option X',
        url: 'https://makersmarket.xyz/link1',
        letter: 'X',
    },
    {
        title: 'Option Y',
        url: 'https://makersmarket.xyz/link2',
        letter: 'Y',
    },
    {
        title: 'Option Z',
        url: 'https://makersmarket.xyz/link3',
        letter: 'Z',
    },
];
const hubD = 55;
const svg = document.querySelector('#links');

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
        text.appendChild(document.createTextNode(linkMainText));
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

class Link extends SVGElement {
    constructor(options) {
        super();
        this.lineX = options.lineX;
        this.lineY = options.lineY;
        this.iconSize = 24;
        this.opacity = 0.5;
        this.url = options.url;
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
            'class': 'link-border',
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
        const letter = this.createElement('text', {
            x: options.cx,
            y: options.cy + 8,
            fill: lineColor,
            'text-anchor': 'middle',
            'font-family': 'Roboto',
            'font-size': '24px',
        });
        letter.appendChild(document.createTextNode(options.letter));
        this.el.appendChild(letter);
        this.el.addEventListener('click', () => {
            window.location = this.url;
        });
    }
}

const links = linkOptions.map((option, i) => {
    const phi = 2 * Math.PI / linkOptions.length * i / 2 + Math.PI / 6;
    const c = hubD * Math.cos(phi) + width / 2;
    const s = hubD * Math.sin(phi) + width / 2;
    return new Link({
        lineX: c,
        lineY: s,
        cx: c * 2 - width / 2,
        cy: s * 2 - width / 2,
        label: option.title,
        'class': 'link',
        url: option.url,
        letter: option.letter
    });
});

const hub = new Hub({
    cx: width / 2,
    cy: height / 2,
    r: hubD,
    fill: 'rgb(22, 27, 44)',
    stroke: lineColor,
    'stroke-dasharray': '7, 7',
});

links.forEach((link) => { svg.appendChild(link.el); });
svg.appendChild(hub.el);
