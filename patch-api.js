const fs = require('fs');
let content = fs.readFileSync('src/app/api/interns/me/route.ts', 'utf8');

const replacement = `      data: {
        bio: data.bio !== undefined ? data.bio : internProfile.bio,
        name: data.name !== undefined ? data.name : internProfile.name,
        idCardNumber: data.idCardNumber !== undefined ? data.idCardNumber : internProfile.idCardNumber,
        phone: data.phone !== undefined ? data.phone : internProfile.phone,
        address: data.address !== undefined ? data.address : internProfile.address,
        likesCorporate: data.likesCorporate !== undefined ? data.likesCorporate : internProfile.likesCorporate,
        dislikesCorporate: data.dislikesCorporate !== undefined ? data.dislikesCorporate : internProfile.dislikesCorporate,
        instagramId: data.instagramId !== undefined ? data.instagramId : internProfile.instagramId,
        linkedInId: data.linkedInId !== undefined ? data.linkedInId : internProfile.linkedInId,
        githubId: data.githubId !== undefined ? data.githubId : (internProfile as any).githubId,
      }`;

content = content.replace(/      data: \{[\s\S]*?githubId.*?\n      \}/, replacement);
fs.writeFileSync('src/app/api/interns/me/route.ts', content, 'utf8');
console.log("Patched API!");
