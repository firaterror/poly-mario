const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a simple texture generator
function createTexture(filename, width, height, draw) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Apply the drawing function
  draw(ctx, width, height);
  
  // Save the canvas to a file
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(filename, buffer);
  
  console.log(`Created texture: ${filename}`);
}

// Create grass texture
createTexture('grass.jpg', 512, 512, (ctx, width, height) => {
  // Base color
  ctx.fillStyle = '#7CBA45';
  ctx.fillRect(0, 0, width, height);
  
  // Add some variation
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 1 + Math.random() * 3;
    
    ctx.fillStyle = Math.random() > 0.5 ? '#8ECC5C' : '#6A9D3B';
    ctx.fillRect(x, y, size, size);
  }
});

// Create road texture
createTexture('road.jpg', 512, 512, (ctx, width, height) => {
  // Base color
  ctx.fillStyle = '#505050';
  ctx.fillRect(0, 0, width, height);
  
  // Add some variation
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 1 + Math.random() * 2;
    
    ctx.fillStyle = Math.random() > 0.5 ? '#454545' : '#555555';
    ctx.fillRect(x, y, size, size);
  }
});

// Create dirt texture
createTexture('dirt.jpg', 512, 512, (ctx, width, height) => {
  // Base color
  ctx.fillStyle = '#C6A664';
  ctx.fillRect(0, 0, width, height);
  
  // Add some variation
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 1 + Math.random() * 4;
    
    ctx.fillStyle = Math.random() > 0.5 ? '#D6B674' : '#B69654';
    ctx.fillRect(x, y, size, size);
  }
});

console.log('All textures created successfully!'); 