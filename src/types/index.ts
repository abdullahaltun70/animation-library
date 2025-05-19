export type AnimationType = "fade" | "slide" | "scale" | "rotate" | "bounce";
export type SlideAxis = "x" | "y";

export interface AnimationConfig {
  type: AnimationType;
  duration?: number;
  delay?: number;
  easing?: string;
  distance?: number; // Used for slide, bounce
  degrees?: number; // Used for rotate
  scale?: number; // Used for scale
  opacity?: {
    // Used for fade
    start?: number;
    end?: number;
  };
  axis?: SlideAxis; // Add this for slide animation
}
