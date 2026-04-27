import { CheckCircle, Circle } from 'lucide-react';
import { CollectedData, OLDCARTS_FIELDS, OLDCARTS_LABELS, ROS_SYSTEMS, ROS_LABELS } from '../../types/clinical.types';
import { ProgressRing } from '../shared/ProgressRing';
import { Button } from '../shared/Button';

interface ProgressTrackerProps {
  collectedData: CollectedData;
  oldcartsCount: number;
  rosCount: number;
  onGenerateBrief: () => void;
  isGenerating: boolean;
}

export function ProgressTracker({
  collectedData, oldcartsCount, rosCount, onGenerateBrief, isGenerating
}: ProgressTrackerProps) {
  const totalFields = OLDCARTS_FIELDS.length + ROS_SYSTEMS.length;
  const totalDone = oldcartsCount + rosCount;
  const percent = Math.round((totalDone / totalFields) * 100);
  const canGenerate = oldcartsCount >= 6;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-[#C8E6D4] flex items-center gap-3">
        <ProgressRing percent={percent} size={56} label="done" />
        <div>
          <p className="text-sm font-semibold text-[#0D2818]">Data Collection</p>
          <p className="text-xs text-[#7A9E87]">{totalDone}/{totalFields} fields captured</p>
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* OLDCARTS */}
        <div>
          <p className="text-xs font-semibold text-[#3D6B50] uppercase tracking-wide mb-2">
            HPI — OLDCARTS ({oldcartsCount}/8)
          </p>
          <div className="space-y-1">
            {OLDCARTS_FIELDS.map((field) => {
              const val = collectedData.oldcarts[field];
              return (
                <div key={field} className="flex items-start gap-2">
                  {val
                    ? <CheckCircle className="w-4 h-4 text-[#1B6B3A] flex-shrink-0 mt-0.5" />
                    : <Circle className="w-4 h-4 text-[#C8E6D4] flex-shrink-0 mt-0.5" />
                  }
                  <div className="min-w-0">
                    <p className={`text-xs font-medium ${val ? 'text-[#0D2818]' : 'text-[#7A9E87]'}`}>
                      {OLDCARTS_LABELS[field]}
                    </p>
                    {val && <p className="text-[10px] text-[#3D6B50] truncate">{val}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROS */}
        <div>
          <p className="text-xs font-semibold text-[#3D6B50] uppercase tracking-wide mb-2">
            Review of Systems ({rosCount}/6)
          </p>
          <div className="space-y-1">
            {ROS_SYSTEMS.map((system) => {
              const val = collectedData.ros[system];
              return (
                <div key={system} className="flex items-start gap-2">
                  {val
                    ? <CheckCircle className="w-4 h-4 text-[#1B6B3A] flex-shrink-0 mt-0.5" />
                    : <Circle className="w-4 h-4 text-[#C8E6D4] flex-shrink-0 mt-0.5" />
                  }
                  <div className="min-w-0">
                    <p className={`text-xs font-medium ${val ? 'text-[#0D2818]' : 'text-[#7A9E87]'}`}>
                      {ROS_LABELS[system]}
                    </p>
                    {val && <p className="text-[10px] text-[#3D6B50] truncate">{val}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Generate brief button */}
      {canGenerate && (
        <div className="p-4 border-t border-[#C8E6D4]">
          <Button
            size="sm"
            className="w-full"
            onClick={onGenerateBrief}
            loading={isGenerating}
          >
            Generate Clinical Brief
          </Button>
        </div>
      )}
    </div>
  );
}
