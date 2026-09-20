const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Replace high-poly geometry with lower-poly
content = content.replace(
  '<torusKnotGeometry args={[1, 0.3, 256, 64, 2, 3]} />',
  '<torusKnotGeometry args={[1, 0.3, 128, 32, 2, 3]} />'
);

// Replace MeshTransmissionMaterial with MeshPhysicalMaterial for huge performance boost
const heavyMaterialRegex = /<MeshTransmissionMaterial[\s\S]*?transmission=\{0\.9\}[\s\S]*?\/>/;
const fastMaterial = `<meshPhysicalMaterial 
          color="#8A2BE2"
          transmission={0.9}
          opacity={1}
          metalness={0.1}
          roughness={0.1}
          ior={1.5}
          thickness={0.5}
          transparent={true}
        />`;

content = content.replace(heavyMaterialRegex, fastMaterial);

fs.writeFileSync('src/app/dashboard/page.tsx', content, 'utf8');
console.log('Optimized 3D scene in dashboard!');
