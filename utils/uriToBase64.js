const urlToBlob = async url => {
  return new Promise(async (resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) resolve(xhr.response);
    };
    xhr.onerror = reject;
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
};

const uriToBase64 = uri =>
  new Promise(async (resolve, reject) => {
    let data = await urlToBlob(uri);
    let reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = function () {
      resolve(reader.result);
    };
  });

export default uriToBase64;
