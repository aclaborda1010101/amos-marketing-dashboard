"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  Globe, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from "lucide-react"

interface ClientWizardProps {
  onComplete: (data: ClientFormData) => void
  onCancel: () => void
}

export interface ClientFormData {
  name: string
  industry: string
  website: string
  logo?: File
  brief: string
}

const INDUSTRIES = [
  "Tecnología / Software",
  "E-commerce",
  "Salud / Bienestar",
  "Educación",
  "Finanzas",
  "Inmobiliaria",
  "Hostelería / Turismo",
  "Moda / Lifestyle",
  "Alimentación",
  "Servicios Profesionales",
  "Otros"
]

const STEPS = [
  { id: 1, title: "Información Básica", icon: Building2 },
  { id: 2, title: "Presencia Digital", icon: Globe },
  { id: 3, title: "Identidad Visual", icon: ImageIcon },
  { id: 4, title: "Brief Inicial", icon: FileText },
  { id: 5, title: "Confirmación", icon: CheckCircle2 },
]

export function ClientWizard({ onComplete, onCancel }: ClientWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    industry: "",
    website: "",
    brief: ""
  })
  const [logoPreview, setLogoPreview] = useState<string>("")

  const progress = (currentStep / STEPS.length) * 100

  const updateField = (field: keyof ClientFormData, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateField("logo", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.length > 0 && formData.industry.length > 0
      case 2:
        return formData.website.length > 0
      case 3:
        return true // Logo es opcional
      case 4:
        return formData.brief.length > 50
      case 5:
        return true
      default:
        return false
    }
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(formData)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[var(--dark-background)] border border-[var(--dark-border)] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-lime-500 to-lime-600 p-6 text-black">
          <h2 className="text-2xl font-bold mb-2">Nuevo Cliente</h2>
          <p className="text-black/70">Paso {currentStep} de {STEPS.length}</p>
          <Progress value={progress} className="mt-4 bg-lime-700" />
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between px-6 py-4 border-b border-[var(--dark-border)]">
          {STEPS.map((step) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep
            
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center gap-2 ${
                  isActive ? 'text-lime-400' : isCompleted ? 'text-green-500' : 'text-[var(--dark-text-subtle)]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-lime-500/20' : isCompleted ? 'bg-green-500/20' : 'bg-[var(--dark-surface-hover)]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
              </div>
            )
          })}
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          {/* Step 1: Información Básica */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-slide-in">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Información Básica</h3>
                <p className="text-[var(--dark-text-muted)]">Empecemos con los datos fundamentales del cliente</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white" htmlFor="name">Nombre del Cliente *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Agustito Lab"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="mt-1 bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                  />
                </div>

                <div>
                  <Label className="text-white" htmlFor="industry">Industria *</Label>
                  <Select 
                    value={formData.industry} 
                    onValueChange={(value) => updateField("industry", value)}
                  >
                    <SelectTrigger className="mt-1 bg-[var(--dark-surface)] border-[var(--dark-border)] text-white">
                      <SelectValue placeholder="Selecciona una industria" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Presencia Digital */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-slide-in">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Presencia Digital</h3>
                <p className="text-[var(--dark-text-muted)]">¿Dónde podemos encontrar al cliente online?</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white" htmlFor="website">Website *</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://ejemplo.com"
                    value={formData.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    className="mt-1 bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                  />
                  <p className="text-xs text-[var(--dark-text-subtle)] mt-1">
                    Usaremos esta web para analizar la marca y extraer información
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Identidad Visual */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-slide-in">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Identidad Visual</h3>
                <p className="text-[var(--dark-text-muted)]">Sube el logo del cliente (opcional)</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white" htmlFor="logo">Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {logoPreview ? (
                      <div className="relative w-32 h-32 rounded-xl border-2 border-[var(--dark-border)] overflow-hidden">
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-[var(--dark-surface)]">
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("logo")?.click()}
                      >
                        {logoPreview ? "Cambiar Logo" : "Subir Logo"}
                      </Button>
                      <p className="text-xs text-[var(--dark-text-subtle)] mt-2">
                        PNG, JPG o SVG. Máximo 5MB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Brief Inicial */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-slide-in">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Brief Inicial</h3>
                <p className="text-[var(--dark-text-muted)]">
                  Cuéntanos sobre el cliente: objetivos, audiencia, tono, etc.
                </p>
              </div>

              <div>
                <Label className="text-white" htmlFor="brief">Descripción del Cliente *</Label>
                <Textarea
                  id="brief"
                  placeholder="Ej: Startup de IA que busca posicionarse como líder en automatización empresarial. Target: CTOs y directores de operaciones de empresas medianas. Tono: profesional pero accesible, innovador..."
                  value={formData.brief}
                  onChange={(e) => updateField("brief", e.target.value)}
                  className="mt-1 min-h-[200px]"
                />
                <p className="text-xs text-[var(--dark-text-subtle)] mt-1">
                  Mínimo 50 caracteres. Cuanto más detallado, mejor será el ADN de marca.
                </p>
                <p className="text-xs text-[var(--dark-text-muted)] mt-2">
                  {formData.brief.length} / 50 caracteres
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Confirmación */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-slide-in">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">¡Todo Listo!</h3>
                <p className="text-[var(--dark-text-muted)]">
                  Revisa los datos antes de crear el cliente
                </p>
              </div>

              <div className="card-lovable space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo" 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold">{formData.name}</h4>
                    <p className="text-sm text-[var(--dark-text-muted)]">{formData.industry}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[var(--dark-text-subtle)]">Website</p>
                    <p className="font-medium truncate">{formData.website}</p>
                  </div>
                  <div>
                    <p className="text-[var(--dark-text-subtle)]">Logo</p>
                    <p className="font-medium">{logoPreview ? "✓ Subido" : "Sin logo"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[var(--dark-text-subtle)] text-sm mb-2">Brief</p>
                  <p className="text-sm line-clamp-3">{formData.brief}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Próximos Pasos Automáticos
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• El Brand Architect generará el ADN de marca</li>
                      <li>• Analizaremos la web y competencia</li>
                      <li>• Crearemos un brief estratégico completo</li>
                      <li>• Te notificaremos cuando esté listo para aprobar</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-6 flex justify-between">
          <Button
            variant="ghost"
            onClick={currentStep === 1 ? onCancel : prevStep}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 1 ? "Cancelar" : "Anterior"}
          </Button>

          <Button
            className="btn-primary gap-2"
            onClick={nextStep}
            disabled={!canProceed()}
          >
            {currentStep === STEPS.length ? (
              <>
                <Sparkles className="w-4 h-4" />
                Crear Cliente
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
