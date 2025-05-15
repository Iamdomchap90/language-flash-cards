import { render, screen, waitFor, within, act } from '@testing-library/react';
import Vocabulary from './page';
import fetchMock from 'jest-fetch-mock';

const defaultMockResponse = JSON.stringify([
  {
    englishText: 'hello',
    translationText: 'привет',
    wordType: 'greeting',
    verbType: 'none',
    tags: ['basic', 'common'],
    language: 'Russian',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/en/vocabulary',
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: () => ({
    data: { user: { name: 'Test User' } },
    status: 'authenticated',
  }),
}));

beforeEach(async () => {
  const currentTestName: string | undefined = expect.getState().currentTestName;
  fetchMock.resetMocks();
  localStorage.clear();

  if (
    typeof currentTestName === 'string' &&
    currentTestName.includes('Before mount')
  ) {
    return;
  }

  fetchMock.mockResponse(defaultMockResponse);

  await act(async () => {
    render(<Vocabulary />);
  });
});

test('Checks initial error and answer state', async () => {
  await waitFor(() => {
    const container = screen.getByTestId('error-display');
    expect(within(container).getByText(/^0[\s\S]*0$/)).toBeInTheDocument();
  });
});

test('Should set prevPath from localStorage and update it', async () => {
  localStorage.setItem('prevPath', '/en/vocabulary');

  const setItemSpy = jest.spyOn(localStorage.__proto__, 'setItem');
  render(<Vocabulary />);

  await waitFor(() => {
    expect(setItemSpy).toHaveBeenCalledWith('prevPath', '/en/vocabulary');
  });
});

test('Should set hasMounted to true and render full content', async () => {
  expect(screen.getByText('hello')).toBeInTheDocument();
});

test('Before mount should render loading content', async () => {
  fetchMock.mockResponseOnce(
    () =>
      new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            status: 200,
            body: defaultMockResponse,
          });
        }, 1000)
      )
  );

  await act(async () => {
    render(<Vocabulary />);
  });
  expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
});
