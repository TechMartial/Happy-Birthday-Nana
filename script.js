document.getElementById('openCardButton').addEventListener('click', function() {
  document.querySelector('.card-container').classList.add('flipped');
  document.getElementById('birthdaySong').play();
});

document.getElementById('revealSurpriseButton').addEventListener('click', function() {
  document.querySelector('.card-container').classList.add('surprise');
  setupMicrophone();
});

function blowCandles() {
  document.querySelectorAll('.flame').forEach(flame => {
    flame.style.display = 'none';
  });
  const surprisePage = document.querySelector('.surprise-page');
  surprisePage.style.backgroundColor = '#ff4081';
  surprisePage.innerHTML += '<p>🎉😘Happy Birthday, Nannaa!😘🎉</p>';
  const blastEffect = document.createElement('div');
  blastEffect.classList.add('blast-effect');
  surprisePage.appendChild(blastEffect);
  document.getElementById('kissSound').play();
}

function setupMicrophone() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const javascriptNode = audioContext.createScriptProcessor(256, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = function() {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          const average = array.reduce((a, b) => a + b, 0) / array.length;

          // Adjust the threshold based on microphone sensitivity
          if (average > 100) {
            blowCandles();
          }
        };
      })
      .catch(function(err) {
        console.error('Error accessing microphone: ' + err);
      });
  } else {
    alert('Microphone not supported in your browser');
  }
}
