'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Camera as CameraIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CameraModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (imageData: string) => void
}

export function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const startCamera = async () => {
      try {
        setError(null)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsCameraActive(true)
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to access camera. Please check permissions.'
        )
        setIsCameraActive(false)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [isOpen])

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)

        const imageData = canvasRef.current.toDataURL('image/jpeg', 0.95)
        onCapture(imageData)

        // Stop camera
        if (videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
          tracks.forEach(track => track.stop())
        }
        setIsCameraActive(false)
        onClose()
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Take a Photo</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 mb-4">
            <p className="text-sm text-red-900 dark:text-red-200">
              {error}
            </p>
            <p className="text-xs text-red-800 dark:text-red-300 mt-2">
              Please check your browser permissions and ensure your camera is not being used by another application.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 overflow-hidden rounded-lg bg-black aspect-video">
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary">
                  <p className="text-sm text-muted-foreground">
                    Initializing camera...
                  </p>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleCapture}
                disabled={!isCameraActive}
              >
                <CameraIcon className="mr-2 h-4 w-4" />
                Capture
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
