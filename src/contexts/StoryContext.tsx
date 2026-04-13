import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type StoryType = 'movie' | 'animation' | 'storybook'

interface StoryData {
  type: StoryType
  // Step 1: 대본
  timelineText: string
  uploadedFiles: File[]
  generatedScript: string
  // Step 2: 영상
  videoRequirements: string
  videoFiles: File[]
  generatedVideoUrl: string
  // Step 3: 음성
  voiceRequirements: string
  voiceFiles: File[]
  generatedVoiceUrl: string
  // Step 4: 결과
  finalVideoUrl: string
}

interface StoryContextType {
  data: StoryData
  currentStep: number
  setCurrentStep: (step: number) => void
  setType: (type: StoryType) => void
  // Step 1
  setTimelineText: (text: string) => void
  setUploadedFiles: (files: File[]) => void
  setGeneratedScript: (script: string) => void
  // Step 2
  setVideoRequirements: (text: string) => void
  setVideoFiles: (files: File[]) => void
  setGeneratedVideoUrl: (url: string) => void
  // Step 3
  setVoiceRequirements: (text: string) => void
  setVoiceFiles: (files: File[]) => void
  setGeneratedVoiceUrl: (url: string) => void
  // Step 4
  setFinalVideoUrl: (url: string) => void
  // Reset
  resetAll: () => void
}

const initialData: StoryData = {
  type: 'movie',
  timelineText: '',
  uploadedFiles: [],
  generatedScript: '',
  videoRequirements: '',
  videoFiles: [],
  generatedVideoUrl: '',
  voiceRequirements: '',
  voiceFiles: [],
  generatedVoiceUrl: '',
  finalVideoUrl: '',
}

const StoryContext = createContext<StoryContextType | undefined>(undefined)

export function StoryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoryData>(initialData)
  const [currentStep, setCurrentStep] = useState(1)

  const setType = useCallback((type: StoryType) => {
    setData((prev) => ({ ...prev, type }))
  }, [])

  const setTimelineText = useCallback((text: string) => {
    setData((prev) => ({ ...prev, timelineText: text }))
  }, [])

  const setUploadedFiles = useCallback((files: File[]) => {
    setData((prev) => ({ ...prev, uploadedFiles: files }))
  }, [])

  const setGeneratedScript = useCallback((script: string) => {
    setData((prev) => ({ ...prev, generatedScript: script }))
  }, [])

  const setVideoRequirements = useCallback((text: string) => {
    setData((prev) => ({ ...prev, videoRequirements: text }))
  }, [])

  const setVideoFiles = useCallback((files: File[]) => {
    setData((prev) => ({ ...prev, videoFiles: files }))
  }, [])

  const setGeneratedVideoUrl = useCallback((url: string) => {
    setData((prev) => ({ ...prev, generatedVideoUrl: url }))
  }, [])

  const setVoiceRequirements = useCallback((text: string) => {
    setData((prev) => ({ ...prev, voiceRequirements: text }))
  }, [])

  const setVoiceFiles = useCallback((files: File[]) => {
    setData((prev) => ({ ...prev, voiceFiles: files }))
  }, [])

  const setGeneratedVoiceUrl = useCallback((url: string) => {
    setData((prev) => ({ ...prev, generatedVoiceUrl: url }))
  }, [])

  const setFinalVideoUrl = useCallback((url: string) => {
    setData((prev) => ({ ...prev, finalVideoUrl: url }))
  }, [])

  const resetAll = useCallback(() => {
    setData(initialData)
    setCurrentStep(1)
  }, [])

  return (
    <StoryContext.Provider
      value={{
        data,
        currentStep,
        setCurrentStep,
        setType,
        setTimelineText,
        setUploadedFiles,
        setGeneratedScript,
        setVideoRequirements,
        setVideoFiles,
        setGeneratedVideoUrl,
        setVoiceRequirements,
        setVoiceFiles,
        setGeneratedVoiceUrl,
        setFinalVideoUrl,
        resetAll,
      }}
    >
      {children}
    </StoryContext.Provider>
  )
}

export function useStory() {
  const context = useContext(StoryContext)
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider')
  }
  return context
}
