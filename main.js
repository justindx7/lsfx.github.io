let laserParameters = [];
let buffer = [];
let audioBackend;
let laserTypes = ["classic", "blaster", "burst"];
const ModulePromise = new Promise(resolve => {
    Module = {
        onRuntimeInitialized: function() {
            resolve(Module);
        }
    };
});

async function main() {
    try {
        const Module = await ModulePromise;
        console.log("done")

        audioBackend = new AudioBackend();
        audioBackend.initAudioContext();


        handleSliders(audioBackend);
        handlePlayPauseClick(audioBackend, Module);
        buffer = generateBuffer(Module);


        LaserParameters.sampleRate = audioBackend.getSampleRate();


    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main().catch(error => {
    console.error("An error occurred in main:", error);
});

function handlePlayPauseClick(audioBackend, Module) {
    const playPauseButtons = document.getElementsByClassName("playPause");
    for (let i = 0; i < playPauseButtons.length; i++) {
        playPauseButtons[i].addEventListener("click", () => {
            console.log("Daggoe");

            if (audioBackend.getAudioContextState() === "suspended") {
                    audioBackend.audioContext.resume();
                }
                //TODO ELKE KLIK EFFE KIJKEN OF DIE GUY GEQUIT IS
                if (audioBackend.ended) {
                    playPauseButtons[i].dataset.playing = "false";

                }

                if ( playPauseButtons[i].dataset.playing === "false") {
                    playPauseButtons[i].dataset.playing = "true";

                    audioBackend.ended = false;

                    audioBackend.playSound();

                } else if ( playPauseButtons[i].dataset.playing === "true") {
                    playPauseButtons[i].dataset.playing = "false";
                    audioBackend.stopSound();
                }

            }, false
        );
    }
}



let LaserParameters = {
    sampleRate: 48000,
    speed: 0.5,
    distortion: 0
};

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

function submitSurvey(surveyId) {
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

        buffer = generateBuffer(Module);

    }
}

function handleDownloadWav(){
    AudioExporter.exportWAV(audioBackend.audioBuffer, laserTypes[laserParameters[0] - 1] + "_laser.wav");
}
