<!-- index.html -->
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>BlazeFace TF.js demo (face blur)</title>
  <style>
    body { font-family: sans-serif; display:flex; gap:16px; padding:16px; }
    video, canvas { border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,.12); }
    #container { position:relative; width:640px; }
    #overlay { position:absolute; left:0; top:0; }
  </style>
</head>
<body>
  <div id="container">
    <video id="video" width="640" height="480" autoplay muted playsinline></video>
    <canvas id="overlay" width="640" height="480"></canvas>
  </div>

  <!-- TF.js + BlazeFace -->
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.12.0/dist/tf.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface@0.0.7/dist/blazeface.min.js"></script>

  <script>
    const video = document.getElementById('video');
    const overlay = document.getElementById('overlay');
    const ctx = overlay.getContext('2d');
    let model = null;

    async function setupCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false
      });
      video.srcObject = stream;
      return new Promise(resolve => video.onloadedmetadata = resolve);
    }

    // Simple face blur helper: crop face area, draw scaled-down then scaled-up
    function blurFaceOnCanvas(ctx, box, blurAmount = 0.05) {
      const [x1, y1, x2, y2] = box; // BlazeFace returns [x1,y1,x2,y2]
      const w = x2 - x1, h = y2 - y1;
      if (w <= 0 || h <= 0) return;
      // create offscreen
      const off = document.createElement('canvas');
      off.width = Math.max(1, Math.round(w * blurAmount));
      off.height = Math.max(1, Math.round(h * blurAmount));
      const offCtx = off.getContext('2d');
      // copy face region and scale down
      offCtx.drawImage(video, x1, y1, w, h, 0, 0, off.width, off.height);
      // scale back up over the same target region
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(off, 0, 0, off.width, off.height, x1, y1, w, h);
    }

    async function run() {
      await setupCamera();
      overlay.width = video.videoWidth;
      overlay.height = video.videoHeight;
      model = await blazeface.load(); // load model
      detectLoop();
    }

    async function detectLoop() {
      if (!model) return;
      const returnTensors = false; // get plain JS arrays
      const predictions = await model.estimateFaces(video, returnTensors);

      // clear overlay
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      if (predictions.length > 0) {
        predictions.forEach(pred => {
          // pred.topLeft [x,y], pred.bottomRight [x,y]
          const topLeft = pred.topLeft;
          const bottomRight = pred.bottomRight;
          const box = [ topLeft[0], topLeft[1], bottomRight[0], bottomRight[1] ];

          // draw rectangle
          ctx.strokeStyle = 'lime';
          ctx.lineWidth = 2;
          ctx.strokeRect(box[0], box[1], box[2] - box[0], box[3] - box[1]);

          // label
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(box[0], box[1] - 18, 80, 18);
          ctx.fillStyle = 'white';
          ctx.fillText('Face', box[0] + 4, box[1] - 4);

          // optionally blur the face region:
          // blurFaceOnCanvas(ctx, box, 0.09);
        });
      }

      requestAnimationFrame(detectLoop);
    }

    run().catch(err => {
      console.error(err);
      alert('Camera / model error: ' + err.message);
    });
  </script>
</body>
</html>
