import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CmsSectionEditor } from "@/components/admin/CmsSectionEditor";
import { ToastProvider } from "@/context/ToastContext";
import * as cmsApi from "@/lib/api/cms";

vi.mock("@/lib/api/cms", () => ({
  getCmsSection: vi.fn(),
  updateCmsSection: vi.fn(),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{ui}</ToastProvider>
    </QueryClientProvider>
  );
}

describe("CmsSectionEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const initialData = {
    heading: "Welcome",
    subtext: "A short subtext",
  };

  it("renders a text input per top-level string field, pre-filled with initial data", () => {
    renderWithProviders(<CmsSectionEditor section="about" initialData={initialData as any} />);
    expect(screen.getByDisplayValue("Welcome")).toBeInTheDocument();
    expect(screen.getByDisplayValue("A short subtext")).toBeInTheDocument();
  });

  it("submits the edited field values to the mutation with the correct shape", async () => {
    const updateMock = vi.mocked(cmsApi.updateCmsSection).mockResolvedValue({
      heading: "Updated heading",
      subtext: "A short subtext",
    } as any);

    const user = userEvent.setup();
    renderWithProviders(<CmsSectionEditor section="about" initialData={initialData as any} />);

    const headingInput = screen.getByDisplayValue("Welcome");
    await user.clear(headingInput);
    await user.type(headingInput, "Updated heading");

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith(
        "about",
        expect.objectContaining({ heading: "Updated heading", subtext: "A short subtext" })
      );
    });
  });
});
