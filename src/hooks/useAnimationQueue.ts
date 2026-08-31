import { useEffect, useRef } from 'react';
import {
  applyAnimationTask,
  clearAnimationTask,
  eventToAnimationTasks,
  scaleAnimationDuration,
  wait,
} from '@/services/animation';
import { useGameStore } from '@/store/gameStore';
import type { AnimationTask } from '@/types/animation';

/**
 * Subscribes to game events and plays visual animations sequentially.
 * Never modifies gameplay state — only the animation slice.
 */
export function useAnimationQueue() {
  const processedEventCountRef = useRef(0);
  const processingRef = useRef(false);
  const taskQueueRef = useRef<AnimationTask[]>([]);

  const events = useGameStore((state) => state.events.events);

  useEffect(() => {
    if (events.length === 0) {
      processedEventCountRef.current = 0;
      taskQueueRef.current = [];
    }
  }, [events.length]);

  useEffect(() => {
    if (events.length <= processedEventCountRef.current) {
      return;
    }

    const newEvents = events.slice(processedEventCountRef.current);
    processedEventCountRef.current = events.length;

    const newTasks = newEvents.flatMap((event) => eventToAnimationTasks(event));
    if (newTasks.length === 0) {
      return;
    }

    taskQueueRef.current.push(...newTasks);
    useGameStore.getState().patchSlice('animation', {
      queue: [...taskQueueRef.current],
    });

    if (!processingRef.current) {
      void processQueue();
    }
  }, [events]);

  async function processQueue() {
    if (processingRef.current) {
      return;
    }

    processingRef.current = true;

    while (taskQueueRef.current.length > 0) {
      const task = taskQueueRef.current.shift();
      if (!task) {
        break;
      }

      const store = useGameStore.getState();
      const duration = scaleAnimationDuration(
        task.durationMs,
        store.settings.animationSpeed,
      );
      const withTask = applyAnimationTask(store.animation, task);

      store.setAnimation({
        ...withTask,
        playing: true,
        queue: [...taskQueueRef.current],
      });

      await wait(duration);

      const afterStore = useGameStore.getState();
      const cleared = clearAnimationTask(afterStore.animation, task);

      afterStore.setAnimation({
        ...cleared,
        playing: taskQueueRef.current.length > 0,
        queue: [...taskQueueRef.current],
      });
    }

    processingRef.current = false;

    const finalStore = useGameStore.getState();
    if (finalStore.animation.playing && taskQueueRef.current.length === 0) {
      finalStore.setAnimation({
        ...finalStore.animation,
        playing: false,
        current: null,
        queue: [],
      });
    }
  }
}
