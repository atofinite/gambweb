
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to convert blob to base64"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const LoadingMessage: React.FC = () => {
    const messages = [
        "Summoning cosmic energies...",
        "Aligning stellar planes...",
        "Rendering nebulae...",
        "Polishing quasars...",
        "Finalizing the spacetime continuum...",
    ];
    const [currentMessage, setCurrentMessage] = useState(messages[0]);

    React.useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % messages.length;
            setCurrentMessage(messages[index]);
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    return <p className="text-lg text-slate-300 mt-4">{currentMessage}</p>;
};

const VideoGenerator: React.FC = () => {
    const [image, setImage] = useState<{ blob: Blob, preview: string } | null>(null);
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [apiKeySelected, setApiKeySelected] = useState<boolean | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (typeof window.aistudio?.hasSelectedApiKey === 'function') {
            window.aistudio.hasSelectedApiKey().then(setApiKeySelected);
        } else {
             // If aistudio is not available, assume we can proceed for local dev
            setApiKeySelected(true);
        }
    }, []);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage({
                blob: file,
                preview: URL.createObjectURL(file),
            });
            setGeneratedVideoUrl(null);
            setError(null);
        }
    };

    const handleSelectKey = async () => {
        if (typeof window.aistudio?.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            // Assume selection is successful to avoid race conditions
            setApiKeySelected(true); 
        } else {
            setError("API key selection is not available in this environment.");
        }
    };

    const handleGenerate = async () => {
        if (!image) {
            setError("Please upload an image first.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedVideoUrl(null);

        try {
            const base64Image = await blobToBase64(image.blob);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt || 'Animate this image beautifully.',
                image: {
                    imageBytes: base64Image,
                    mimeType: image.blob.type,
                },
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: aspectRatio,
                }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            if (operation.error) {
                throw new Error(operation.error.message || "An unknown error occurred during video generation.");
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                if (!videoResponse.ok) throw new Error("Failed to download the generated video.");
                const videoBlob = await videoResponse.blob();
                setGeneratedVideoUrl(URL.createObjectURL(videoBlob));
            } else {
                throw new Error("Video generation completed, but no download link was found.");
            }

        } catch (e: any) {
            console.error(e);
            const errorMessage = e.message || "An unexpected error occurred.";
             if (errorMessage.includes("Requested entity was not found.")) {
                setError("API key is invalid or missing permissions. Please select a valid key.");
                setApiKeySelected(false);
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (apiKeySelected === null) {
        return <div className="text-center text-slate-400">Checking API key status...</div>;
    }

    if (!apiKeySelected) {
        return (
            <div className="text-center bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl max-w-md w-full">
                <h3 className="text-xl font-bold text-white mb-2">API Key Required for Veo</h3>
                <p className="text-slate-400 mb-4">
                    Video generation requires a valid API key with billing enabled.
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-gold underline ml-1">Learn more</a>
                </p>
                <button
                    onClick={handleSelectKey}
                    className="w-full bg-gold-gradient text-slate-900 font-bold py-3 rounded-lg shadow-lg shadow-yellow-500/30 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    Select API Key
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl">
            <div className="w-full grid md:grid-cols-2 gap-8">
                {/* Left Column: Upload & Preview */}
                <div className="flex flex-col items-center">
                    <div 
                        className="w-full h-64 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center bg-slate-900/50 cursor-pointer hover:border-gold transition"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {image ? (
                            <img src={image.preview} alt="Upload preview" className="w-full h-full object-contain rounded-md" />
                        ) : (
                            <div className="text-center text-slate-400">
                                <p>Click to upload an image</p>
                                <p className="text-sm">(PNG, JPG, etc.)</p>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                {/* Right Column: Controls */}
                <div className="flex flex-col space-y-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter a prompt to animate the image (e.g., 'make the stars twinkle')"
                        className="w-full h-24 bg-slate-900 border-2 border-slate-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-gold focus:border-gold transition"
                        disabled={isLoading}
                    />
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
                        <div className="flex space-x-2">
                            {(['16:9', '9:16'] as const).map(ratio => (
                                <button
                                    key={ratio}
                                    onClick={() => setAspectRatio(ratio)}
                                    disabled={isLoading}
                                    className={`px-4 py-2 text-sm rounded-md font-semibold transition ${aspectRatio === ratio ? 'bg-gold-gradient text-slate-900' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                                >
                                    {ratio}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !image}
                        className="w-full bg-gold-gradient text-slate-900 font-bold py-3 rounded-lg shadow-lg shadow-yellow-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : 'Generate Video'}
                    </button>
                </div>
            </div>

            {(isLoading || error || generatedVideoUrl) && (
                <div className="mt-8 w-full text-center">
                    {isLoading && <LoadingMessage />}
                    {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
                    {generatedVideoUrl && (
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold text-white mb-4">Your Video is Ready!</h3>
                            <video src={generatedVideoUrl} controls autoPlay loop className="w-full max-w-md mx-auto rounded-lg border-2 border-gold shadow-gold" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VideoGenerator;
