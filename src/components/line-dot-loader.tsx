"use client"
import { useEffect, useState } from "react"

export default function LineDotLoader() {
  const [activeIndex, setActiveIndex] = useState(0)
  const totalDots = 4

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalDots)
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-4">
          {Array.from({ length: totalDots }).map((_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === activeIndex ? "bg-blue-500 scale-125" : "bg-blue-200 scale-100"
              }`}
            />
          ))}
        </div>
        <div className="mt-3 text-sm font-medium text-gray-600">Carregando</div>
      </div>
    </div>
  )
}