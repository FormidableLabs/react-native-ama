const text = 'This is `code` and **bold** text.';
const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
console.log(parts);

const text2 = '`start` and **end**';
console.log(text2.split(/(`[^`]+`|\*\*[^*]+\*\*)/g));

const text3 = 'No markdown';
console.log(text3.split(/(`[^`]+`|\*\*[^*]+\*\*)/g));
