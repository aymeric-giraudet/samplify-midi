// Import stylesheets
import './style.css';
import Tone from "tone"
import { Midi } from "@tonejs/midi";

var pulseOptions = {
  oscillator:{
  	type: "pulse"
  },
  envelope:{
    release: 0.07
  }
};

var triangleOptions = {
  oscillator:{
  	type: "triangle"
  },
  envelope:{
    release: 0.07
  }
};

var squareOptions = {
  oscillator:{
  	type: "square"
  },
  envelope:{
    release: 0.07
  }
};

var pulseSynth    = new Tone.Synth(pulseOptions).toMaster();
var squareSynth   = new Tone.Synth(squareOptions).toMaster();
var triangleSynth = new Tone.Synth(triangleOptions).toMaster();
var noiseSynth    = new Tone.NoiseSynth().toMaster();

function handleFiles() {
  var fr = new FileReader();
  fr.onload = function() {
    var data = fr.result;
    playMidi(data);
  };
  fr.readAsArrayBuffer(this.files[0]);
}

var inputElement = document.getElementById('midiFile');
inputElement.addEventListener("change", handleFiles, false);

async function playMidi(file) {
  // load a midi file in the browser
  const midi = new Midi(file)
  //the file name decoded from the first track
  const name = midi.name
  const now = Tone.now() + 0.5
  //get the tracks
  midi.tracks.forEach(track => {
    let synth;
    switch(track.name) {
      case "p1":
        synth = pulseSynth;
        break;
      case "p2":
        synth = squareSynth;
        break;
      case "tr":
        synth = triangleSynth;
        break;
      default:
       synth = noiseSynth;
       break;
    }
    console.log(track)
    //tracks have notes and controlChanges

    //notes are an array
    const notes = track.notes
    notes.forEach(note => {
      synth.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity)
    })
  })
}