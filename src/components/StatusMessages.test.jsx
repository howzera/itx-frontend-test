import { act, render, screen } from '@testing-library/react';
import { Loader } from './StatusMessages.jsx';

test('after 3 s the loader explains that the server may be waking up', () => {
  vi.useFakeTimers();
  render(<Loader />);

  expect(screen.queryByText(/despertando/)).not.toBeInTheDocument();

  act(() => vi.advanceTimersByTime(3000));

  expect(screen.getByText(/despertando/)).toBeInTheDocument();
  vi.useRealTimers();
});
