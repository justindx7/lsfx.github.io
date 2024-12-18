// Utility to convert AudioBuffer to WAV file
class AudioExporter {
    /**
     * Convert an AudioBuffer to a WAV file for download
     * @param {AudioBuffer} audioBuffer - The audio buffer to convert
     * @param {string} [filename] - Name of the output file
     */
    static exportWAV(audioBuffer, filename ) {
        // Create an OfflineAudioContext to render the audio buffer
        const offlineCtx = new OfflineAudioContext(
            audioBuffer.numberOfChannels,
            audioBuffer.length,
            audioBuffer.sampleRate
        );

        // Create a buffer source from the original audio buffer
        const source = offlineCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineCtx.destination);
        source.start();

        // Render the audio to a new buffer
        return offlineCtx.startRendering().then(renderedBuffer => {
            // Convert the rendered buffer to WAV
            const wavBlob = this.bufferToWAV(renderedBuffer);

            // Create a download link
            const url = URL.createObjectURL(wavBlob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            return wavBlob;
        });
    }

    /**
     * Convert an AudioBuffer to a WAV Blob
     * @param {AudioBuffer} buffer - The audio buffer to convert
     * @returns {Blob} WAV file blob
     */
    static bufferToWAV(buffer) {
        const numOfChan = buffer.numberOfChannels;
        const length = buffer.length * numOfChan * 2 + 44;
        const wav = new ArrayBuffer(length);
        const view = new DataView(wav);

        // Write WAV header
        // RIFF chunk descriptor
        this.writeString(view, 0, 'RIFF');
        view.setUint32(4, length - 8, true);
        this.writeString(view, 8, 'WAVE');

        // FMT sub-chunk
        this.writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true); // Subchunk1Size
        view.setUint16(20, 1, true); // Audio format (PCM)
        view.setUint16(22, numOfChan, true); // Number of channels
        view.setUint32(24, buffer.sampleRate, true); // Sample rate
        view.setUint32(28, buffer.sampleRate * numOfChan * 2, true); // Byte rate
        view.setUint16(32, numOfChan * 2, true); // Block align
        view.setUint16(34, 16, true); // Bits per sample

        // Data sub-chunk
        this.writeString(view, 36, 'data');
        view.setUint32(40, length - 44, true);

        // Write audio data
        let offset = 44;
        for (let i = 0; i < numOfChan; i++) {
            const channel = buffer.getChannelData(i);
            const channelData = this.floatTo16BitPCM(channel);

            const channelView = new Uint8Array(wav, offset, channelData.length);
            channelView.set(channelData);
            offset += channelData.length;
        }

        return new Blob([wav], { type: 'audio/wav' });
    }

    /**
     * Convert float audio data to 16-bit PCM
     * @param {Float32Array} input - Float audio data
     * @returns {Uint8Array} 16-bit PCM data
     */
    static floatTo16BitPCM(input) {
        const output = new Uint8Array(input.length * 2);
        for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            const int16 = s < 0 ? s * 0x8000 : s * 0x7FFF;
            output[i * 2] = int16 & 0xFF;
            output[i * 2 + 1] = (int16 >> 8) & 0xFF;
        }
        return output;
    }

    /**
     * Write a string to a DataView
     * @param {DataView} view - DataView to write to
     * @param {number} offset - Offset in the view
     * @param {string} str - String to write
     */
    static writeString(view, offset, str) {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    }
}