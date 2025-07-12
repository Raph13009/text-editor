import React from 'react';
import { Target, Calendar, TrendingUp, Clock } from 'lucide-react';

const StatsBar = ({ store }) => {
  const activeSection = store.activeSection;
  const analytics = store.analytics;
  const settings = store.settings;

  if (!activeSection) {
    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-ink-light">
          Select a section to see statistics
        </div>
      </div>
    );
  }

  const wordCount = activeSection.wordCount || 0;
  const charCount = activeSection.content?.length || 0;
  const charCountNoSpaces = activeSection.content?.replace(/\s/g, '').length || 0;

  // Calculate daily progress
  const today = new Date().toISOString().split('T')[0];
  const todayWords = analytics.dailyWords[today] || 0;
  const dailyGoal = settings.dailyGoal || 1000;
  const progressPercentage = Math.min((todayWords / dailyGoal) * 100, 100);

  // Calculate total words for the project
  const totalProjectWords = store.activeProject?.sections?.reduce(
    (total, section) => total + (section.wordCount || 0),
    0
  ) || 0;

  // Calculate reading time (average 200 words per minute)
  const readingTime = Math.ceil(wordCount / 200);

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-6">
        {/* Current Section Stats */}
        <div className="flex items-center gap-4">
          <div className="text-ink">
            <span className="font-medium">{formatNumber(wordCount)}</span>
            <span className="text-ink-light ml-1">words</span>
          </div>
          <div className="text-ink">
            <span className="font-medium">{formatNumber(charCount)}</span>
            <span className="text-ink-light ml-1">characters</span>
          </div>
          <div className="text-ink">
            <span className="font-medium">{formatNumber(charCountNoSpaces)}</span>
            <span className="text-ink-light ml-1">no spaces</span>
          </div>
          {wordCount > 0 && (
            <div className="flex items-center gap-1 text-ink">
              <Clock size={14} />
              <span className="font-medium">{readingTime}</span>
              <span className="text-ink-light">min read</span>
            </div>
          )}
        </div>

        {/* Project Stats */}
        <div className="w-px h-4 bg-gray-300" />
        <div className="flex items-center gap-1 text-ink">
          <TrendingUp size={14} />
          <span className="font-medium">{formatNumber(totalProjectWords)}</span>
          <span className="text-ink-light">total words</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Daily Progress */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Target size={14} className="text-accent" />
            <span className="text-ink">
              <span className="font-medium">{formatNumber(todayWords)}</span>
              <span className="text-ink-light">/{formatNumber(dailyGoal)}</span>
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <span className="text-xs text-ink-light font-medium">
            {Math.round(progressPercentage)}%
          </span>
        </div>

        {/* Today's Date */}
        <div className="flex items-center gap-1 text-ink-light">
          <Calendar size={14} />
          <span className="text-sm">
            {new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>

        {/* Writing Streak */}
        {analytics.streak > 0 && (
          <>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-1 text-ink">
              <span className="text-accent font-medium">🔥</span>
              <span className="font-medium">{analytics.streak}</span>
              <span className="text-ink-light">day streak</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatsBar; 