import { useCallback, useMemo, useState } from 'react';

export function useDecibel() {
  const [db, setDb] = useState(0);
  const [maxDb, setMaxDb] = useState(0);
  const [avgDb, setAvgDb] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const start = useCallback(() => {
    setIsRecording(true);
    setDb(42);
    setMaxDb(42);
    setAvgDb(42);
  }, []);

  const stop = useCallback(() => {
    setIsRecording(false);
    setDb(0);
  }, []);

  return useMemo(
    () => ({ db, maxDb, avgDb, isRecording, start, stop }),
    [avgDb, db, isRecording, maxDb, start, stop]
  );
}
