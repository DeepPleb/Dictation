var button = document.getElementById('button')


button.onclick = function() {
  let count = 0

  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    console.log({ stream })
    if (!MediaRecorder.isTypeSupported('audio/webm'))
      return alert('Browser not supported')
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm',
    })
    const socket = new WebSocket('wss://api.deepgram.com/v1/listen', [
      'token',
      'fffff14aa4ecc90da6f276833599552234f44c1b',
    ])
    socket.onopen = () => {

      console.log({ event: 'onopen' })
      var text = document.getElementById("recording")
      text.classList.toggle('hidden');

      mediaRecorder.addEventListener('dataavailable', async (event) => {
        if (event.data.size > 0 && socket.readyState == 1) {
          socket.send(event.data)
        }
      })
      mediaRecorder.start(1000)
    }

    socket.onmessage = (message) => {
      const received = JSON.parse(message.data)
      const transcript = received.channel.alternatives[0].transcript
      var textbox3 = document.getElementById('textArea')
      textbox3.value += transcript + " "
    }

    socket.onclose = () => {
      console.log({ event: 'onclose' })
    }

    socket.onerror = (error) => {
      console.log({ event: 'onerror', error })
    }



    button.onclick = function() {
      if (count == 0) {
        socket.close()
        console.log("stopped")
        var text = document.getElementById("recording")
        text.classList.toggle('hidden');
        count == 1
      }

    }
  })
}



