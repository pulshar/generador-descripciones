import { Bot, Check, Copy, Leaf, Loader2, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { ImageUploader } from "./components/ImageUploader";
import { LanguageSelector } from "./components/LanguageSelector";
import { LengthSelector } from "./components/LengthSelector";
import { generateDescriptions } from "./services/geminiService";
import { AppState } from "./types";

const ResultSkeleton = () => (
  <div className="space-y-6 animate-pulse w-full">
    {[1, 2].map((i) => (
      <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
        <div className="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    ))}
  </div>
);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    image: null,
    selectedLanguages: ["Spanish"],
    selectedLength: "Medium",
    isGenerating: false,
    results: null,
    error: null,
  });

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!state.image) return;

    setState((prev) => ({
      ...prev,
      isGenerating: true,
      error: null,
      results: null,
    }));

    try {
      const results = await generateDescriptions(
        state.image,
        state.selectedLanguages,
        state.selectedLength
      );
      setState((prev) => ({ ...prev, results, isGenerating: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      }));
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background text-primary font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Branding */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="p-2.5 bg-accent rounded-lg shadow-sm">
            <Leaf size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">GenDescribe</h1>
            <p className="text-sm text-gray-500 hidden sm:block">
              Generador de descripciones para imágenes de producto con IA.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
          {/* CAJA IZQUIERDA: INPUTS Y CONFIGURACIÓN */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200/60 h-full">
              <div className="space-y-8">
                {/* 1. Upload */}
                <section>
                  <ImageUploader
                    image={state.image}
                    onImageChange={(img) =>
                      setState((prev) => ({
                        ...prev,
                        image: img,
                        results: null,
                      }))
                    }
                  />
                </section>

                {/* 2. Config */}
                <section>
                  <LanguageSelector
                    selected={state.selectedLanguages}
                    onChange={(langs) =>
                      setState((prev) => ({
                        ...prev,
                        selectedLanguages: langs,
                      }))
                    }
                  />
                  <div className="h-px bg-white w-full my-4"></div>
                  <LengthSelector
                    selected={state.selectedLength}
                    onChange={(len) =>
                      setState((prev) => ({ ...prev, selectedLength: len }))
                    }
                  />
                </section>

                {/* Button */}
                <div className="pt-2 sticky bottom-0 bg-white pb-2">
                  <button
                    onClick={handleGenerate}
                    disabled={
                      !state.image ||
                      state.isGenerating ||
                      state.selectedLanguages.length === 0
                    }
                    className={`
                                    w-full py-4 rounded-md font-medium text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-sm
                                    ${!state.image ||
                        state.selectedLanguages.length === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "group cursor-pointer bg-primary text-white hover:bg-primary/90 hover:ring-3 hover:ring-accent active:scale-[0.99]"
                      }
                                `}
                  >
                    {state.isGenerating ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Analizando imagen...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} className="text-accent" />
                        Generar descripciones

                      </>
                    )}
                  </button>
                  {!state.image && (
                    <p className="text-center text-gray-400 text-xs mt-3">
                      Sube una imagen para comenzar
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CAJA DERECHA: RESULTADOS */}
          <div className="flex flex-col h-full min-h-125 lg:min-h-0">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200/60 h-full flex flex-col relative overflow-hidden">
              {/* Header Resultados */}
              <div className="flex items-center justify-between mb-6 z-10">
                {state.results && (
                  <span className="text-xs font-medium px-3 py-1 bg-accent-soft text-primary border border-accent rounded-full">
                    {state.results.length === 1
                      ? "1 generado"
                      : `${state.results.length} generados`}
                  </span>
                )}
                {state.isGenerating && (
                  <div className="flex items-center h-6.5 gap-3 text-gray-500 animate-pulse">
                    <Bot size={20} />
                    <span className="text-sm">
                      La IA está redactando tus descripciones...
                    </span>
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar z-10 pr-2">
                {state.isGenerating ? (
                  <div className="pb-4">
                    <ResultSkeleton />
                  </div>
                ) : state.error ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold">!</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Ocurrió un error
                    </h3>
                    <p className="text-gray-500 max-w-xs">{state.error}</p>
                  </div>
                ) : state.results ? (
                  <div className="space-y-6 animate-fade-in pb-4">
                    {state.results.map((result, idx) => (
                      <div
                        key={idx}
                        className="bg-background rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-colors group relative"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs font-bold tracking-wider text-primary uppercase bg-accent px-2 py-1 rounded">
                            {result.language}
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                `${result.title}\n\n${result.description}`,
                                idx
                              )
                            }
                            className="p-2 rounded-lg bg-white hover:bg-primary hover:text-white transition-all text-gray-400 shadow-sm border border-gray-100"
                            title="Copiar texto"
                          >
                            {copiedIndex === idx ? (
                              <Check size={16} className="text-accent" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </div>
                        <h3 className="text-lg font-bold mb-3 text-gray-900 leading-tight">
                          {result.title}
                        </h3>
                        <p className="text-gray-600 tracking-[-0.015em] leading-relaxed text-sm md:text-base">
                          {result.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-6 min-h-75 opacity-60">
                    <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center">
                      <Sparkles size={40} className="text-gray-300" />
                    </div>
                    <div className="text-center max-w-sm">
                      <p className="text-lg font-display font-medium text-gray-500 mb-2">
                        Esperando contenido
                      </p>
                      <p className="text-sm text-gray-400 hidden lg:block">
                        Sube una imagen y configura tus opciones en el panel de
                        la izquierda para ver aquí las descripciones generadas.
                      </p>
                      <p className="text-sm text-gray-400 lg:hidden">
                        Sube una imagen y configura tus opciones para ver aquí las descripciones generadas.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
