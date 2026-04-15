import { animate, inView } from "motion";

export const standardEase = [0.22, 1, 0.36, 1] as const;

type MotionAxis = "x" | "y";

interface AxisFadeConfig {
  axis: MotionAxis;
  from: number;
  duration: number;
}

interface InViewAxisFadeConfig extends AxisFadeConfig {
  delayMs?: number;
  initializedDatasetKey: string;
  margin?: string;
}

interface StaggeredAxisFadeConfig extends AxisFadeConfig {
  staggerDelayMs: number;
  animatedDatasetKey: string;
}

export const wait = (duration: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const setElementAxisPosition = (
  element: HTMLElement,
  axis: MotionAxis,
  value: number | string,
) => {
  const axisMethod = axis === "x" ? "translateX" : "translateY";
  element.style.transform = `${axisMethod}(${typeof value === "number" ? `${value}px` : value})`;
};

export const revealElementImmediately = (element: HTMLElement, axis: MotionAxis) => {
  element.style.opacity = "1";
  setElementAxisPosition(element, axis, 0);
};

export const animateAxisFade = (element: HTMLElement, { axis, from, duration }: AxisFadeConfig) => {
  if (prefersReducedMotion()) {
    revealElementImmediately(element, axis);
    return Promise.resolve();
  }

  const animation = animate(
    element,
    {
      opacity: [0, 1],
      [axis]: [from, 0],
    },
    {
      duration,
      ease: standardEase,
    },
  );

  return animation.then(() => {
    revealElementImmediately(element, axis);
  });
};

export const initializeInViewAxisFade = (
  elements: HTMLElement[],
  {
    axis,
    from,
    duration,
    delayMs = 0,
    initializedDatasetKey,
    margin = "0px 0px -10% 0px",
  }: InViewAxisFadeConfig,
) => {
  if (elements.length === 0) {
    return;
  }

  elements.forEach((element) => {
    if (element.dataset[initializedDatasetKey] === "true") {
      return;
    }

    element.dataset[initializedDatasetKey] = "true";

    if (prefersReducedMotion()) {
      revealElementImmediately(element, axis);
      return;
    }

    const stopWatching = inView(
      element,
      () => {
        void (async () => {
          if (delayMs > 0) {
            await wait(delayMs);
          }

          await animateAxisFade(element, { axis, from, duration });
        })();

        stopWatching();
      },
      { margin },
    );
  });
};

export const animateStaggeredAxisFade = async (
  elements: HTMLElement[],
  {
    axis,
    from,
    duration,
    staggerDelayMs,
    animatedDatasetKey,
  }: StaggeredAxisFadeConfig,
) => {
  const reducedMotion = prefersReducedMotion();
  const animationTasks = elements.map(async (element, index) => {
    if (element.dataset[animatedDatasetKey] === "true") {
      return;
    }

    if (!reducedMotion && index > 0) {
      await wait(index * staggerDelayMs);
    }

    await animateAxisFade(element, { axis, from, duration });
    element.dataset[animatedDatasetKey] = "true";
  });

  await Promise.all(animationTasks);
};
