const { createCanvas, Image } = require('canvas');
const { readFile } = require('fs/promises');

async function generateCanvas(img,width,height) {
    const canvas = createCanvas(width,height);
    const context = canvas.getContext('2d');
    
    const background = await readFile(img);
    const backgroundImage = new Image();
    backgroundImage.src = background;
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    return {canvas, context};
}

async function generateDiceCanvas(result) {
    const {canvas, context} = await generateCanvas('images/d20.png', 200, 200);

    context.fillStyle = '#ffffff';
    context.font = '60px sans';
    context.textAlign = "center";
    context.fillText(result, canvas.width / 2.05, canvas.height / 1.65);
    //context.strokeText(result, canvas.width / 2.05, canvas.height / 1.65);

    buffer = canvas.toBuffer('image/png');
    return {canvas, context, buffer};
}

module.exports = {
    generateCanvas,
    generateDiceCanvas
};
//module.exports = generateDiceCanvas;