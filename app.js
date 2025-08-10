// app.js: main JavaScript for the Music Theory App

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Audio initialization
  const startButton = document.getElementById('start-audio');
  let synth;
  let audioStarted = false;

  // Create keys for one octave from C4 to B4
  const keys = [
    { note: 'C4', isBlack: false },
    { note: 'C#4', isBlack: true },
    { note: 'D4', isBlack: false },
    { note: 'D#4', isBlack: true },
    { note: 'E4', isBlack: false },
    { note: 'F4', isBlack: false },
    { note: 'F#4', isBlack: true },
    { note: 'G4', isBlack: false },
    { note: 'G#4', isBlack: true },
    { note: 'A4', isBlack: false },
    { note: 'A#4', isBlack: true },
    { note: 'B4', isBlack: false },
  ];

  const pianoContainer = document.getElementById('piano');

  // Render piano keys
  keys.forEach(key => {
    const div = document.createElement('div');
    div.classList.add('piano-key');
    if (key.isBlack) div.classList.add('black');
    div.textContent = key.note;
    div.addEventListener('click', () => {
      if (!audioStarted) return;
      if (synth) {
        synth.triggerAttackRelease(key.note, '8n');
      }
    });
    pianoContainer.appendChild(div);
  });

  // Start audio context on button click
  startButton.addEventListener('click', async () => {
    if (!audioStarted) {
      await Tone.start();
      synth = new Tone.Synth().toDestination();
      audioStarted = true;
      startButton.textContent = 'Audio Started';
      startButton.disabled = true;
    }
  });

  // Draw notation using VexFlow
  function renderNotation() {
    const staffDiv = document.getElementById('staff');
    // Clear any existing notation
    staffDiv.innerHTML = '';
    const VF = Vex.Flow;
    // Create an SVG renderer and attach it to the DIV
    const renderer = new VF.Renderer(staffDiv, VF.Renderer.Backends.SVG);
    renderer.resize(500, 200);
    const context = renderer.getContext();
    // Create a stave at x=10, y=40 of width 480 on the staff
    const stave = new VF.Stave(10, 40, 480);
    stave.addClef('treble');
    stave.setContext(context).draw();
    // Create notes for a C major scale
    const notes = [
      new VF.StaveNote({ keys: ['c/4'], duration: 'q' }),
      new VF.StaveNote({ keys: ['d/4'], duration: 'q' }),
      new VF.StaveNote({ keys: ['e/4'], duration: 'q' }),
      new VF.StaveNote({ keys: ['f/4'], duration: 'q' }),
      new VF.StaveNote({ keys: ['g/4'], duration: 'q' }),
      new VF.StaveNote({ keys: ['a/4'], duration: 'q' }),
      new VF.StaveNote({ keys: ['b/4'], duration: 'q' }),
      new VF.StaveNote({ keys: ['c/5'], duration: 'q' }),
    ];
    // Create a voice in 4/4 and add notes
    const voice = new VF.Voice({ num_beats: 8, beat_value: 4 });
    voice.addTickables(notes);
    // Format and justify the notes to 450 pixels
    const formatter = new VF.Formatter().joinVoices([voice]).format([voice], 450);
    // Render voice
    voice.draw(context, stave);
  }
  renderNotation();

  // Simple chat placeholder
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatMessages = document.getElementById('chat-messages');

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatSend.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage('You', text);
    chatInput.value = '';
    // Placeholder for AI response
    setTimeout(() => {
      appendMessage('AI', 'This is a placeholder response.');
    }, 500);
  });
});
