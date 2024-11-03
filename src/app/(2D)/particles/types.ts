export type ParticleOptions = {
  color: {
    opacity: number;
    particle: { r: number; g: number; b: number };
    connection: { r: number; g: number; b: number };
  };
  connectionDistance: number;
  lineWidth: number;
  particleCount?: number | null;
  particleCountFactor: number;
};
