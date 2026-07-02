'use client'

import { useState, useCallback, useRef , useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, Save, ImageIcon, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { saveEntry, generateId, getProfile } from '@/lib/store'
import { HealthAlerts } from '@/components/health-alerts'
import { ScanProgress } from '@/components/scan-progress'
import { CameraModal } from '@/components/camera-modal'
import { toast } from 'sonner'
import { supabase } from  "@/lib/supabase"

export function ScanForm() {
  const router = useRouter()
  const profile = getProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [ocrResult, setOcrResult] = useState<any>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const [sugar, setSugar] = useState('')
  const [protein, setProtein] = useState('')
  const [fat, setFat] = useState('')
  const [carbohydrates, setCarbohydrates] = useState('')
  const [sodium, setSodium] = useState('')
  const [cholesterol, setCholesterol] = useState('')


const generateWarnings = () => {
  const w: string[] = []

  if (Number(sugar) > 10)
    w.push("High Sugar Content")

  if (Number(fat) > 17)
    w.push("High Fat Content")

  if (Number(sodium) > 400)
    w.push("High Sodium Content")

  if (Number(cholesterol) > 60)
    w.push("High Cholesterol Content")

  setWarnings(w)
}

useEffect(()=> {
    generateWarnings()
},[sugar,fat,sodium,cholesterol])


const processImage = useCallback(async (file: File) => {

  const reader = new FileReader()

  reader.onload = (event) => {
    setImage(event.target?.result as string)
  }

  reader.readAsDataURL(file)

  try {

    setIsAnalyzing(true)

    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(
      "https://smartdietai-production.up.railway.app/analyze",
      {
        method: "POST",
        body: formData
      }
    )

    const data = await response.json()

    
    setOcrResult(data)
    setWarnings(data.warnings || [])

    setCalories(
      String(data.nutrition.calories || "")
    )

    setProtein(
      String(data.nutrition.protein || "")
    )

    setFat(
      String(data.nutrition.fat || "")
    )

    setCarbohydrates(
      String(data.nutrition.carbohydrates || "")
    )

    setSugar(
      String(data.nutrition.sugar || "")
    )

    setSodium(
  String(data.nutrition.sodium || "")
)

setCholesterol(
  String(data.nutrition.cholesterol || "")
)

toast.dismiss()
toast.success("Analysis Complete")

  } catch (error) {

    console.error(error)

    toast.error(
      "Failed to analyze image"
    )

  } finally {

    setIsAnalyzing(false)

  }

}, [])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      toast.loading('Processing image...')
      processImage(file)
    }
  }, [processImage])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleCameraCapture = async () => {
    try {
      // Request camera permission explicitly
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      // Stop the stream after permission is granted
      stream.getTracks().forEach(track => track.stop())
      // Open camera modal
      setIsCameraOpen(true)
    } catch (err) {
      toast.error('Camera permission denied or not available')
    }
  }

  const handleCameraCapture_Modal = useCallback((imageData: string) => {
    setImage(imageData)
    setIsAnalyzing(true)
    setScanProgress(1)
    toast.loading('Processing image...')

    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 4) {
          clearInterval(progressInterval)
          setIsAnalyzing(false)
          toast.dismiss()
          toast.success('Photo captured and analyzed!')
          return 5
        }
        return prev + 1
      })
    }, 600)
  }, [])

  const handleSave = useCallback(async () => {
    if (!name || !calories) {
      toast.error('Please fill in food name and calories')
      return
    }

    setIsSaving(true)
    setScanProgress(0)
    try {
      const { data: {user},
    }   = await supabase.auth.getUser()

      const { data,error } = await supabase
  .from("food_entries")
  .insert([
    {
      user_id:user?.id,
      food_name: name,
      calories: Number(calories),
      protein: Number(protein),
      carbohydrates: Number(carbohydrates),
      fat: Number(fat),
      sugar: Number(sugar),
      sodium: Number(sodium),
      cholesterol: Number(cholesterol),
      ingredients:(ocrResult as any)?.ingredients_text || "",
      
    }
  ])
  .select()
 

if (error) {
  console.error(error)
  return
}
router.push('/history')
      // Simulate API call with progress steps
      const steps = [1, 2, 3, 4, 5]
      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 400))
        setScanProgress(step)
      }

      const userAllergies = profile?.foodAllergies || []
      const checkWarnings: string[] = []

      // Simulate backend warning generation based on user allergies
      if (userAllergies.includes('egg') && name.toLowerCase().includes('egg')) {
        checkWarnings.push('Contains Egg - Your dietary profile marks this as an allergen')
      }
      if (userAllergies.includes('milk') && (name.toLowerCase().includes('milk') || name.toLowerCase().includes('cheese'))) {
        checkWarnings.push('Contains Milk - Your dietary profile marks this as an allergen')
      }

      const entry = {
        id: generateId(),
        name,
        calories: parseFloat(calories) || 0,
        sugar: parseFloat(sugar) || 0,
        protein: parseFloat(protein) || 0,
        fat: parseFloat(fat) || 0,
        carbohydrates: parseFloat(carbohydrates) || 0,
        sodium: parseFloat(sodium) || 0,
        cholesterol: parseFloat(cholesterol) || 0,
        date: new Date().toISOString(),
        imageUrl: image || undefined,
        warnings: checkWarnings,
        timestamp: Date.now(),
      }

      saveEntry(entry)
      

      toast.dismiss()
      toast.success(`✅ ${name} added to your diet! Nutrition analysis complete.`, {
        description: `Calories: ${calories} kcal • Carbs: ${carbohydrates}g • Protein: ${protein}g`,
      })

      // Reset form
      setImage(null)
      setOcrResult(null)
      setWarnings([])
      setScanProgress(0)
      setName('')
      setCalories('')
      setSugar('')
      setProtein('')
      setFat('')
      setCarbohydrates('')
      setSodium('')
      setCholesterol('')
      
      router.push('/')
      router.refresh()
    } catch (error) {
      toast.error('Failed to save entry')
    } finally {
      setIsSaving(false)
    }
  }, [name, calories, sugar, protein, fat, carbohydrates, sodium, cholesterol, image, router, profile?.foodAllergies])

  return (
    <div className="space-y-6">
      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture_Modal}
      />

      {/* Upload Buttons */}
      <div className="flex gap-3">
        <Button 
          className="flex-1" 
          variant="default"
          onClick={handleUploadClick}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <Button 
          className="flex-1"
          variant="outline"
          onClick={handleCameraCapture}
        >
          <Camera className="mr-2 h-4 w-4" />
          Take Photo
        </Button>
      </div>

      {/* Image Upload Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Upload Food Image</h3>
        
        <div>
          {image ? (
            <div className="relative">
              <img
                src={image}
                alt="Uploaded food"
                className="h-48 w-full rounded-lg object-cover border border-border"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-2 top-2"
                onClick={() => setImage(null)}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/20 p-4">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-semibold text-card-foreground">No image selected</p>
                <p className="text-xs text-muted-foreground">Upload an image or take a photo to get started</p>
              </div>
            </div>
          )}
        </div>

        {/* OCR Result */}
        {isAnalyzing && (
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 animate-in fade-in">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-900 dark:text-blue-300">Analyzing food image...</p>
          </div>
        )}

        {ocrResult && !isAnalyzing && (
          <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-4 animate-in fade-in">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">Analysis Result</p>
            </div>
            {ocrResult?.ingredients_text && (<p  className="text-sm text-emerald-800 dark:text-emerald-200">{ocrResult.ingredients_text}</p>)}
          </div>
        )}
      </div>

      {/* Analysis Progress */}
      {(isAnalyzing || isSaving) && <ScanProgress currentStep={Math.max(1, scanProgress)} />}

      {/* Manual Input Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-1">Nutrition Information</h3>
        <p className="text-xs text-muted-foreground mb-4">Enter values manually or let the API fill them</p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-card-foreground text-sm">Food Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Grilled Chicken Salad"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5"
            />
          </div>
          
          {/* Main Nutritional Values */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="calories" className="text-card-foreground text-sm">Calories (kcal) *</Label>
              <Input
                id="calories"
                type="number"
                placeholder="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="carbohydrates" className="text-card-foreground text-sm">Carbohydrates (g)</Label>
              <Input
                id="carbohydrates"
                type="number"
                placeholder="0"
                value={carbohydrates}
                onChange={(e) => setCarbohydrates(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Secondary Values */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="protein" className="text-card-foreground text-xs">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                placeholder="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="mt-1.5 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="fat" className="text-card-foreground text-xs">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                placeholder="0"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="mt-1.5 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="sugar" className="text-card-foreground text-xs">Sugar (g)</Label>
              <Input
                id="sugar"
                type="number"
                placeholder="0"
                value={sugar}
                onChange={(e) => setSugar(e.target.value)}
                className="mt-1.5 text-sm"
              />
            </div>
          </div>

          {/* Health Values */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
            <div>
              <Label htmlFor="sodium" className="text-card-foreground text-sm">Sodium (mg)</Label>
              <Input
                id="sodium"
                type="number"
                placeholder="0"
                value={sodium}
                onChange={(e) => setSodium(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="cholesterol" className="text-card-foreground text-sm">Cholesterol (mg)</Label>
              <Input
                id="cholesterol"
                type="number"
                placeholder="0"
                value={cholesterol}
                onChange={(e) => setCholesterol(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Health Alerts Preview */}
      {name && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Dietary Warnings</h3>
          <HealthAlerts warnings={warnings} />
        </div>
      )}

      {/* Save Button */}
      <Button
        className="w-full h-11 text-base font-semibold"
        onClick={handleSave}
        disabled={!name || !calories || isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving & Analyzing...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Entry
          </>
        )}
      </Button>
    </div>
  )
}

