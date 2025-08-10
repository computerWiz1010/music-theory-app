/*
 * Music Theory App - React implementation with Material‑UI
 *
 * This script defines a simple React application that introduces a modular
 * lesson structure. Users can switch between different lesson types (e.g.
 * Piano basics, Scales, Chords) using Material‑UI tabs. The Piano lesson
 * includes an interactive keyboard and a notation example rendered with
 * VexFlow. The other lessons currently display placeholder content and can
 * be expanded in the future. Tone.js handles audio synthesis for the
 * interactive piano. Material‑UI is loaded via UMD builds and is available
 * through the global `MaterialUI` object. Icons are available via
 * `MaterialUIIcons` if needed.
 */

// Destructure commonly used components from the global MaterialUI object.
const {
  Button,
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography
} = MaterialUI;

/**
 * Renders a musical notation example using VexFlow. This component
 * executes its drawing logic once on mount via the useEffect hook.
 */
function NotationExample() {
  React.useEffect(() => {
    // Find or create the container div for the notation
    const containerId = 'notation-container';
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }
    // Clear any previous notation
    container.innerHTML = '';
    // Draw a simple C major scale on a treble stave
    const VF = Vex.Flow;
    const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
    renderer.resize(500, 200);
    const context = renderer.getContext();
    const stave = new VF.Stave(10, 40, 480);
    stave.addClef('treble');
    stave.setContext(context).draw();
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
    const voice = new VF.Voice({ num_beats: 8, beat_value: 4 });
    voice.addTickables(notes);
    new VF.Formatter().joinVoices([voice]).format([voice], 450);
    voice.draw(context, stave);
  }, []);
  return <div id="notation-container"></div>;
}

/**
 * Renders an interactive piano keyboard using Tone.js. It also includes
 * a button to start the audio context. Piano keys are styled inline,
 * based on whether they are white or black keys. Clicking a key
 * triggers a short note via Tone.js.
 */
function PianoLesson() {
  const [synth, setSynth] = React.useState(null);
  const [audioStarted, setAudioStarted] = React.useState(false);
  // Define one octave of keys (C4 to B4)
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
  // Initialise the audio context and synth on first click
  const startAudio = async () => {
    if (!audioStarted) {
      await Tone.start();
      const s = new Tone.Synth().toDestination();
      setSynth(s);
      setAudioStarted(true);
    }
  };
  // Play the note when a key is clicked
  const handleKeyClick = (note) => {
    if (synth) {
      synth.triggerAttackRelease(note, '8n');
    }
  };
  // Styles for the piano keys
  const whiteKeyStyle = {
    position: 'relative',
    width: '40px',
    height: '150px',
    margin: '1px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 2px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    fontSize: '0.7rem',
    color: '#333333'
  };
  const blackKeyStyle = {
    ...whiteKeyStyle,
    width: '30px',
    height: '100px',
    marginLeft: '-15px',
    marginRight: '-15px',
    zIndex: 1,
    backgroundColor: '#333333',
    color: '#eeeeee'
  };
  return (
    <Box p={2}>
      <Typography variant="h5" component="h2" gutterBottom>
        Piano Basics
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={startAudio}
        disabled={audioStarted}
      >
        {audioStarted ? 'Audio Started' : 'Start Audio'}
      </Button>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '1rem'
        }}
      >
        {keys.map((key) => (
          <div
            key={key.note}
            onClick={() => handleKeyClick(key.note)}
            style={key.isBlack ? blackKeyStyle : whiteKeyStyle}
          >
            {key.note}
          </div>
        ))}
      </div>
      <Box mt={4}>
        <Typography variant="h6" component="h3" gutterBottom>
          Notation Example
        </Typography>
        <NotationExample />
      </Box>
    </Box>
  );
}

/**
 * Placeholder lesson for scales. Currently displays a heading and
 * description. You can expand this component to include interactive
 * scale visualisations and exercises.
 */
function ScalesLesson() {
  return (
    <Box p={2}>
      <Typography variant="h5" component="h2" gutterBottom>
        Scales
      </Typography>
      <Typography variant="body1">
        This lesson will cover major and minor scales, modes, and other
        scale types. Interactive exercises will be added here in the
        future.
      </Typography>
    </Box>
  );
}

/**
 * Placeholder lesson for chords. Currently displays a heading and
 * description. You can expand this component to include chord
 * construction tools and playback.
 */
function ChordsLesson() {
  return (
    <Box p={2}>
      <Typography variant="h5" component="h2" gutterBottom>
        Chords
      </Typography>
      <Typography variant="body1">
        This lesson will explore triads, seventh chords, and extended
        harmonies. Interactive chord builders will be added here in
        the future.
      </Typography>
    </Box>
  );
}

/**
 * Main application component. Renders a Material‑UI AppBar with tabs
 * allowing the user to switch between lessons. Depending on the
 * selected tab, the corresponding lesson component is displayed.
 */
function App() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="lesson tabs">
          <Tab label="Piano" />
          <Tab label="Scales" />
          <Tab label="Chords" />
        </Tabs>
      </AppBar>
      {/* Render the selected lesson */}
      {value === 0 && <PianoLesson />}
      {value === 1 && <ScalesLesson />}
      {value === 2 && <ChordsLesson />}
    </div>
  );
}

// Render the application into the root container
ReactDOM.render(<App />, document.getElementById('root'));
