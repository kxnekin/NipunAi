class SpeechAnalysis {
  constructor() {
    this.transcriptHistory = [];
    this.confidenceMetrics = {
      speakingRate: 0,
      pauseFrequency: 0,
      fillerWords: 0,
      repetitionCount: 0,
      overallConfidence: 100,
      totalWords: 0
    };
    this.fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally', 'so', 'right', 'okay'];
  }

  analyzeConfidence(transcript) {
    if (!transcript || transcript.trim().length < 10) {
      return {
        ...this.confidenceMetrics,
        totalWords: 0
      };
    }

    const words = transcript.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const totalWords = words.length;
    
    if (totalWords === 0) {
      return {
        ...this.confidenceMetrics,
        totalWords: 0
      };
    }

    // Calculate speaking rate (words per minute estimate)
    const speakingRate = this.calculateSpeakingRate(words);
    
    // Count filler words
    const fillerWordsCount = words.filter(word => 
      this.fillerWords.includes(word.replace(/[.,!?;]/g, ''))
    ).length;
    
    // Detect repetitions
    const repetitionCount = this.detectRepetitions(words);
    
    // Calculate pause frequency (based on transcript patterns)
    const pauseFrequency = this.calculatePauseFrequency(transcript);
    
    // Calculate overall confidence score (0-100)
    const overallConfidence = this.calculateOverallConfidence(
      speakingRate,
      fillerWordsCount,
      repetitionCount,
      pauseFrequency,
      totalWords
    );

    this.confidenceMetrics = {
      speakingRate: Math.round(speakingRate),
      pauseFrequency,
      fillerWords: fillerWordsCount,
      repetitionCount,
      overallConfidence,
      totalWords
    };

    return this.confidenceMetrics;
  }

  calculateSpeakingRate(words) {
    // Simple estimation - in a real scenario, you'd use timing data
    const averageWordLength = 5; // characters
    const averageSpeakingRate = 150; // words per minute
    
    const totalCharacters = words.join('').length;
    const estimatedDuration = totalCharacters / (averageWordLength * averageSpeakingRate / 60);
    const wordsPerMinute = words.length / Math.max(estimatedDuration, 0.1) * 60;
    
    return Math.min(wordsPerMinute, 300); // Cap at 300 WPM
  }

  detectRepetitions(words) {
    let repetitions = 0;
    const repetitionThreshold = 2; // Minimum consecutive repeats
    
    for (let i = 0; i < words.length - 1; i++) {
      let currentRepetitions = 0;
      for (let j = i + 1; j < words.length; j++) {
        if (words[j] === words[i] && words[j].length > 2) {
          currentRepetitions++;
        } else {
          break;
        }
      }
      if (currentRepetitions >= repetitionThreshold) {
        repetitions++;
        i += currentRepetitions; // Skip the repeated words
      }
    }
    
    return repetitions;
  }

  calculatePauseFrequency(transcript) {
    // Detect pauses based on punctuation and speech patterns
    const pauseIndicators = transcript.match(/[.,!?;]\s+/g) || [];
    return pauseIndicators.length;
  }

  calculateOverallConfidence(speakingRate, fillerWords, repetitions, pauses, totalWords) {
    let score = 100;
    
    // Penalize for filler words (max 20% penalty)
    const fillerPenalty = Math.min((fillerWords / Math.max(totalWords, 1)) * 100, 20);
    score -= fillerPenalty;
    
    // Penalize for repetitions (max 15% penalty)
    const repetitionPenalty = Math.min(repetitions * 5, 15);
    score -= repetitionPenalty;
    
    // Adjust for speaking rate (optimal 120-180 WPM)
    if (speakingRate < 100 || speakingRate > 220) {
      score -= 10;
    } else if (speakingRate < 120 || speakingRate > 180) {
      score -= 5;
    }
    
    // Adjust for pause frequency (moderate pauses are good)
    const pauseRatio = pauses / Math.max(totalWords, 1);
    if (pauseRatio > 0.2) { // Too many pauses
      score -= 10;
    } else if (pauseRatio < 0.05) { // Too few pauses
      score -= 5;
    }
    
    return Math.max(0, Math.round(score));
  }

  getConfidenceFeedback(metrics) {
    const feedback = [];
    const suggestions = [];
    
    if (metrics.overallConfidence >= 80) {
      feedback.push('Excellent confidence and delivery');
    } else if (metrics.overallConfidence >= 60) {
      feedback.push('Good confidence with some room for improvement');
    } else {
      feedback.push('Work on building more confidence in delivery');
    }
    
    if (metrics.fillerWords > metrics.totalWords * 0.05) {
      suggestions.push('Reduce filler words like "um", "uh", "like"');
    }
    
    if (metrics.repetitionCount > 2) {
      suggestions.push('Avoid repeating words and phrases');
    }
    
    if (metrics.speakingRate < 100) {
      suggestions.push('Try speaking at a slightly faster pace');
    } else if (metrics.speakingRate > 200) {
      suggestions.push('Slow down your speaking pace for clarity');
    }
    
    if (metrics.pauseFrequency < metrics.totalWords * 0.05) {
      suggestions.push('Use strategic pauses for emphasis');
    } else if (metrics.pauseFrequency > metrics.totalWords * 0.15) {
      suggestions.push('Reduce excessive pausing');
    }
    
    return {
      feedback: feedback.join('. '),
      suggestions: suggestions.length > 0 ? suggestions : ['Maintain your current speaking style'],
      confidenceLevel: metrics.overallConfidence >= 80 ? 'High' : 
                      metrics.overallConfidence >= 60 ? 'Medium' : 'Low'
    };
  }

  reset() {
    this.transcriptHistory = [];
    this.confidenceMetrics = {
      speakingRate: 0,
      pauseFrequency: 0,
      fillerWords: 0,
      repetitionCount: 0,
      overallConfidence: 100,
      totalWords: 0
    };
  }
}

export default SpeechAnalysis;