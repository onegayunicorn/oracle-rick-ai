const API = (location.protocol === 'file:' ? 'http://localhost:8090' : '');
const dz = document.getElementById('dropzone');
const fileInput = document.getElementById('file');
const status = document.getElementById('status');
const result = document.getElementById('result');

async function upload(file) {
  status.textContent = `Converting ${file.name}…`;
  const fd = new FormData();
  fd.append('file', file);
  try {
    const res = await fetch(`${API}/api/convert`, { method: 'POST', body: fd });
    const data = await res.json();
    if (data.error) { status.textContent = 'Error: ' + data.error; return; }
    status.textContent = 'Done.';
    result.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (e) {
    status.textContent = 'Is the converter API running? (make serve) ' + e.message;
  }
}

['dragover', 'dragenter'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('over'); }));
['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('over'); }));
dz.addEventListener('drop', (e) => e.dataTransfer.files[0] && upload(e.dataTransfer.files[0]));
fileInput.addEventListener('change', (e) => e.target.files[0] && upload(e.target.files[0]));
