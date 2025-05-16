import { useRef, useEffect, useState, ReactNode } from 'react';
import { Box } from '@mui/material';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
}

export default function VirtualizedList<T>({
  items,
  itemHeight,
  renderItem,
  overscan = 3,
  className,
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, clientHeight } = container;
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.min(
        items.length,
        Math.ceil((scrollTop + clientHeight) / itemHeight)
      );

      setVisibleRange({
        start: Math.max(0, start - overscan),
        end: Math.min(items.length, end + overscan),
      });
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [items.length, itemHeight, overscan]);

  const totalHeight = items.length * itemHeight;
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  const offsetY = visibleRange.start * itemHeight;

  return (
    <Box
      ref={containerRef}
      className={className}
      sx={{
        height: '100%',
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleItems.map((item, index) =>
            renderItem(item, index + visibleRange.start)
          )}
        </Box>
      </Box>
    </Box>
  );
} 