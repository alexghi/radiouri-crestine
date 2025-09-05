import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DebugInfoProps {
  error?: string | null;
  stations?: any[];
}

export function DebugInfo({ error, stations }: DebugInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!error && (!stations || stations.length > 0)) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-900/90 text-white p-2 text-xs">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-red-200 hover:text-white"
      >
        Debug Info {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      
      {isExpanded && (
        <div className="mt-2 p-2 bg-black/50 rounded text-xs font-mono">
          <div className="mb-2">
            <strong>API Endpoint:</strong> https://api.radiocrestin.ro/api/v1/stations
          </div>
          
          {error && (
            <div className="mb-2">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div className="mb-2">
            <strong>Station Count:</strong> {stations?.length || 0}
          </div>
          
          <div className="mb-2">
            <strong>Permissions:</strong>
            <ul className="ml-4">
              <li>• storage</li>
              <li>• activeTab</li>
              <li>• https://radiocrestin.ro/*</li>
              <li>• https://*.radiocrestin.ro/*</li>
              <li>• https://api.radiocrestin.ro/*</li>
            </ul>
          </div>
          
          <button
            onClick={async () => {
              try {
                const response = await fetch('https://api.radiocrestin.ro/api/v1/stations?timestamp=' + Math.floor(Date.now() / 1000 / 10) * 10);
                console.log('Manual test response:', response.status, response.statusText);
                const data = await response.json();
                console.log('Manual test data:', data);
                alert(`Test successful! Got ${data?.data?.stations?.length || 0} stations`);
              } catch (err) {
                console.error('Manual test error:', err);
                alert(`Test failed: ${err}`);
              }
            }}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
          >
            Test API Call
          </button>
        </div>
      )}
    </div>
  );
}
