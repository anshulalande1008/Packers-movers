import { sampleResponse } from "./sampleData.js";
import { normalizeMoves } from "./api.js";

export const normalizeSample = () => normalizeMoves(sampleResponse);
