import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "./ThemeProvider"
import { Palette, Check } from "lucide-react"

const themePresets = [
  {
    name: "Ocean",
    primary: "210 100% 56%",
    secondary: "197 100% 45%",
    accent: "186 100% 42%",
    gradient: "linear-gradient(135deg, hsl(210 100% 56%), hsl(197 100% 45%))"
  },
  {
    name: "Forest",
    primary: "120 60% 40%",
    secondary: "142 71% 45%",
    accent: "80 60% 50%",
    gradient: "linear-gradient(135deg, hsl(120 60% 40%), hsl(142 71% 45%))"
  },
  {
    name: "Sunset",
    primary: "14 100% 57%",
    secondary: "45 93% 58%",
    accent: "30 100% 60%",
    gradient: "linear-gradient(135deg, hsl(14 100% 57%), hsl(45 93% 58%))"
  },
  {
    name: "Cyber",
    primary: "280 100% 70%",
    secondary: "300 100% 60%",
    accent: "320 100% 65%",
    gradient: "linear-gradient(135deg, hsl(280 100% 70%), hsl(300 100% 60%))"
  },
  {
    name: "Default",
    primary: "242 47% 58%",
    secondary: "142 71% 45%",
    accent: "45 93% 58%",
    gradient: "linear-gradient(135deg, hsl(242 47% 58%), hsl(262 47% 68%))"
  }
]

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [selectedPreset, setSelectedPreset] = useState("Default")

  const applyTheme = (preset: typeof themePresets[0]) => {
    const root = document.documentElement
    
    // Apply the new color values
    root.style.setProperty('--primary', preset.primary)
    root.style.setProperty('--secondary', preset.secondary)
    root.style.setProperty('--accent', preset.accent)
    root.style.setProperty('--gradient-primary', preset.gradient)
    
    setSelectedPreset(preset.name)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Palette className="h-5 w-5 text-primary" />
          <span>Theme Presets</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* System Theme Toggle */}
        <div className="flex items-center space-x-2 mb-4">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("system")}
          >
            System
          </Button>
        </div>

        {/* Color Presets */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Color Presets</h4>
          <div className="grid grid-cols-1 gap-2">
            {themePresets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                className="h-auto p-3 justify-start space-x-3 hover:bg-muted"
                onClick={() => applyTheme(preset)}
              >
                <div
                  className="w-8 h-8 rounded-full border-2 border-border"
                  style={{ background: preset.gradient }}
                />
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{preset.name}</span>
                    {selectedPreset === preset.name && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex space-x-1 mt-1">
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: `hsl(${preset.primary})` }}
                    />
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: `hsl(${preset.secondary})` }}
                    />
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: `hsl(${preset.accent})` }}
                    />
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}