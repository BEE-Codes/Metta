function parseValue(value) {
const hasDollar = value.includes('$');
const hasB = value.toUpperCase().includes('B');
const hasM = value.toUpperCase().includes('M');
const hasPlus = value.includes('+');

let numericPart = value.replace(/[^0-9.]/g, '');
let multiplier = 1;

if (hasB) multiplier = 1_000_000_000;
else if (hasM) multiplier = 1_000_000;

const final = parseFloat(numericPart) * multiplier;

return {
    final,
    format: (val) => {
    if (hasDollar && hasB) return `$${Math.round(val / 1_000_000_000)}B`;
    if (hasDollar && hasM) return `$${Math.round(val / 1_000_000)}M`;
    if (hasM) return `${Math.round(val / 1_000_000)}M${hasPlus ? '+' : ''}`;
    if (hasPlus) return `${Math.round(val)}+`;
    return Math.round(val).toLocaleString();
    }
};
}

function animateCounter(el) {
const targetRaw = el.getAttribute('data-target');
const { final, format } = parseValue(targetRaw);

let count = 0;
const duration = 2000;
const frameRate = 30;
const increment = final / (duration / frameRate);

const update = () => {
    count += increment;
    if (count < final) {
    el.innerText = format(count);
    requestAnimationFrame(update);
    } else {
    el.innerText = format(final);
    }
};

update();
}

const counters = document.querySelectorAll('#countUp span[data-target]');

const observer = new IntersectionObserver((entries, obs) => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
    animateCounter(entry.target);
    obs.unobserve(entry.target);
    }
});
}, { threshold: 0.5 });

counters.forEach(counter => observer.observe(counter));

