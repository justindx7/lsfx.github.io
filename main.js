let laserParameters = [];
let oldLaserParameters = [];
let buffer = [];
let audioBackend;
let laserTypes = ["classic", "blaster", "burst"];
let playing = false;

let LaserParameters = {
    sampleRate: 48000,
    speed: 0.5,
    distortion: 0
};

const ModulePromise = new Promise(resolve => {
    Module = {
        onRuntimeInitialized: function() {
            resolve(Module);
        }
    };
});

async function main() {
    const pages = ['burst', 'classic'];

    try {
	if(pages.some(page => window.location.href.includes(page))) {
	   const Module = await ModulePromise;
           console.log("done")
	}

        audioBackend = new AudioBackend();
        audioBackend.initAudioContext();


        handleSliders(audioBackend);

	if(pages.some(page => window.location.href.includes(page))) {
           buffer = generateBuffer(Module);
	}

        LaserParameters.sampleRate = audioBackend.getSampleRate();


    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main().catch(error => {
    console.error("An error occurred in main:", error);
});

function playPause() {
    if (audioBackend.getAudioContextState() === "suspended") {
        audioBackend.audioContext.resume();
    }
    if (audioBackend.ended) {
        playing = false;
    }

    if (playing === false) {
        playing = true;
        audioBackend.ended = false;
        audioBackend.playSound();

    } else if (playing === true) {
        playing = false;
        audioBackend.stopSound();
    }
}


function handleSliders(audioBackend){
    const gainSlider = document.getElementById("volume");
    gainSlider.oninput = () => {audioBackend.setGain(gainSlider.value)};
}

function generateBuffer (Module){
    let audioBuffer;
    try {
        if(laserParameters.length > 0) {
            audioBuffer = new Module.generate(laserParameters[0],laserParameters[1],laserParameters[2],laserParameters[3],laserParameters[4],laserParameters[5],laserParameters[6],laserParameters[7]);
        } else {
            audioBuffer = new Module.generate(3,5,3,1,2,2,25,100);
        }


    } catch (error) {
        console.error("An error occurred:", error);
    }
    audioBackend.createBuffer(1,audioBuffer.size(),audioBackend.getSampleRate());
    audioBackend.fillBuffer(audioBuffer);
    return audioBuffer;
}

const surveyResults = {
    survey1: [],
    survey2: [],
    survey3: []
};

function updateSliderValue(slider) {
    const valueDisplay = slider.nextElementSibling.nextElementSibling;
    valueDisplay.textContent = slider.value;
}

function goToSurvey(surveyId) {
    document.getElementById('homepage').style.display = 'none';
    document.getElementById(surveyId).style.display = 'block';
}

function goToHomepage() {
    document.querySelectorAll('.survey-page').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById('homepage').style.display = 'flex';
}

function submitSurvey(surveyId,play) {
    let playButton = /^true$/i.test(play);
    laserParameters = [];
    const survey = document.getElementById(surveyId);
    const radioGroups = survey.querySelectorAll('.radio-input-wrapper');
    const sliderGroups = survey.querySelectorAll('.slider-container');
    const surveyAnswers = [];

    // Check radio groups
    radioGroups.forEach(group => {
        const selectedRadio = group.querySelector('input:checked');
        if (selectedRadio) {
            surveyAnswers.push(selectedRadio.value);
        } else {
            surveyAnswers.push(1);
        }
    });

    // Check slider groups
    sliderGroups.forEach(group => {
        const slider = group.querySelector('input[type="range"]');
        surveyAnswers.push(slider.value);
    });

    if (surveyAnswers.length === radioGroups.length + sliderGroups.length) {
        surveyResults[surveyId] = surveyAnswers;

        laserParameters[0] = parseInt(surveyId);
        for(let i = 0; i < surveyResults[surveyId].length; ++i) {
           laserParameters[i + 1] = parseInt(surveyResults[surveyId][i]);
        }

        if(surveyId === "1") {
            laserParameters.splice(4, 0, 0, 0);
        }
        if(surveyId === "3") {
            laserParameters.splice(1, 0, laserParameters[4]);
            laserParameters.splice(5, 1);

        }

        if(playButton) {
            if (JSON.stringify(oldLaserParameters) !== JSON.stringify(laserParameters)) {
                console.log("generating Buffer");
                buffer = generateBuffer(Module);
                oldLaserParameters = laserParameters;
            }
            playPause();
        } else {
            buffer = generateBuffer(Module);
        }
    }
}

function handleDownloadWav(){
    AudioExporter.exportWAV(audioBackend.audioBuffer, laserTypes[laserParameters[0] - 1] + "_laser.wav");
}



function playDemo() {
    const soundFolder = "laserdemosoundfiles";
    const fileCount = 4;
    const soundFiles = Array.from({ length: fileCount }, (_, i) => `sound${i + 1}.mp3`);

    const randomFile = soundFiles[Math.floor(Math.random() * soundFiles.length)];

    const filePath = `${soundFolder}/${randomFile}`;

    if (audioBackend.getAudioContextState() === "suspended") {
        audioBackend.audioContext.resume();
    }

    this.audioElement = new Audio(filePath);
    if (this.audioElement) {
            this.audioElement.play();
    }
}
