
import { AnalysisProcessorProps, AnalysisHandlerProps } from './types/analysisTypes';
import { handleAnalysisComplete } from './handlers/analysisHandler';
import { preloadSampleData } from './utils/sampleDataLoader';

export type { AnalysisProcessorProps } from './types/analysisTypes';

// Export handleAnalysisComplete for external use (needed for tests)
export { handleAnalysisComplete } from './handlers/analysisHandler';

// Run preload for sample data (this is side-effect only)
preloadSampleData();
