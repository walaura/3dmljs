import { Spot } from '../types';
import testData from './test-data.json';

// The parsed data has the root 'spot' key
interface Parsed {
    spot: Spot;
}

// This assignment will fail at compile time if the types don't match
const typedData: Parsed = testData;

// If this compiles without errors, the typedefs are valid
console.log('Type validation passed:', typedData);