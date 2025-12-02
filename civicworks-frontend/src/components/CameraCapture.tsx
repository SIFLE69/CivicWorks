import React, { useEffect, useRef, useState } from "react";

type CaptureResult = {
  blob: Blob;
  dataUrl: string;
  lat: number;
  lng: number;
  capturedAt: number;
};

export default function CameraCapture({
  open,
  onClose,
  onCaptured,
}: {
  open: boolean;
  onClose: () => void;
  onCaptured: (r: CaptureResult) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string>("");

  // Start/stop camera stream
  useEffect(() => {
    let isMounted = true;
    async function start() {
      setError("");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e: any) {
        setError("Camera access denied or unavailable.");
      }
    }
    async function stop() {
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    }

    if (open) start();
    return () => { isMounted = false; stop(); };
  }, [open]);

  async function capture() {
    setError("");
    const video = videoRef.current;
    if (!video) return;

    // draw frame to canvas
    const canvas = document.createElement("canvas");
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);

    // get blob + dataURL
    const blob: Blob = await new Promise((resolve) => canvas.toBlob(b => resolve(b as Blob), "image/jpeg", 0.9));
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    // geolocate at capture time with error handling
    let lat = 0;
    let lng = 0;

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    } catch (error) {
      setError("Location access denied. Please enter coordinates manually.");
      // Don't return - still allow capture without location
    }

    onCaptured({
      blob,
      dataUrl,
      lat,
      lng,
      capturedAt: Date.now(),
    });
    onClose();
  }

  if (!open) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Camera">
      <div className="modal-card">
        <div className="modal-actions">
          <strong>Capture photo (camera only)</strong>
          <button className="secondary" onClick={onClose}>Close</button>
        </div>
        <div className="video-wrap">
          <video ref={videoRef} playsInline muted style={{ width: "100%", display: "block" }} />
        </div>
        {error && <div className="helper" style={{ color: "#fca5a5" }}>{error}</div>}
        <div className="modal-actions">
          <span className="helper">Ensure subject is clearly visible. Location will be recorded at capture time.</span>
          <button className="primary" onClick={capture}>Capture</button>
        </div>
      </div>
    </div>
  );
}
