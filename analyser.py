import numpy as np
from scipy import signal
import matplotlib.pyplot as plt
import soundfile as sf
import sounddevice as sd

[data, fs] = sf.read("./test/assets/wav/6_module1_zim.wav")
sd.play(data, fs)
data = np.average(data, axis=1) #Sum to mono
data /= np.max(np.abs(data)) #Normalize

#Compute and plot the spectrogram.
f, t, Sxx = signal.spectrogram(data, fs)
# np.multiply(Sxx, 1000)
plt.pcolormesh(t, f, Sxx)
plt.ylabel('Frequency [Hz]')
plt.xlabel('Time [sec]')
plt.show() 
# plt.show(block=False)
# plt.pause(3)
# plt.close()