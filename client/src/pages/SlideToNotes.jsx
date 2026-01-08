import { useState, useRef, useEffect } from "react";
import { Eye, Loader2, Presentation, Upload, FileText, X, Check } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import IconBadge from "../components/IconBadge";
import React from "react";

const SlideToNotes = () => {
  const fileInputRef = useRef(null);
  const [slides, setSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [conversionModes, setConversionModes] = useState([
    { id: 'outline', title: 'Outline mode', description: 'Capture slide headings and convert to study outline.', active: true },
    { id: 'narrative', title: 'Narrative mode', description: 'Expand slides into paragraphs with context.', active: false },
    { id: 'flashcard', title: 'Flashcard mode', description: 'Build question-answer pairs for spaced repetition.', active: false },
  ]);
  const [outputFormats, setOutputFormats] = useState([
    { id: 'pdf', name: 'PDF deck', selected: true },
    { id: 'notion', name: 'Notion doc', selected: false },
    { id: 'markdown', name: 'Markdown export', selected: false },
  ]);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    const validTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    const invalidFiles = Array.from(files).filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length) {
      setError('Please upload only PDF or PowerPoint files');
      return;
    }

    setIsUploading(true);
    setError('');

    // Simulate file processing
    try {
      // In a real app, you would upload files to your server here
      const processedSlides = Array.from(files).map((file, index) => ({
        id: `slide-${Date.now()}-${index}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        status: 'processed',
        file,
        preview: URL.createObjectURL(file),
        content: `Content extracted from ${file.name}`,
        keyPoints: [
          `Key point 1 from ${file.name}`,
          `Key point 2 from ${file.name}`,
          `Key point 3 from ${file.name}`,
        ]
      }));

      setSlides(prev => [...prev, ...processedSlides]);
      if (!selectedSlide) {
        setSelectedSlide(processedSlides[0]);
      }
    } catch (err) {
      setError('Error processing files. Please try again.');
      console.error('File processing error:', err);
    } finally {
      setIsUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  const handleConvert = async () => {
    if (!slides.length) {
      setError('Please upload slides first');
      return;
    }

    setIsConverting(true);
    setError('');

    try {
      // In a real app, you would send the conversion request to your server
      // with the selected conversion modes and output formats
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            downloadUrl: '#'
          });
        }, 2000);
      });

      if (response.success) {
        // Handle successful conversion
        console.log('Conversion successful:', response);
        // In a real app, you would handle the download or redirect
      }
    } catch (err) {
      setError('Conversion failed. Please try again.');
      console.error('Conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const toggleConversionMode = (modeId) => {
    setConversionModes(prev => 
      prev.map(mode => 
        mode.id === modeId ? { ...mode, active: !mode.active } : mode
      )
    );
  };

  const toggleOutputFormat = (formatId) => {
    setOutputFormats(prev => 
      prev.map(format => 
        format.id === formatId ? { ...format, selected: !format.selected } : format
      )
    );
  };

  useEffect(() => {
    // Clean up object URLs to avoid memory leaks
    return () => {
      slides.forEach(slide => {
        if (slide.preview) {
          URL.revokeObjectURL(slide.preview);
        }
      });
    };
  }, [slides]);

  return (
    <div className="space-y-8 text-white">
      <SectionTitle
        eyebrow="Slides to notes"
        title="Transform decks into structured notes"
        description="Upload PPT or PDF decks, preview slides, and convert them into study-ready notes."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[2.5rem] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Slide previews</p>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.ppt,.pptx"
                multiple
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Upload size={16} />
                )}
                {isUploading ? 'Uploading...' : 'Upload PPT/PDF'}
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-4 rounded-2xl bg-red-500/20 p-4 text-sm text-red-200">
              {error}
            </div>
          )}
          
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {slides.length > 0 ? (
              slides.map((slide) => (
                <button
                  key={slide.id}
                  onClick={() => setSelectedSlide(slide)}
                  className={`relative rounded-3xl border p-4 text-left transition-all ${
                    selectedSlide?.id === slide.id
                      ? 'border-indigo-400 bg-indigo-500/20 ring-2 ring-indigo-400/30'
                      : 'border-white/10 bg-slate-900/40 hover:border-indigo-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="absolute right-3 top-3">
                    <Check className="size-4 text-green-400" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                    {slide.status || 'Processed'}
                  </p>
                  <p className="mt-2 text-sm font-semibold line-clamp-2">{slide.title}</p>
                  <p className="mt-2 text-xs text-white/50">
                    {slide.file?.type?.split('/').pop()?.toUpperCase()}
                  </p>
                </button>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 p-12 text-center">
                <FileText className="mb-4 size-12 text-white/30" />
                <h3 className="text-lg font-medium text-white/80">No slides uploaded yet</h3>
                <p className="mt-1 text-sm text-white/50">Upload a PPT or PDF to get started</p>
              </div>
            )}
          </div>

          {selectedSlide && (
            <div className="mt-6 rounded-[2rem] border border-white/10 bg-slate-900/50 p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                  {selectedSlide.file?.name || `Slide ${selectedSlide.id}`}
                </p>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                    {selectedSlide.file?.type?.split('/').pop()?.toUpperCase() || 'SLIDE'}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-center">
                  {selectedSlide.preview ? (
                    <img
                      src={selectedSlide.preview}
                      alt={selectedSlide.title}
                      className="mx-auto mb-4 max-h-48 w-auto rounded-lg object-contain"
                    />
                  ) : (
                    <Presentation size={64} className="mx-auto text-indigo-200" />
                  )}
                  <p className="mt-4 text-lg font-semibold line-clamp-1">{selectedSlide.title}</p>
                  <p className="text-sm text-white/50">
                    {selectedSlide.file?.size ? `${(selectedSlide.file.size / 1024 / 1024).toFixed(1)} MB` : 'Preview available'}
                  </p>
                  <button 
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-300"
                    onClick={() => {
                      if (selectedSlide.preview) {
                        window.open(selectedSlide.preview, '_blank');
                      }
                    }}
                  >
                    <Eye size={16} />
                    {selectedSlide.preview ? 'View full preview' : 'No preview available'}
                  </button>
                </div>
                
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">Extracted Content</p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    Key ideas from {selectedSlide.title}
                  </p>
                  
                  {selectedSlide.keyPoints?.length > 0 ? (
                    <ul className="mt-4 space-y-3 text-sm text-white/70">
                      {selectedSlide.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 flex-shrink-0 rounded-full bg-indigo-400"></span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-6 text-center text-sm text-white/50">
                      No content extracted yet. Upload a file to see extracted content.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Conversion options</p>
          <div className="grid gap-4">
            {conversionModes.map((mode) => (
              <label 
                key={mode.id}
                className={`flex cursor-pointer items-start gap-3 rounded-3xl border p-4 transition-colors ${
                  mode.active 
                    ? 'border-indigo-400/50 bg-indigo-500/10' 
                    : 'border-white/10 bg-slate-900/50 hover:border-white/20'
                }`}
              >
                <input 
                  type="checkbox" 
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-400 focus:ring-indigo-400" 
                  checked={mode.active}
                  onChange={() => toggleConversionMode(mode.id)}
                />
                <div>
                  <p className="text-sm font-semibold text-white">{mode.title}</p>
                  <p className="text-sm text-white/60">{mode.description}</p>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleConvert}
            disabled={isConverting || slides.length === 0}
            className={`w-full rounded-2xl px-6 py-3 text-base font-semibold transition ${
              slides.length > 0
                ? 'bg-white text-slate-900 hover:bg-slate-100'
                : 'cursor-not-allowed bg-white/20 text-white/50'
            } ${isConverting ? 'opacity-70' : ''}`}
          >
            {isConverting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Converting...
              </span>
            ) : slides.length > 0 ? (
              `Convert ${slides.length} ${slides.length === 1 ? 'slide' : 'slides'} to notes`
            ) : (
              'Upload slides to convert'
            )}
          </button>

          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Output format</p>
            <div className="mt-4 grid gap-3 text-sm">
              {outputFormats.map((format) => (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => toggleOutputFormat(format.id)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors ${
                    format.selected 
                      ? 'border-indigo-400/50 bg-indigo-500/10' 
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <span>{format.name}</span>
                  {format.selected ? (
                    <Check className="size-5 text-indigo-400" />
                  ) : (
                    <div className="size-5 rounded-full border border-white/20" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideToNotes;
