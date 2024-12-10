export const getMostUsedColorFromFile = (file: File) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target!.result as string;
    };

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx!.drawImage(img, 0, 0);
      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const colorCounts = {} as any;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a > 0) {
          const color = `rgb(${r},${g},${b})` ;
          colorCounts[color] = (colorCounts[color]  || 0) + 1;
        }
      }

      let mostColor = "";
      let maxCount = 0;
      for (const color in colorCounts) {
        if (colorCounts[color] > maxCount) {
          mostColor = color;
          maxCount = colorCounts[color];
        }
      }

      resolve(mostColor);
    };

    img.onerror = () => reject("Error loading image");
    reader.onerror = () => reject("Error reading file");

    reader.readAsDataURL(file);
  });
};
