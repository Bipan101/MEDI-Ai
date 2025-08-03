import React from 'react';
import { LoadingSpinner } from '../ui';
import { Brain, Camera, Search, CheckCircle } from 'lucide-react';

const ScanningProgress = ({ stage = 'processing', message = 'Processing...' }) => {
  const stages = [
    { key: 'uploading', icon: Camera, label: 'Uploading Image', color: 'text-blue-600' },
    { key: 'processing', icon: Brain, label: 'AI Analysis in Progress', color: 'text-purple-600' },
    { key: 'analyzing', icon: Search, label: 'Extracting Medicine Information', color: 'text-orange-600' },
    { key: 'complete', icon: CheckCircle, label: 'Analysis Complete', color: 'text-green-600' }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === stage);

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <div className="relative">
        <LoadingSpinner size="lg" className="text-blue-600" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Analyzing Medicine with AI
        </h3>
        <p className="text-sm text-gray-600">{message}</p>
      </div>

      <div className="w-full max-w-md space-y-2">
        {stages.map((stageItem, index) => {
          const Icon = stageItem.icon;
          const isActive = index === currentStageIndex;
          const isComplete = index < currentStageIndex;
          
          return (
            <div
              key={stageItem.key}
              className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-50 border border-blue-200' 
                  : isComplete 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon 
                className={`w-4 h-4 ${
                  isActive 
                    ? stageItem.color 
                    : isComplete 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                }`} 
              />
              <span 
                className={`text-sm font-medium ${
                  isActive 
                    ? 'text-gray-900' 
                    : isComplete 
                      ? 'text-green-700' 
                      : 'text-gray-500'
                }`}
              >
                {stageItem.label}
              </span>
              {isComplete && (
                <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
              )}
              {isActive && (
                <LoadingSpinner size="sm" className="ml-auto" />
              )}
            </div>
          );
        })}
      </div>

      <div className="text-xs text-gray-500 text-center max-w-md">
        <p className="mb-1">
          🤖 Using advanced AI vision technology to identify your medicine
        </p>
        <p>
          ⏱️ This usually takes 15-30 seconds depending on image complexity
        </p>
      </div>
    </div>
  );
};

export default ScanningProgress;
