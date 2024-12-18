// app.js

class AudioBackend {
    constructor(){
        this.audioContext = null;
        this.audioBuffer = null;
        this.audioSource = null;
        this.gainNode = null;
        this.ended = false;
        this.gain = 0.5;
    }


    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    createBuffer(numChannels, frameCount, sampleRate) {
        if (!this.audioContext) {
            return;
        }

        this.audioBuffer = this.audioContext.createBuffer(numChannels, frameCount, this.audioContext.sampleRate);
        console.log('Audio buffer created');
    }

    fillBuffer(lazerBuffer) {
        if (!this.audioBuffer) {
            console.log('no buffer');
            return;
        }

        for (let channel = 0; channel < this.audioBuffer.numberOfChannels; channel++) {
            let channelData = this.audioBuffer.getChannelData(channel);

            for (let i = 0; i < this.audioBuffer.length; ++i) {
                channelData[i] = lazerBuffer.get(i);
            }
        }
    }

    playSound() {
        if (!this.audioBuffer) {
            return;
        }

        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = this.audioBuffer;

        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = this.gain;

        this.audioSource.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        this.audioSource.start();

        this.audioSource.onended = () => {
            // console.log('klaar met spelen');
            this.ended = true;
        }

        // console.log('FIRING MY LASER');
    }


    stopSound() {
        if (this.audioSource) {
            this.audioSource.stop();
            this.audioSource.disconnect();
            this.gainNode.disconnect();
            this.audioSource = null;
            this.gainNode = null;
        }
    }
    setGain(newGain){
        if(newGain <=1 && newGain >=0){
            this.gain = newGain;
            if(!!this.gainNode){
            this.gainNode.gain.linearRampToValueAtTime(this.gain, this.audioContext.currentTime + 0.05);
            }
        }
    }

    getSampleRate(){
        return this.audioContext.sampleRate;
    }
    getAudioContextState(){
        return this.audioContext.state;
    }

    getAudioSourceState() {
        return this.audioSource.state;
    }

    getAudioSourceEnded(){
        return this.ended;
    }


}