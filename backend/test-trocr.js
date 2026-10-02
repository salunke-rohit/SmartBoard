import { getOCRPipeline } from "./services/trocrService.js";

console.log("Testing TrOCR...");

await getOCRPipeline();

console.log("TrOCR test successful!");