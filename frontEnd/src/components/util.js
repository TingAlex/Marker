export function pickImages(count = 3) {
  const sampleImages = [
    "https://i.loli.net/2019/05/18/5cdf7337684b137743.jpg",
    "https://i.loli.net/2019/05/18/5cdf73389476781828.jpg",
    "https://i.loli.net/2019/05/18/5cdf73390681e30227.jpg",
    "https://i.loli.net/2019/05/18/5cdf733a3fda854952.jpg",
    "https://i.loli.net/2019/05/18/5cdf733a7a2a985839.jpg"
  ];
  let images = Object.assign([], sampleImages);
  let result = [];

  (function get() {
    if (count <= 0) return;
    result.push(images.splice(Math.floor(Math.random() * images.length), 1)[0]);
    count--;
    get();
    if (count >= 1) get();
  })();

  return result;
}
