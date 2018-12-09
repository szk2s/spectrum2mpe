import numpy as np
from scipy import signal
import matplotlib.pyplot as plt
import soundfile as sf
import sounddevice as sd

[data, fs] = sf.read("./test/assets/wav/test.wav")
sd.play(data, fs)

#Compute and plot the spectrogram.
f, t, Sxx = signal.spectrogram(data, fs)
plt.pcolormesh(t, f, Sxx)
plt.ylabel('Frequency [Hz]')
plt.xlabel('Time [sec]')
plt.show() 
# plt.show(block=False) 
# plt.pause(3)
# plt.close()